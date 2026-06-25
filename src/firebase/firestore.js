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
  limit,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ============ USER OPERATIONS ============

export const getUserData = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const updateUserData = async (uid, data) => {
  await setDoc(
    doc(db, 'users', uid),
    {
      uid,
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
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

// ============ PROFILE OPERATIONS ============

export const createProfile = async (uid, profileData) => {
  const profileRef = doc(collection(db, 'users', uid, 'profiles'), profileData.profileType);
  await setDoc(profileRef, {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return profileRef.id;
};

export const getProfiles = async (uid) => {
  const snapshot = await getDocs(collection(db, 'users', uid, 'profiles'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateProfile = async (uid, profileId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const getActiveProfile = async (uid, profileId) => {
  const profileDoc = await getDoc(doc(db, 'users', uid, 'profiles', profileId));
  if (profileDoc.exists()) {
    return { id: profileDoc.id, ...profileDoc.data() };
  }
  return null;
};

export const subscribeToProfiles = (uid, callback) => {
  return onSnapshot(collection(db, 'users', uid, 'profiles'), (snapshot) => {
    const profiles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(profiles);
  });
};

// ============ TRANSACTION OPERATIONS ============

export const createTransaction = async (uid, profileId, transactionData) => {
  const transactionRef = doc(collection(db, 'users', uid, 'profiles', profileId, 'transactions'));
  await setDoc(transactionRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return transactionRef.id;
};

export const getTransactions = async (uid, profileId) => {
  const transactionsQuery = query(
    collection(db, 'users', uid, 'profiles', profileId, 'transactions'),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(transactionsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateTransaction = async (uid, profileId, transactionId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId, 'transactions', transactionId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (uid, profileId, transactionId) => {
  await deleteDoc(doc(db, 'users', uid, 'profiles', profileId, 'transactions', transactionId));
};

export const subscribeToTransactions = (uid, profileId, callback) => {
  const transactionsQuery = query(
    collection(db, 'users', uid, 'profiles', profileId, 'transactions'),
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

// ============ BUDGET OPERATIONS ============

export const createBudget = async (uid, profileId, budgetData) => {
  const budgetRef = doc(collection(db, 'users', uid, 'profiles', profileId, 'budgets'));
  await setDoc(budgetRef, {
    ...budgetData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return budgetRef.id;
};

export const getBudgets = async (uid, profileId) => {
  const snapshot = await getDocs(collection(db, 'users', uid, 'profiles', profileId, 'budgets'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateBudget = async (uid, profileId, budgetId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId, 'budgets', budgetId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBudget = async (uid, profileId, budgetId) => {
  await deleteDoc(doc(db, 'users', uid, 'profiles', profileId, 'budgets', budgetId));
};

export const subscribeToBudgets = (uid, profileId, callback) => {
  return onSnapshot(collection(db, 'users', uid, 'profiles', profileId, 'budgets'), (snapshot) => {
    const budgets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(budgets);
  });
};

// ============ PROJECT OPERATIONS ============

export const createProject = async (uid, profileId, projectData) => {
  const projectRef = doc(collection(db, 'users', uid, 'profiles', profileId, 'projects'));
  const project = {
    ...projectData,
    status: projectData.status || 'not-started',
    revenue: projectData.revenue || 0,
    expenses: projectData.expenses || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(projectRef, project);
  return projectRef.id;
};

export const getProjects = async (uid, profileId) => {
  const snapshot = await getDocs(collection(db, 'users', uid, 'profiles', profileId, 'projects'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateProject = async (uid, profileId, projectId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId, 'projects', projectId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (uid, profileId, projectId) => {
  await deleteDoc(doc(db, 'users', uid, 'profiles', profileId, 'projects', projectId));
};

export const subscribeToProjects = (uid, profileId, callback) => {
  return onSnapshot(collection(db, 'users', uid, 'profiles', profileId, 'projects'), (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(projects);
  });
};

// ============ NOTIFICATION OPERATIONS ============

export const createNotification = async (uid, notificationData) => {
  const notificationRef = doc(collection(db, 'users', uid, 'notifications'));
  await setDoc(notificationRef, {
    ...notificationData,
    read: false,
    createdAt: serverTimestamp(),
  });
  return notificationRef.id;
};

export const createNotificationIfNotExists = async (uid, notificationData) => {
  const { title, budgetId, projectId, profileId } = notificationData;
  const refId = budgetId || projectId;
  const refField = budgetId ? 'budgetId' : 'projectId';

  const existingQuery = query(
    collection(db, 'users', uid, 'notifications'),
    where('title', '==', title),
    where(refField, '==', refId),
    where('read', '==', false),
    where('profileId', '==', profileId)
  );

  const existingSnapshot = await getDocs(existingQuery);
  if (existingSnapshot.empty) {
    return createNotification(uid, notificationData);
  }
  return null;
};

export const getNotifications = async (uid) => {
  const notificationsQuery = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snapshot = await getDocs(notificationsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const markNotificationRead = async (uid, notificationId) => {
  await updateDoc(doc(db, 'users', uid, 'notifications', notificationId), {
    read: true,
  });
};

export const markAllNotificationsRead = async (uid) => {
  const snapshot = await getDocs(
    query(collection(db, 'users', uid, 'notifications'), where('read', '==', false))
  );
  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnapshot) => {
    batch.update(doc(db, 'users', uid, 'notifications', docSnapshot.id), { read: true });
  });
  await batch.commit();
};

export const deleteNotification = async (uid, notificationId) => {
  await deleteDoc(doc(db, 'users', uid, 'notifications', notificationId));
};

export const subscribeToNotifications = (uid, callback) => {
  const notificationsQuery = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  return onSnapshot(notificationsQuery, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(notifications);
  });
};

// ============ RECURRING EXPENSE OPERATIONS ============

export const createRecurringExpense = async (uid, profileId, recurringData) => {
  const recurringRef = doc(collection(db, 'users', uid, 'profiles', profileId, 'recurringExpenses'));
  await setDoc(recurringRef, {
    ...recurringData,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return recurringRef.id;
};

export const getRecurringExpenses = async (uid, profileId) => {
  const snapshot = await getDocs(collection(db, 'users', uid, 'profiles', profileId, 'recurringExpenses'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateRecurringExpense = async (uid, profileId, recurringId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId, 'recurringExpenses', recurringId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteRecurringExpense = async (uid, profileId, recurringId) => {
  await deleteDoc(doc(db, 'users', uid, 'profiles', profileId, 'recurringExpenses', recurringId));
};

export const subscribeToRecurringExpenses = (uid, profileId, callback) => {
  return onSnapshot(collection(db, 'users', uid, 'profiles', profileId, 'recurringExpenses'), (snapshot) => {
    const recurringExpenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(recurringExpenses);
  });
};

// ============ BUDGET ALERT FUNCTIONS ============

export const checkBudgetAlerts = async (uid, profileId, transactions, budgets) => {
  const alerts = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  for (const budget of budgets) {
    const spent = transactions
      .filter((t) => {
        if (t.type !== 'expense' || t.category !== budget.category) return false;
        const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (spent / budget.amount) * 100;
    const remaining = budget.amount - spent;

    if (percentage >= 100) {
      alerts.push({
        type: 'critical',
        title: 'Budget Exceeded',
        message: `${budget.category} budget exceeded by ${formatCurrencyAbsolute(Math.abs(remaining))}. Spent: ${formatCurrencyAbsolute(spent)} of ${formatCurrencyAbsolute(budget.amount)}`,
        budgetId: budget.id,
        category: budget.category,
        percentage,
      });
    } else if (percentage >= 90) {
      alerts.push({
        type: 'warning',
        title: 'Budget Alert: 90%',
        message: `${budget.category} budget is at ${percentage.toFixed(0)}%. ${formatCurrencyAbsolute(remaining)} remaining.`,
        budgetId: budget.id,
        category: budget.category,
        percentage,
      });
    } else if (percentage >= 75) {
      alerts.push({
        type: 'warning',
        title: 'Budget Alert: 75%',
        message: `${budget.category} budget is at ${percentage.toFixed(0)}%. ${formatCurrencyAbsolute(remaining)} remaining.`,
        budgetId: budget.id,
        category: budget.category,
        percentage,
      });
    } else if (percentage >= 50) {
      alerts.push({
        type: 'info',
        title: 'Budget Update: 50%',
        message: `${budget.category} budget is at ${percentage.toFixed(0)}%. ${formatCurrencyAbsolute(remaining)} remaining.`,
        budgetId: budget.id,
        category: budget.category,
        percentage,
      });
    }
  }

  // Create notifications for alerts (deduplicated)
  for (const alert of alerts) {
    await createNotificationIfNotExists(uid, {
      ...alert,
      profileId,
    });
  }

  return alerts;
};

// ============ DEADLINE CHECK FUNCTIONS ============

export const checkProjectDeadlines = async (uid, profileId, projects) => {
  const now = new Date();
  const alerts = [];

  for (const project of projects) {
    if (project.status === 'completed') continue;

    const dueDate = project.dueDate?.toDate ? project.dueDate.toDate() : new Date(project.dueDate);
    const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      alerts.push({
        type: 'critical',
        title: 'Deadline Missed',
        message: `Project "${project.name}" deadline was ${Math.abs(daysRemaining)} days ago.`,
        projectId: project.id,
        projectName: project.name,
        daysRemaining,
      });
      // Update project status to delayed
      await updateProject(uid, profileId, project.id, { status: 'delayed' });
    } else if (daysRemaining <= 1) {
      alerts.push({
        type: 'critical',
        title: 'Deadline: 1 Day Left',
        message: `Project "${project.name}" is due tomorrow!`,
        projectId: project.id,
        projectName: project.name,
        daysRemaining,
      });
    } else if (daysRemaining <= 3) {
      alerts.push({
        type: 'warning',
        title: 'Deadline: 3 Days Left',
        message: `Project "${project.name}" is due in ${daysRemaining} days.`,
        projectId: project.id,
        projectName: project.name,
        daysRemaining,
      });
    } else if (daysRemaining <= 7) {
      alerts.push({
        type: 'info',
        title: 'Deadline: 7 Days Left',
        message: `Project "${project.name}" is due in ${daysRemaining} days.`,
        projectId: project.id,
        projectName: project.name,
        daysRemaining,
      });
    }
  }

  // Create notifications for deadline alerts (deduplicated)
  for (const alert of alerts) {
    await createNotificationIfNotExists(uid, {
      ...alert,
      profileId,
    });
  }

  return alerts;
};

// Helper function for absolute currency formatting (without symbol)
const formatCurrencyAbsolute = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
