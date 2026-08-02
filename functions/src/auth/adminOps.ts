import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { z } from "zod";

const ROLES = ["usuario", "administrador"] as const;

/**
 * Concede el rol de administrador a quien la llame, únicamente si todavía
 * no existe ninguna otra cuenta con ese rol. Permite que la primera persona
 * que se registra en la aplicación se convierta en administradora, sin
 * necesidad de tocar la consola de Firebase ni una clave de servicio.
 */
export const bootstrapFirstAdmin = onCall({ region: "europe-west1", cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión.");
  }

  const { users } = await admin.auth().listUsers(1000);
  const yaHayAdmin = users.some((u) => u.customClaims?.admin === true);
  if (yaHayAdmin) {
    return { granted: false };
  }

  const { uid } = request.auth;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  await admin.firestore().collection("users").doc(uid).set({ role: "administrador" }, { merge: true });
  return { granted: true };
});

const setUserRoleSchema = z.object({
  uid: z.string().min(1),
  role: z.enum(ROLES),
});

/**
 * Cambia el rol de otra persona usuaria. Solo puede invocarlo una cuenta
 * que ya tenga el claim de administrador.
 */
export const setUserRole = onCall({ region: "europe-west1", cors: true }, async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new HttpsError("permission-denied", "Solo una persona administradora puede cambiar roles.");
  }

  const parsed = setUserRoleSchema.safeParse(request.data);
  if (!parsed.success) {
    throw new HttpsError("invalid-argument", "Datos de entrada no válidos.", parsed.error.flatten());
  }

  const { uid, role } = parsed.data;
  await admin.auth().setCustomUserClaims(uid, { admin: role === "administrador" });
  await admin.firestore().collection("users").doc(uid).set({ role }, { merge: true });
  return { ok: true };
});
