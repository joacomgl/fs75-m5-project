export type UserRole = "customer" | "admin";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
