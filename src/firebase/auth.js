import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (email, password, fullName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: fullName });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    fullName: fullName,
    accountType: 'personal',
    themePalette: 'emerald-violet',
    currency: 'PKR',
    onboardingComplete: false,
    profileImage: null,
    companyLogo: null,
    companyName: null,
    createdAt: serverTimestamp(),
  });

  return user;
};

export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, 'users', user.uid));

  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName || '',
      accountType: 'personal',
      themePalette: 'emerald-violet',
      currency: 'PKR',
      onboardingComplete: false,
      profileImage: user.photoURL || null,
      companyLogo: null,
      companyName: null,
      createdAt: serverTimestamp(),
    });
  }
  return user;
};

export const sendResetPasswordEmail = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const logOut = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
