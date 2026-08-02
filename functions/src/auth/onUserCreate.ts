import * as functionsV1 from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Crea el perfil en Firestore (users/{uid}) para cada nueva cuenta de
 * Firebase Auth, con el rol por defecto "usuario".
 */
export const onUserCreate = functionsV1
  .region("europe-west1")
  .auth.user()
  .onCreate(async (user) => {
    await admin.firestore().collection("users").doc(user.uid).set({
      email: user.email ?? null,
      role: "usuario",
      createdAt: FieldValue.serverTimestamp(),
    });
  });
