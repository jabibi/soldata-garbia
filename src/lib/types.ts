export type TipoContrato = "indefinido" | "temporal";

export type GradoDiscapacidad =
  | "ninguno"
  | "33_65_sin_movilidad"
  | "33_65_con_movilidad"
  | "65_o_mas";

export interface CalculoNominaInput {
  salarioBrutoAnual: number;
  numeroPagas: 12 | 14;
  numeroDescendientes: number;
  tipoContrato: TipoContrato;
  gradoDiscapacidad: GradoDiscapacidad;
}

export interface CalculoNominaResultado {
  salarioBrutoAnual: number;
  salarioBrutoMensual: number;
  numeroPagas: 12 | 14;
  retencionIrpf: {
    tipoAplicado: number;
    tipoTablaGeneral: number;
    puntosMinoracionDiscapacidad: number;
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

export interface ConfiguracionCalculo {
  tablaRetencionIrpf: TramoRetencionDoc[];
  irpfPorcentajeFijo: number | null;
  tablaMinoracionDiscapacidad: TramoMinoracionDoc[];
  minoracionPuntosFijo: number | null;
  seguridadSocial: SeguridadSocialConfig;
}
