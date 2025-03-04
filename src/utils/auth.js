import { signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './client';

const signIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const signOut = () => {
  firebaseSignOut(auth);
};

export { signIn, signOut };
