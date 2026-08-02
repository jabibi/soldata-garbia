import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase";

export function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return firebaseSignOut(auth);
}

const bootstrapFirstAdminCallable = httpsCallable<void, { granted: boolean }>(
  functions,
  "bootstrapFirstAdmin",
);

export async function bootstrapFirstAdmin() {
  const { data } = await bootstrapFirstAdminCallable();
  return data;
}

const setUserRoleCallable = httpsCallable<{ uid: string; role: "usuario" | "administrador" }, { ok: boolean }>(
  functions,
  "setUserRole",
);

export async function setUserRole(uid: string, role: "usuario" | "administrador") {
  const { data } = await setUserRoleCallable({ uid, role });
  return data;
}
