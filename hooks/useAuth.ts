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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Check if user is admin by UID
          const isAdmin = firebaseUser.uid === ADMIN_UID;
          
          if (isAdmin) {
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.email?.split('@')[0] || 'Admin',
              role: 'admin'
            });
          } else {
            // Fetch user data from Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setCurrentUser({
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.email?.split('@')[0] || 'User',
                role: userData.role || 'user'
              });
            } else {
              // Fallback if no Firestore doc
              setCurrentUser({
                id: firebaseUser.uid,
                name: firebaseUser.email?.split('@')[0] || 'User',
                role: 'user'
              });
            }
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err: any) {
        setError(err.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { currentUser, loading, error, setCurrentUser };
};
