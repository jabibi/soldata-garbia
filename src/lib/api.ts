import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import type { CalculoNominaInput, CalculoNominaResultado } from "./types";

const calcularNominaCallable = httpsCallable<CalculoNominaInput, CalculoNominaResultado>(
  functions,
  "calcularNomina",
);

export async function calcularNomina(input: CalculoNominaInput): Promise<CalculoNominaResultado> {
  const { data } = await calcularNominaCallable(input);
  return data;
}
