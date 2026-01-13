import { useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../src/firebase/auth';
import { db } from '../src/firebase/db';
import { User } from '../types';

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID || 'hardcoded-admin-uid';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useAuth] Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('[useAuth] Auth state changed:', firebaseUser ? firebaseUser.uid : 'logged out');
      
      try {
        if (firebaseUser) {
          // Check if user is admin by UID
          const isAdmin = firebaseUser.uid === ADMIN_UID;
          
          if (isAdmin) {
            console.log('[useAuth] User is admin');
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.email?.split('@')[0] || 'Admin',
              role: 'admin'
            });
          } else {
            // Fetch user data from Firestore
            console.log('[useAuth] Fetching user data from Firestore...');
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log('[useAuth] User data loaded:', userData.role);
              setCurrentUser({
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.email?.split('@')[0] || 'User',
                role: userData.role || 'user'
              });
            } else {
              console.warn('[useAuth] No Firestore document found, using defaults');
              // Fallback if no Firestore doc
              setCurrentUser({
                id: firebaseUser.uid,
                name: firebaseUser.email?.split('@')[0] || 'User',
                role: 'user'
              });
            }
          }
        } else {
          console.log('[useAuth] No user signed in');
          setCurrentUser(null);
        }
      } catch (err: any) {
        console.error('[useAuth] Error in auth state listener:', err);
        setError(err.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
        console.log('[useAuth] Auth loading complete');
      }
    });

    return () => {
      console.log('[useAuth] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  return { currentUser, loading, error, setCurrentUser };
};
