import { GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from './client';

const provider = new GoogleAuthProvider();

// Sign in with Google
export const signIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Custom hook to use auth state
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Check if user is admin (based on email)
      if (currentUser) {
        // Add admin emails here
        const adminEmails = ['admin@example.com', 'admin@devlinks.com'];
        setIsAdmin(adminEmails.includes(currentUser.email));
      } else {
        setIsAdmin(false);
      }

      setUserLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { user, userLoading, isAdmin };
};
