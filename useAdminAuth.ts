import { useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from './src/firebase/auth';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();

export interface UseAdminAuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signInAdmin: (email: string, password: string) => Promise<User>;
  signOutAdmin: () => Promise<void>;
  clearError: () => void;
}

export const useAdminAuth = (): UseAdminAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    }, err => {
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAdmin = useCallback(async (email: string, password: string) => {
    setError(null);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const signedEmail = credential.user.email?.toLowerCase();

    if (ADMIN_EMAIL && signedEmail !== ADMIN_EMAIL) {
      await signOut(auth);
      const notAllowedMsg = 'This account is not authorized as admin.';
      setError(notAllowedMsg);
      throw new Error(notAllowedMsg);
    }

    return credential.user;
  }, []);

  const signOutAdmin = useCallback(() => {
    setError(null);
    return signOut(auth);
  }, []);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    if (!ADMIN_EMAIL) return true; // fallback: allow if admin email not set
    return user.email?.toLowerCase() === ADMIN_EMAIL;
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return { user, isAdmin, loading, error, signInAdmin, signOutAdmin, clearError };
};
