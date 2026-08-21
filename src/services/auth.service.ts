import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";
import type { UserDocument, UserRole } from "../types/auth.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Fetch the role stored in users/{uid}. Returns "customer" if doc does not exist. */
export const getUserRole = async (uid: string): Promise<UserRole> => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return "customer";
  return (snap.data() as UserDocument).role;
};

/** Create (or update) the user document in Firestore */
const upsertUserDocument = async (
  user: User,
  role: UserRole = "customer"
): Promise<void> => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role,
      createdAt: serverTimestamp(),
    } satisfies Omit<UserDocument, "createdAt"> & { createdAt: unknown });
  }
};

// ─── Auth actions ─────────────────────────────────────────────────────────────

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<void> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  await upsertUserDocument(user);
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<void> => {
  const { user } = await signInWithPopup(auth, googleProvider);
  await upsertUserDocument(user);
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};
