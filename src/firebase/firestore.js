import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

export const getUserData = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const updateUserData = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToUserData = (uid, callback) => {
  return onSnapshot(doc(db, 'users', uid), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

export const createTransaction = async (uid, transactionData) => {
  const transactionRef = doc(collection(db, 'users', uid, 'transactions'));
  await setDoc(transactionRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return transactionRef.id;
};

export const getTransactions = async (uid) => {
  const transactionsQuery = query(
    collection(db, 'users', uid, 'transactions'),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(transactionsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateTransaction = async (uid, transactionId, data) => {
  await updateDoc(doc(db, 'users', uid, 'transactions', transactionId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (uid, transactionId) => {
  await deleteDoc(doc(db, 'users', uid, 'transactions', transactionId));
};

export const subscribeToTransactions = (uid, callback) => {
  const transactionsQuery = query(
    collection(db, 'users', uid, 'transactions'),
    orderBy('date', 'desc')
  );
  return onSnapshot(transactionsQuery, (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(transactions);
  });
};

export const createBudget = async (uid, budgetData) => {
  const budgetRef = doc(collection(db, 'users', uid, 'budgets'));
  await setDoc(budgetRef, {
    ...budgetData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return budgetRef.id;
};

export const getBudgets = async (uid) => {
  const snapshot = await getDocs(collection(db, 'users', uid, 'budgets'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateBudget = async (uid, budgetId, data) => {
  await updateDoc(doc(db, 'users', uid, 'budgets', budgetId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBudget = async (uid, budgetId) => {
  await deleteDoc(doc(db, 'users', uid, 'budgets', budgetId));
};

export const subscribeToBudgets = (uid, callback) => {
  return onSnapshot(collection(db, 'users', uid, 'budgets'), (snapshot) => {
    const budgets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(budgets);
  });
};

export const createProject = async (uid, projectData) => {
  const projectRef = doc(collection(db, 'users', uid, 'projects'));
  await setDoc(projectRef, {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return projectRef.id;
};

export const getProjects = async (uid) => {
  const snapshot = await getDocs(collection(db, 'users', uid, 'projects'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateProject = async (uid, projectId, data) => {
  await updateDoc(doc(db, 'users', uid, 'projects', projectId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (uid, projectId) => {
  await deleteDoc(doc(db, 'users', uid, 'projects', projectId));
};

export const subscribeToProjects = (uid, callback) => {
  return onSnapshot(collection(db, 'users', uid, 'projects'), (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(projects);
  });
};
