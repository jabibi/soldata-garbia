export type TipoContrato = "indefinido" | "temporal";

export type GradoDiscapacidad =
  | "ninguno"
  | "33_65_sin_movilidad"
  | "33_65_con_movilidad"
  | "65_o_mas";

export interface CalculoNominaInput {
  salarioBrutoAnual: number;
  numeroPagas: 12 | 14;
  numeroDescendientes: number; // 0..6, donde 6 representa "más de 5"
  tipoContrato: TipoContrato;
  gradoDiscapacidad: GradoDiscapacidad;
}

export interface CalculoNominaResultado {
  salarioBrutoAnual: number;
  salarioBrutoMensual: number;
  numeroPagas: 12 | 14;
  retencionIrpf: {
    tipoAplicado: number; // porcentaje, p.ej. 12.5
    tipoTablaGeneral: number;
    puntosMinoracionDiscapacidad: number;
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
