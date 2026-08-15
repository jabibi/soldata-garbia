export type TipoContrato = "indefinido" | "temporal";

export type GradoDiscapacidad =
  | "ninguno"
  | "33_65_sin_movilidad"
  | "33_65_con_movilidad"
  | "65_o_mas";

/**
 * Territorios forales con tabla de retención IRPF propia, admin-editable.
 * "estado" (régimen común) no tiene tabla: se calcula con un algoritmo, ver
 * `retencionEstado.ts` — por eso no forma parte de `ConfiguracionCalculo`.
 */
export const TERRITORIOS_CON_TABLA = ["araba", "bizkaia", "gipuzkoa", "nafarroa"] as const;
export type TerritorioConTabla = (typeof TERRITORIOS_CON_TABLA)[number];

/** Todos los territorios seleccionables en la calculadora, tabla + "estado". */
export const TERRITORIOS = [...TERRITORIOS_CON_TABLA, "estado"] as const;
export type Territorio = (typeof TERRITORIOS)[number];

export interface CalculoNominaInput {
  salarioBrutoAnual: number;
  numeroPagas: 12 | 14;
  numeroDescendientes: number; // 0..6, donde 6 representa "más de 5"
  tipoContrato: TipoContrato;
  gradoDiscapacidad: GradoDiscapacidad;
  territorio: Territorio;
  /** Si no es null, sustituye el tipo de retención aplicado (tabla + minoración). */
  irpfPorcentajeManual: number | null;
  /**
   * Porcentaje de jornada (0 < x <= 100, 100 = jornada completa). `salarioBrutoAnual`
   * se entiende siempre referido a jornada completa; ver `calcularNomina` en
   * `calculadora.ts` para cómo se usa este porcentaje en el cálculo.
   */
  porcentajeJornada: number;
}

export interface CalculoNominaResultado {
  /** Salario bruto ya reducido por `porcentajeJornada` (lo realmente percibido). */
  salarioBrutoAnual: number;
  salarioBrutoMensual: number;
  numeroPagas: 12 | 14;
  territorio: Territorio;
  porcentajeJornada: number;
  retencionIrpf: {
    tipoAplicado: number; // porcentaje, p.ej. 12.5
    tipoTablaGeneral: number;
    puntosMinoracionDiscapacidad: number;
    /** true si tipoAplicado viene del override manual del usuario, no de la tabla. */
    manual: boolean;
    importeMensual: number;
    importeAnual: number;
  };
  seguridadSocial: {
    tipoAplicado: number; // porcentaje total a cargo del trabajador
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
