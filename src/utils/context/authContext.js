// Context API Docs: https://beta.reactjs.org/learn/passing-data-deeply-with-context

'use client';

import { auth } from '@/utils/client';
import { checkIfAdmin, createUserProfile, getUserProfile, updateUserProfile } from '@/utils/database';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext'; // Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context. https://reactjs.org/docs/context.html#contextdisplayname

function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // there are 3 states for the user:
  // null = application initial state, not yet loaded
  // false = user is not logged in, but the app has loaded
  // an object/value = user is logged in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);

        // Get or create user profile
        try {
          let profile = await getUserProfile(fbUser.uid);

          if (!profile) {
            // Create new user profile if it doesn't exist
            profile = await createUserProfile(fbUser.uid, {
              displayName: fbUser.displayName,
              email: fbUser.email,
              photoURL: fbUser.photoURL,
            });
          } else {
            // Update last login time
            await updateUserProfile(fbUser.uid, {
              displayName: fbUser.displayName,
              email: fbUser.email,
              photoURL: fbUser.photoURL,
            });
          }

          setUserProfile(profile);

          // Check if user is admin
          const adminStatus = await checkIfAdmin(fbUser.uid);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error managing user profile:', error);
        }
      } else {
        setUser(false);
        setUserProfile(null);
        setIsAdmin(false);
      }
    }); // creates a single global listener for auth state changed

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = useMemo(
    // https://reactjs.org/docs/hooks-reference.html#usememo
    () => ({
      user,
      userProfile,
      isAdmin,
      userLoading: user === null,
      // as long as user === null, will be true
      // As soon as the user value !== null, value will be false
    }),
    [user, userProfile, isAdmin],
  );

  return <AuthContext.Provider value={value} {...props} />;
}
const AuthConsumer = AuthContext.Consumer;

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthConsumer, AuthProvider, useAuth };
