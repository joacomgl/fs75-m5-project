import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type PropsWithChildren,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle as googleSignIn,
  signOut,
  getUserRole,
} from "../../services/auth.service";
import type { AuthContextType, AuthUser, UserRole } from "../../types/auth.types";

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [role, setRole]       = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        // Load role from Firestore
        const userRole = await getUserRole(firebaseUser.uid);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      role,
      loading,
      signUp: signUpWithEmail,
      signIn: signInWithEmail,
      signInWithGoogle: googleSignIn,
      signOut,
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Internal hook (used only inside contexts/auth/) ──────────────────────────

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
