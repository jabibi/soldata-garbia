export type TipoContrato = "indefinido" | "temporal";

export type GradoDiscapacidad =
  | "ninguno"
  | "33_65_sin_movilidad"
  | "33_65_con_movilidad"
  | "65_o_mas";

/**
 * Territorios forales con tabla de retención IRPF propia, admin-editable.
 * "estado" (régimen común) no tiene tabla: se calcula con un algoritmo en
 * las Functions — por eso no forma parte de `ConfiguracionCalculo`.
 */
export const TERRITORIOS_CON_TABLA = ["araba", "bizkaia", "gipuzkoa", "nafarroa"] as const;
export type TerritorioConTabla = (typeof TERRITORIOS_CON_TABLA)[number];

/** Todos los territorios seleccionables en la calculadora, tabla + "estado". */
export const TERRITORIOS = [...TERRITORIOS_CON_TABLA, "estado"] as const;
export type Territorio = (typeof TERRITORIOS)[number];

export interface CalculoNominaInput {
  salarioBrutoAnual: number;
  numeroPagas: 12 | 14;
  numeroDescendientes: number;
  tipoContrato: TipoContrato;
  gradoDiscapacidad: GradoDiscapacidad;
  territorio: Territorio;
  irpfPorcentajeManual: number | null;
}

export interface CalculoNominaResultado {
  salarioBrutoAnual: number;
  salarioBrutoMensual: number;
  numeroPagas: 12 | 14;
  territorio: Territorio;
  retencionIrpf: {
    tipoAplicado: number;
    tipoTablaGeneral: number;
    puntosMinoracionDiscapacidad: number;
    manual: boolean;
    importeMensual: number;
    importeAnual: number;
  };
  seguridadSocial: {
    tipoAplicado: number;
    baseCotizacionMensual: number;
    importeMensual: number;
    importeAnual: number;
    desglose: {
      contingenciasComunes: number;
      desempleo: number;
      formacionProfesional: number;
      mei: number;
    };
  };
  salarioNetoMensual: number;
  salarioNetoAnual: number;
}

/**
 * Configuración de cálculo editable por administración. `hasta: null`
 * representa el último tramo, sin límite superior (Firestore no admite
 * `Infinity` como valor numérico). Duplicado a mano de
 * `functions/src/domain/configuracion.ts` — no hay paquete compartido entre
 * frontend y functions.
 */
export interface TramoRetencionDoc {
  hasta: number | null;
  porcentajes: [number, number, number, number, number, number, number];
}

export interface TramoMinoracionDoc {
  hasta: number | null;
  a: number;
  bc: number;
}

export interface SeguridadSocialConfig {
  baseMaximaMensual: number;
  contingenciasComunes: number;
  desempleoIndefinido: number;
  desempleoTemporal: number;
  formacionProfesional: number;
  mei: number;
}

export interface ConfiguracionTerritorio {
  tablaRetencionIrpf: TramoRetencionDoc[];
  tablaMinoracionDiscapacidad: TramoMinoracionDoc[];
}

export interface ConfiguracionCalculo {
  territorios: Record<TerritorioConTabla, ConfiguracionTerritorio>;
  seguridadSocial: SeguridadSocialConfig;
}
