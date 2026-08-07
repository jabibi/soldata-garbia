import { GradoDiscapacidad } from "./types";

/**
 * Tabla general de porcentajes de retención del IRPF sobre rendimientos del
 * trabajo. Cada fila: tramo de retribución anual íntegra (euros) y el
 * porcentaje de retención según el número de descendientes a cargo (columnas
 * 0..5, y "más de 5" en el índice 6).
 */
export interface TramoRetencion {
  desde: number;
  hasta: number; // Infinity para el último tramo
  porcentajes: [number, number, number, number, number, number, number];
}

/**
 * Escala de puntos de minoración para personas trabajadoras activas con
 * discapacidad. "a" = grado 33%-65% sin movilidad reducida. "bc" = grado
 * 33%-65% con movilidad reducida, o grado >= 65%.
 */
export interface TramoMinoracionDiscapacidad {
  desde: number;
  hasta: number;
  a: number;
  bc: number;
}

/**
 * Tabla de retención IRPF 2026 de Álava/Araba, Bizkaia y Gipuzkoa.
 *
 * Las tres Diputaciones Forales vascas armonizan cada año esta tabla, y para
 * 2026 son, en efecto, IDÉNTICAS tramo a tramo — verificado de forma
 * independiente contra cada texto legal, no asumido:
 * - Araba: Decreto Foral 42/2025, de 23 de diciembre, del Consejo de Gobierno
 *   Foral de Álava (BOTHA nº 147, 29-dic-2025), que modifica el art. 84.1 del
 *   Reglamento del IRPF (Decreto Foral 40/2014).
 * - Bizkaia: Decreto Foral 134/2025, de 29 de diciembre, de la Diputación
 *   Foral de Bizkaia (BOB nº 248, 30-dic-2025), que modifica los porcentajes
 *   de retención del art. 84 del Reglamento del IRPF de Bizkaia.
 * - Gipuzkoa: Decreto Foral 27/2025, de 23 de diciembre, del Consejo de
 *   Gobierno Foral de Gipuzkoa (BOG, 30-dic-2025), que modifica el art. 100
 *   del Reglamento del IRPF de Gipuzkoa (Decreto Foral 33/2014).
 * Todas aplicables a las retribuciones percibidas desde el 1-1-2026.
 */
export const TABLA_RETENCION_ARABA_BIZKAIA_GIPUZKOA_2026: TramoRetencion[] = [
  { desde: 0, hasta: 20000.0, porcentajes: [0, 0, 0, 0, 0, 0, 0] },
  { desde: 20000.01, hasta: 20510.0, porcentajes: [7, 5, 3, 0, 0, 0, 0] },
  { desde: 20510.01, hasta: 21300.0, porcentajes: [8, 6, 4, 1, 0, 0, 0] },
  { desde: 21300.01, hasta: 22150.0, porcentajes: [9, 7, 5, 2, 0, 0, 0] },
  { desde: 22150.01, hasta: 23220.0, porcentajes: [10, 9, 7, 4, 0, 0, 0] },
  { desde: 23220.01, hasta: 24050.0, porcentajes: [11, 10, 8, 5, 1, 0, 0] },
  { desde: 24050.01, hasta: 25410.0, porcentajes: [12, 11, 9, 6, 3, 0, 0] },
  { desde: 25410.01, hasta: 27440.0, porcentajes: [13, 12, 10, 7, 4, 0, 0] },
  { desde: 27440.01, hasta: 29790.0, porcentajes: [14, 13, 11, 9, 6, 2, 0] },
  { desde: 29790.01, hasta: 32610.0, porcentajes: [15, 14, 13, 10, 8, 4, 0] },
  { desde: 32610.01, hasta: 36350.0, porcentajes: [16, 15, 14, 12, 9, 6, 0] },
  { desde: 36350.01, hasta: 40670.0, porcentajes: [17, 16, 15, 13, 11, 8, 0] },
  { desde: 40670.01, hasta: 44560.0, porcentajes: [18, 17, 16, 15, 13, 10, 2] },
  { desde: 44560.01, hasta: 48060.0, porcentajes: [19, 18, 17, 16, 14, 12, 4] },
  { desde: 48060.01, hasta: 52020.0, porcentajes: [20, 19, 18, 17, 15, 13, 7] },
  { desde: 52020.01, hasta: 56780.0, porcentajes: [21, 20, 20, 18, 17, 15, 9] },
  { desde: 56780.01, hasta: 61820.0, porcentajes: [22, 21, 21, 20, 18, 16, 11] },
  { desde: 61820.01, hasta: 65710.0, porcentajes: [23, 22, 22, 21, 19, 18, 12] },
  { desde: 65710.01, hasta: 70080.0, porcentajes: [24, 23, 23, 22, 21, 19, 14] },
  { desde: 70080.01, hasta: 75020.0, porcentajes: [25, 25, 24, 23, 22, 20, 16] },
  { desde: 75020.01, hasta: 80730.0, porcentajes: [26, 26, 25, 24, 23, 22, 17] },
  { desde: 80730.01, hasta: 86770.0, porcentajes: [27, 27, 26, 25, 24, 23, 19] },
  { desde: 86770.01, hasta: 92190.0, porcentajes: [28, 28, 27, 26, 25, 24, 21] },
  { desde: 92190.01, hasta: 98350.0, porcentajes: [29, 29, 28, 27, 27, 25, 22] },
  { desde: 98350.01, hasta: 105380.0, porcentajes: [30, 30, 29, 29, 28, 27, 23] },
  { desde: 105380.01, hasta: 113180.0, porcentajes: [31, 31, 30, 30, 29, 28, 25] },
  { desde: 113180.01, hasta: 122030.0, porcentajes: [32, 32, 31, 31, 30, 29, 26] },
  { desde: 122030.01, hasta: 132200.0, porcentajes: [33, 33, 32, 32, 31, 30, 28] },
  { desde: 132200.01, hasta: 144140.0, porcentajes: [34, 34, 33, 33, 32, 32, 29] },
  { desde: 144140.01, hasta: 157300.0, porcentajes: [35, 35, 34, 34, 33, 33, 31] },
  { desde: 157300.01, hasta: 172280.0, porcentajes: [36, 36, 36, 35, 35, 34, 32] },
  { desde: 172280.01, hasta: 190410.0, porcentajes: [37, 37, 37, 36, 36, 35, 33] },
  { desde: 190410.01, hasta: 212820.0, porcentajes: [38, 38, 38, 37, 37, 36, 35] },
  { desde: 212820.01, hasta: 236060.0, porcentajes: [39, 39, 39, 38, 38, 37, 36] },
  { desde: 236060.01, hasta: Infinity, porcentajes: [40, 40, 40, 39, 39, 39, 37] },
];

/**
 * Escala de minoración por discapacidad 2026 de Álava/Araba, Bizkaia y
 * Gipuzkoa (también idéntica en las tres, mismas fuentes legales que arriba).
 */
export const TABLA_MINORACION_ARABA_BIZKAIA_GIPUZKOA_2026: TramoMinoracionDiscapacidad[] = [
  { desde: 0, hasta: 25410.0, a: 9, bc: 12 },
  { desde: 25410.01, hasta: 32610.0, a: 7, bc: 12 },
  { desde: 32610.01, hasta: 48060.0, a: 6, bc: 10 },
  { desde: 48060.01, hasta: 56780.0, a: 5, bc: 10 },
  { desde: 56780.01, hasta: 80730.0, a: 4, bc: 8 },
  { desde: 80730.01, hasta: 122030.0, a: 3, bc: 6 },
  { desde: 122030.01, hasta: 190410.0, a: 2, bc: 5 },
  { desde: 190410.01, hasta: Infinity, a: 1, bc: 3 },
];

/**
 * Tabla de retención IRPF 2026 de Nafarroa (Comunidad Foral de Navarra).
 *
 * Fuente: Decreto Foral 148/2025, de 23 de diciembre, del Gobierno de
 * Navarra (BON nº 260, 31-dic-2025), que modifica el art. 71 del Reglamento
 * del IRPF de Navarra (Decreto Foral 174/1999). Aplicable desde el 1-1-2026.
 *
 * La tabla real de Navarra tiene 11 columnas (0 a "10 o más" descendientes),
 * no 7 como en el País Vasco. Para que encaje en el mismo modelo de datos de
 * esta app (columnas 0..5 y "más de 5"), las columnas 0-5 se toman literales
 * y la columna "más de 5" usa el valor real de Navarra para exactamente 6
 * descendientes — una aproximación deliberada y documentada: familias
 * numerosas de más de 6 descendientes en Navarra pagarían en la vida real un
 * tipo algo menor que el que calcula esta app.
 */
export const TABLA_RETENCION_NAFARROA_2026: TramoRetencion[] = [
  { desde: 0, hasta: 17000.0, porcentajes: [0, 0, 0, 0, 0, 0, 0] },
  { desde: 17000.01, hasta: 18500.0, porcentajes: [2, 1, 0, 0, 0, 0, 0] },
  { desde: 18500.01, hasta: 19750.0, porcentajes: [4, 3, 2, 0, 0, 0, 0] },
  { desde: 19750.01, hasta: 21250.0, porcentajes: [6, 5, 4, 2, 0, 0, 0] },
  { desde: 21250.01, hasta: 23250.0, porcentajes: [8.5, 7.5, 6.5, 4.5, 2.5, 0, 0] },
  { desde: 23250.01, hasta: 25250.0, porcentajes: [11, 10, 9, 7, 5, 2.5, 0] },
  { desde: 25250.01, hasta: 27500.0, porcentajes: [13.3, 12, 11.3, 8.5, 7.5, 5.5, 3.4] },
  { desde: 27500.01, hasta: 30250.0, porcentajes: [14.6, 13.3, 12.6, 9.9, 9.2, 7.8, 5.8] },
  { desde: 30250.01, hasta: 32250.0, porcentajes: [15.8, 14.5, 13.7, 12.4, 10.7, 8.9, 7.9] },
  { desde: 32250.01, hasta: 35750.0, porcentajes: [17, 16, 15, 13.6, 12.5, 10.8, 10] },
  { desde: 35750.01, hasta: 41250.0, porcentajes: [18.1, 17.1, 16.5, 14.7, 14.0, 13.3, 12.2] },
  { desde: 41250.01, hasta: 48000.0, porcentajes: [20.0, 19.0, 18.3, 16.9, 16.2, 15.5, 13.7] },
  { desde: 48000.01, hasta: 55000.0, porcentajes: [22.1, 21.5, 20.9, 18.9, 18.3, 17.7, 16.6] },
  { desde: 55000.01, hasta: 62000.0, porcentajes: [24.1, 23.5, 23.0, 22.0, 21.5, 20.9, 19.8] },
  { desde: 62000.01, hasta: 69250.0, porcentajes: [26.1, 25.5, 24.5, 24.0, 23.5, 22.9, 21.9] },
  { desde: 69250.01, hasta: 75250.0, porcentajes: [28.3, 27.7, 27.0, 26.6, 25.5, 25.0, 24.4] },
  { desde: 75250.01, hasta: 82250.0, porcentajes: [29.6, 29.2, 28.3, 27.3, 27.2, 26.2, 26.1] },
  { desde: 82250.01, hasta: 94750.0, porcentajes: [30.8, 30.5, 30.0, 29.4, 29.0, 28.3, 27.7] },
  { desde: 94750.01, hasta: 107250.0, porcentajes: [32.2, 31.7, 31.2, 30.8, 30.4, 30.0, 29.5] },
  { desde: 107250.01, hasta: 120000.0, porcentajes: [33.5, 33.0, 32.6, 32.3, 32.0, 31.5, 31.0] },
  { desde: 120000.01, hasta: 132750.0, porcentajes: [35.1, 34.8, 34.6, 34.0, 33.5, 32.9, 32.4] },
  { desde: 132750.01, hasta: 146000.0, porcentajes: [36.2, 36.0, 35.8, 35.0, 34.5, 33.9, 33.4] },
  { desde: 146000.01, hasta: 200000.0, porcentajes: [38.0, 37.5, 37.0, 36.5, 35.5, 34.9, 34.4] },
  { desde: 200000.01, hasta: 280000.0, porcentajes: [40.0, 39.8, 39.4, 39.0, 38.5, 38.0, 37.5] },
  { desde: 280000.01, hasta: 350000.0, porcentajes: [42.0, 41.5, 41.2, 40.8, 40.0, 39.5, 39.0] },
  { desde: 350000.01, hasta: Infinity, porcentajes: [43.0, 42.9, 42.8, 42.5, 41.5, 41.0, 40.5] },
];

/**
 * Escala de minoración por discapacidad 2026 de Navarra (mismo Decreto Foral
 * 148/2025). A diferencia del País Vasco, Navarra agrupa por grado ≥33% (sin
 * distinguir movilidad reducida) y grado ≥65%, no por "sin/con movilidad
 * reducida". Mapeo a las columnas "a"/"bc" de esta app:
 * - "a" (33%-65% sin movilidad reducida) → valor real de Navarra para ≥33%.
 * - "bc" (33%-65% con movilidad reducida, o ≥65%) → valor real de Navarra
 *   para ≥65%. Esto sobrestima ligeramente la minoración de alguien con
 *   33%-65% CON movilidad reducida en Navarra (que legalmente cae en el
 *   grupo ≥33%, no ≥65%) — una aproximación deliberada y documentada, en el
 *   sentido más favorable a la persona usuaria.
 */
export const TABLA_MINORACION_NAFARROA_2026: TramoMinoracionDiscapacidad[] = [
  { desde: 0, hasta: 23250.0, a: 5, bc: 15 },
  { desde: 23250.01, hasta: 41250.0, a: 3, bc: 15 },
  { desde: 41250.01, hasta: 94750.0, a: 2, bc: 8 },
  { desde: 94750.01, hasta: Infinity, a: 2, bc: 5 },
];

function indiceColumnaDescendientes(numeroDescendientes: number): number {
  const n = Math.max(0, Math.floor(numeroDescendientes));
  return Math.min(n, 6);
}

function buscarTramo<T extends { desde: number; hasta: number }>(
  tabla: T[],
  importe: number,
): T {
  const tramo = tabla.find((t) => importe >= t.desde && importe <= t.hasta);
  // El último tramo cubre hasta Infinity, así que siempre hay coincidencia
  // para importes >= 0.
  return tramo ?? tabla[tabla.length - 1];
}

function puntosMinoracionDiscapacidad(
  gradoDiscapacidad: GradoDiscapacidad,
  rendimientoAnual: number,
  tablaMinoracion: TramoMinoracionDiscapacidad[],
): number {
  if (gradoDiscapacidad === "ninguno") return 0;
  const tramo = buscarTramo(tablaMinoracion, rendimientoAnual);
  return gradoDiscapacidad === "33_65_sin_movilidad" ? tramo.a : tramo.bc;
}

export interface ResultadoTipoRetencion {
  tipoTablaGeneral: number;
  puntosMinoracionDiscapacidad: number;
  tipoAplicado: number;
}

/**
 * Calcula el tipo de retención del IRPF aplicable para un rendimiento anual
 * del trabajo dado, según la tabla general de porcentajes del territorio
 * foral seleccionado y, si procede, la minoración por discapacidad de la
 * persona trabajadora activa. El tipo aplicado nunca es inferior a 0.
 *
 * `tablaRetencion`/`tablaMinoracion` se reciben como parámetro (en vez de
 * usar las constantes de este módulo directamente) para que puedan venir de
 * la configuración editable en Firestore, ya resuelta al territorio elegido;
 * ver `domain/configuracion.ts`. No aplica al territorio "estado" (régimen
 * común), que se calcula con un algoritmo — ver `retencionEstado.ts`.
 */
export function calcularTipoRetencion(
  rendimientoAnual: number,
  numeroDescendientes: number,
  gradoDiscapacidad: GradoDiscapacidad,
  tablaRetencion: TramoRetencion[],
  tablaMinoracion: TramoMinoracionDiscapacidad[],
): ResultadoTipoRetencion {
  const columna = indiceColumnaDescendientes(numeroDescendientes);
  const tipoTablaGeneral = buscarTramo(tablaRetencion, rendimientoAnual).porcentajes[columna];
  const puntos = puntosMinoracionDiscapacidad(gradoDiscapacidad, rendimientoAnual, tablaMinoracion);
  return {
    tipoTablaGeneral,
    puntosMinoracionDiscapacidad: puntos,
    tipoAplicado: Math.max(0, tipoTablaGeneral - puntos),
  };
}
