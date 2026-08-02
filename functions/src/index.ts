import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { z } from "zod";
import { calcularNomina as calcularNominaAlava } from "./domain/calculadora";

admin.initializeApp();

export { onUserCreate } from "./auth/onUserCreate";
export { bootstrapFirstAdmin, setUserRole } from "./auth/adminOps";

const inputSchema = z.object({
  salarioBrutoAnual: z.number().positive().max(10_000_000),
  numeroPagas: z.union([z.literal(12), z.literal(14)]),
  numeroDescendientes: z.number().int().min(0).max(6),
  tipoContrato: z.enum(["indefinido", "temporal"]),
  gradoDiscapacidad: z.enum(["ninguno", "33_65_sin_movilidad", "33_65_con_movilidad", "65_o_mas"]),
});

export const calcularNomina = onCall({ region: "europe-west1", cors: true }, async (request) => {
  const parsed = inputSchema.safeParse(request.data);
  if (!parsed.success) {
    throw new HttpsError("invalid-argument", "Datos de entrada no válidos.", parsed.error.flatten());
  }

  const resultado = calcularNominaAlava(parsed.data);

  if (request.auth) {
    await admin.firestore().collection("historial").add({
      uid: request.auth.uid,
      input: parsed.data,
      resultado,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return resultado;
});
