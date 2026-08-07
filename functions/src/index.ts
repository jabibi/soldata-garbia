import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { z } from "zod";
import { calcularNomina as calcularNominaDominio } from "./domain/calculadora";
import {
  CONFIGURACION_DEFECTO,
  ConfiguracionCalculo,
  configuracionDesdeFirestore,
  configuracionSchema,
  resolverConfiguracion,
} from "./domain/configuracion";
import { TERRITORIOS } from "./domain/types";

admin.initializeApp();

export { onUserCreate } from "./auth/onUserCreate";
export { bootstrapFirstAdmin, setUserRole } from "./auth/adminOps";

const inputSchema = z.object({
  salarioBrutoAnual: z.number().positive().max(10_000_000),
  numeroPagas: z.union([z.literal(12), z.literal(14)]),
  numeroDescendientes: z.number().int().min(0).max(6),
  tipoContrato: z.enum(["indefinido", "temporal"]),
  gradoDiscapacidad: z.enum(["ninguno", "33_65_sin_movilidad", "33_65_con_movilidad", "65_o_mas"]),
  territorio: z.enum(TERRITORIOS),
  irpfPorcentajeManual: z.number().min(0).max(100).nullable(),
});

async function obtenerConfiguracionCalculo(): Promise<ConfiguracionCalculo> {
  const doc = await admin.firestore().collection("configuracion").doc("parametros").get();
  if (!doc.exists) return CONFIGURACION_DEFECTO;

  try {
    return configuracionDesdeFirestore(doc.data());
  } catch (err) {
    logger.warn("Configuración de cálculo inválida en Firestore, usando valores por defecto.", err);
    return CONFIGURACION_DEFECTO;
  }
}

export const calcularNomina = onCall({ region: "europe-west1", cors: true }, async (request) => {
  const parsed = inputSchema.safeParse(request.data);
  if (!parsed.success) {
    throw new HttpsError("invalid-argument", "Datos de entrada no válidos.", parsed.error.flatten());
  }

  const configuracion = await obtenerConfiguracionCalculo();
  const resultado = calcularNominaDominio(parsed.data, resolverConfiguracion(configuracion));

  if (request.auth) {
    await admin.firestore().collection("historial").add({
      uid: request.auth.uid,
      input: parsed.data,
      resultado,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  return resultado;
});

/**
 * Sobrescribe la configuración de cálculo (tabla IRPF, minoración por
 * discapacidad y tasas de Seguridad Social). Solo una persona administradora
 * puede invocarla. Se guarda el documento entero (sin merge) para que la
 * tabla y las tasas nunca queden en un estado inconsistente entre sí.
 */
export const actualizarConfiguracionCalculo = onCall({ region: "europe-west1", cors: true }, async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError("permission-denied", "Solo una persona administradora puede editar la configuración.");
  }

  const parsed = configuracionSchema.safeParse(request.data);
  if (!parsed.success) {
    throw new HttpsError("invalid-argument", "Configuración no válida.", parsed.error.flatten());
  }

  await admin
    .firestore()
    .collection("configuracion")
    .doc("parametros")
    .set({
      ...parsed.data,
      actualizadoEn: FieldValue.serverTimestamp(),
      actualizadoPorUid: request.auth.uid,
    });

  return { ok: true };
});
