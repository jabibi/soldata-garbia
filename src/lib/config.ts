import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import type { ConfiguracionCalculo } from "./types";

const actualizarConfiguracionCalculoCallable = httpsCallable<ConfiguracionCalculo, { ok: boolean }>(
  functions,
  "actualizarConfiguracionCalculo",
);

export async function actualizarConfiguracionCalculo(configuracion: ConfiguracionCalculo) {
  const { data } = await actualizarConfiguracionCalculoCallable(configuracion);
  return data;
}
