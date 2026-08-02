import { z } from "zod";
import { TABLA_RETENCION_ALAVA_2026, TABLA_MINORACION_DISCAPACIDAD_2026, TramoRetencion, TramoMinoracionDiscapacidad } from "./retencionAlava";
import { SS_2026 } from "./seguridadSocial";
import type { ConfiguracionResuelta } from "./calculadora";

/**
 * Forma serializable (Firestore/JSON) de un tramo de la tabla de retención
 * IRPF. `hasta: null` representa el último tramo, sin límite superior
 * (Firestore no admite `Infinity` como valor numérico).
 */
export interface TramoRetencionDoc {
  hasta: number | null;
  porcentajes: [number, number, number, number, number, number, number];
}

/** Forma serializable de un tramo de la tabla de minoración por discapacidad. */
export interface TramoMinoracionDoc {
  hasta: number | null;
  a: number;
  bc: number;
}

export interface SeguridadSocialConfig {
  baseMaximaMensual: number;
  contingenciasComunes: number; // porcentaje, p.ej. 4.7
  desempleoIndefinido: number;
  desempleoTemporal: number;
  formacionProfesional: number;
  mei: number;
}

export interface ConfiguracionCalculo {
  tablaRetencionIrpf: TramoRetencionDoc[];
  /** Si no es null, sustituye la búsqueda en tablaRetencionIrpf. */
  irpfPorcentajeFijo: number | null;
  tablaMinoracionDiscapacidad: TramoMinoracionDoc[];
  /** Si no es null, sustituye la búsqueda en tablaMinoracionDiscapacidad para cualquier grado != "ninguno". */
  minoracionPuntosFijo: number | null;
  seguridadSocial: SeguridadSocialConfig;
}

const porcentajesTupla = z.tuple([
  z.number().min(0).max(100),
  z.number().min(0).max(100),
  z.number().min(0).max(100),
  z.number().min(0).max(100),
  z.number().min(0).max(100),
  z.number().min(0).max(100),
  z.number().min(0).max(100),
]);

function tramosAscendentesConUltimoSinLimite<T extends { hasta: number | null }>(tramos: T[]) {
  for (let i = 0; i < tramos.length; i++) {
    const esUltimo = i === tramos.length - 1;
    if (esUltimo) {
      if (tramos[i].hasta !== null) return false;
    } else {
      const actual = tramos[i].hasta;
      const siguiente = tramos[i + 1].hasta;
      if (actual === null) return false;
      if (siguiente !== null && actual >= siguiente) return false;
    }
  }
  return true;
}

const tramoRetencionSchema = z.object({
  hasta: z.number().positive().nullable(),
  porcentajes: porcentajesTupla,
});

const tramoMinoracionSchema = z.object({
  hasta: z.number().positive().nullable(),
  a: z.number().min(0).max(100),
  bc: z.number().min(0).max(100),
});

export const configuracionSchema = z.object({
  tablaRetencionIrpf: z
    .array(tramoRetencionSchema)
    .min(1)
    .refine(tramosAscendentesConUltimoSinLimite, {
      message: "Los tramos deben estar en orden ascendente y solo el último puede no tener límite.",
    }),
  irpfPorcentajeFijo: z.number().min(0).max(100).nullable(),
  tablaMinoracionDiscapacidad: z
    .array(tramoMinoracionSchema)
    .min(1)
    .refine(tramosAscendentesConUltimoSinLimite, {
      message: "Los tramos deben estar en orden ascendente y solo el último puede no tener límite.",
    }),
  minoracionPuntosFijo: z.number().min(0).max(100).nullable(),
  seguridadSocial: z.object({
    baseMaximaMensual: z.number().positive(),
    contingenciasComunes: z.number().min(0).max(100),
    desempleoIndefinido: z.number().min(0).max(100),
    desempleoTemporal: z.number().min(0).max(100),
    formacionProfesional: z.number().min(0).max(100),
    mei: z.number().min(0).max(100),
  }),
});

/**
 * Valida y normaliza un documento leído de Firestore. Lanza si no cumple el
 * schema — quien la invoque decide si usar CONFIGURACION_DEFECTO como
 * fallback (p.ej. si el documento se editó a mano y quedó corrupto).
 */
export function configuracionDesdeFirestore(data: unknown): ConfiguracionCalculo {
  return configuracionSchema.parse(data);
}

export const CONFIGURACION_DEFECTO: ConfiguracionCalculo = {
  tablaRetencionIrpf: TABLA_RETENCION_ALAVA_2026.map((tramo) => ({
    hasta: Number.isFinite(tramo.hasta) ? tramo.hasta : null,
    porcentajes: tramo.porcentajes,
  })),
  irpfPorcentajeFijo: null,
  tablaMinoracionDiscapacidad: TABLA_MINORACION_DISCAPACIDAD_2026.map((tramo) => ({
    hasta: Number.isFinite(tramo.hasta) ? tramo.hasta : null,
    a: tramo.a,
    bc: tramo.bc,
  })),
  minoracionPuntosFijo: null,
  seguridadSocial: {
    baseMaximaMensual: SS_2026.baseMaximaMensual,
    contingenciasComunes: SS_2026.contingenciasComunes.trabajador * 100,
    desempleoIndefinido: SS_2026.desempleo.indefinido.trabajador * 100,
    desempleoTemporal: SS_2026.desempleo.temporal.trabajador * 100,
    formacionProfesional: SS_2026.formacionProfesional.trabajador * 100,
    mei: SS_2026.mei.trabajador * 100,
  },
};

function desdeDelTramo(hastaAnterior: number | undefined): number {
  return hastaAnterior === undefined ? 0 : hastaAnterior + 0.01;
}

function resolverTablaRetencion(tramos: TramoRetencionDoc[]): TramoRetencion[] {
  const resultado: TramoRetencion[] = [];
  for (const tramo of tramos) {
    resultado.push({
      desde: desdeDelTramo(resultado.at(-1)?.hasta),
      hasta: tramo.hasta ?? Infinity,
      porcentajes: tramo.porcentajes,
    });
  }
  return resultado;
}

function resolverTablaMinoracion(tramos: TramoMinoracionDoc[]): TramoMinoracionDiscapacidad[] {
  const resultado: TramoMinoracionDiscapacidad[] = [];
  for (const tramo of tramos) {
    resultado.push({
      desde: desdeDelTramo(resultado.at(-1)?.hasta),
      hasta: tramo.hasta ?? Infinity,
      a: tramo.a,
      bc: tramo.bc,
    });
  }
  return resultado;
}

/**
 * Convierte la configuración en su forma serializable (Firestore/JSON, con
 * `hasta: null` para el último tramo y tasas de SS en porcentaje) a la forma
 * interna que consumen las funciones de dominio (`hasta: Infinity`, tasas
 * como fracciones, y `desde` derivado del tramo anterior).
 */
export function resolverConfiguracion(configuracion: ConfiguracionCalculo): ConfiguracionResuelta {
  const tablaRetencionIrpf = resolverTablaRetencion(configuracion.tablaRetencionIrpf);
  const tablaMinoracionDiscapacidad = resolverTablaMinoracion(configuracion.tablaMinoracionDiscapacidad);

  const ss = configuracion.seguridadSocial;
  return {
    tablaRetencionIrpf,
    irpfPorcentajeFijo: configuracion.irpfPorcentajeFijo,
    tablaMinoracionDiscapacidad,
    minoracionPuntosFijo: configuracion.minoracionPuntosFijo,
    seguridadSocial: {
      baseMaximaMensual: ss.baseMaximaMensual,
      contingenciasComunes: ss.contingenciasComunes / 100,
      desempleoIndefinido: ss.desempleoIndefinido / 100,
      desempleoTemporal: ss.desempleoTemporal / 100,
      formacionProfesional: ss.formacionProfesional / 100,
      mei: ss.mei / 100,
    },
  };
}
