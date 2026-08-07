import { GradoDiscapacidad } from "./types";

/**
 * Cálculo de la retención de IRPF bajo el régimen común estatal ("resto de
 * España": todo el territorio español salvo Álava/Araba, Bizkaia, Gipuzkoa y
 * Navarra). A diferencia de los territorios forales, el Estado no publica
 * una tabla de tramos x descendientes: el tipo se obtiene con el
 * "procedimiento general de determinación del tipo de retención" (arts. 80 a
 * 90 del Reglamento del IRPF, RD 439/2007, y arts. 19, 20, 60 y 101 de la Ley
 * 35/2006 del IRPF).
 *
 * Fuente de todos los importes y umbrales usados aquí: ALGORITMO_2026 de la
 * Agencia Tributaria (documento técnico oficial que usan los programas de
 * nómina certificados, publicado 26-dic-2025, sede.agenciatributaria.gob.es),
 * confirmado sin cambios de escala ni de mínimos respecto a 2025.
 *
 * SIMPLIFICACIÓN DELIBERADA: el procedimiento real depende también de la
 * situación familiar (soltero/a, casado/a con cónyuge sin rentas, etc.), de
 * ascendientes a cargo, de bonificaciones por movilidad geográfica,
 * desempleo o pensión, y de si la relación laboral dura menos de un año —
 * datos que esta calculadora no recoge. Se asume el caso general más
 * habitual (sin cónyuge ni ascendientes a cargo, sin movilidad geográfica,
 * relación laboral ordinaria — "situación familiar 3" a efectos del límite
 * del 43% del art. 85.3 RIRPF). Por tanto este cálculo es una aproximación,
 * no el tipo exacto que aplicaría cualquier nómina real bajo este régimen.
 */

const GASTO_GENERICO = 2000;

/** Art. 19.2.f) LIRPF / art. 83.3 RIRPF — gasto deducible adicional para personas trabajadoras activas con discapacidad. */
const DEDUCCION_DISCAPACIDAD_ACTIVO: Record<GradoDiscapacidad, number> = {
  ninguno: 0,
  "33_65_sin_movilidad": 3500,
  "33_65_con_movilidad": 7750,
  "65_o_mas": 7750,
};

/** Art. 60 LIRPF — mínimo por discapacidad (incluye gastos de asistencia cuando procede). */
const MINIMO_DISCAPACIDAD: Record<GradoDiscapacidad, number> = {
  ninguno: 0,
  "33_65_sin_movilidad": 3000,
  "33_65_con_movilidad": 3000 + 3000,
  "65_o_mas": 9000 + 3000,
};

const MINIMO_CONTRIBUYENTE = 5550;
/** Art. 58 LIRPF — mínimo por descendientes: 1º, 2º, 3º, 4º y siguientes (cada uno). */
const MINIMOS_DESCENDIENTES = [2400, 2700, 4000, 4500];

/** Art. 81 RIRPF, "situación familiar 3" (caso general asumido) — umbral para el límite del 43% del art. 85.3. */
const UMBRAL_SITUACION_3 = [15876, 16342, 16867]; // 0, 1, 2+ hijos

/** Art. 101 LIRPF / art. 85 RIRPF — escala general de la cuota de retención. */
const ESCALA = [
  { desde: 0, hasta: 12450, cuota: 0, tipo: 0.19 },
  { desde: 12450, hasta: 20200, cuota: 2365.5, tipo: 0.24 },
  { desde: 20200, hasta: 35200, cuota: 4225.5, tipo: 0.3 },
  { desde: 35200, hasta: 60000, cuota: 8725.5, tipo: 0.37 },
  { desde: 60000, hasta: 300000, cuota: 17901.5, tipo: 0.45 },
  { desde: 300000, hasta: Infinity, cuota: 125901.5, tipo: 0.47 },
];

function escalaGeneral(base: number): number {
  if (base <= 0) return 0;
  const tramo = ESCALA.find((t) => base <= t.hasta) ?? ESCALA[ESCALA.length - 1];
  return tramo.cuota + (base - tramo.desde) * tramo.tipo;
}

function minimoPorDescendientes(numeroDescendientes: number): number {
  const n = Math.max(0, Math.floor(numeroDescendientes));
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += MINIMOS_DESCENDIENTES[Math.min(i, MINIMOS_DESCENDIENTES.length - 1)];
  }
  return total;
}

/**
 * Calcula el tipo de retención del IRPF bajo el régimen común estatal para
 * un rendimiento anual del trabajo dado. `cotizacionesSSAnual` es la
 * cotización real a la Seguridad Social a cargo de la persona trabajadora
 * (gasto deducible, art. 19.2.a LIRPF) — ya se calcula en `calculadora.ts`.
 */
export function calcularTipoRetencionEstado(
  rendimientoAnual: number,
  numeroDescendientes: number,
  gradoDiscapacidad: GradoDiscapacidad,
  cotizacionesSSAnual: number,
): number {
  if (rendimientoAnual <= 0) return 0;

  const n = Math.max(0, Math.floor(numeroDescendientes));

  const gastosDeducibles = cotizacionesSSAnual + GASTO_GENERICO + DEDUCCION_DISCAPACIDAD_ACTIVO[gradoDiscapacidad];
  const rendimientoNetoPrevio = Math.max(0, rendimientoAnual - gastosDeducibles);

  let reduccionArt20: number;
  if (rendimientoNetoPrevio <= 14852) {
    reduccionArt20 = 7302;
  } else if (rendimientoNetoPrevio <= 17673.52) {
    reduccionArt20 = 7302 - 1.75 * (rendimientoNetoPrevio - 14852);
  } else if (rendimientoNetoPrevio < 19747.5) {
    reduccionArt20 = 2364.34 - 1.14 * (rendimientoNetoPrevio - 17673.52);
  } else {
    reduccionArt20 = 0;
  }
  reduccionArt20 = Math.max(0, reduccionArt20);

  const base = Math.max(0, rendimientoNetoPrevio - reduccionArt20);
  const minimoPersonalFamiliar = MINIMO_CONTRIBUYENTE + minimoPorDescendientes(n) + MINIMO_DISCAPACIDAD[gradoDiscapacidad];

  const cuota1 = escalaGeneral(base);
  const cuota2 = escalaGeneral(minimoPersonalFamiliar);
  let cuotaRetencion = Math.max(0, cuota1 - cuota2);

  if (rendimientoAnual <= 35200) {
    const umbral = UMBRAL_SITUACION_3[Math.min(n, UMBRAL_SITUACION_3.length - 1)];
    const cuotaMaxima43 = 0.43 * Math.max(0, rendimientoAnual - umbral);
    cuotaRetencion = Math.min(cuotaRetencion, cuotaMaxima43);
  }

  const tipo = (cuotaRetencion / rendimientoAnual) * 100;
  return Math.min(47, Math.max(0, Math.trunc(tipo * 100) / 100));
}
