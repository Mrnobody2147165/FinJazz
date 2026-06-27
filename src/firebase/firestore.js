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
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { createSubscription, mapSnapshotDocs, mapSingleDoc } from './subscriptions';
import { PROJECT_STATUS } from '@/constants';

// ============ USER OPERATIONS ============

export const getUserData = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return mapSingleDoc(userDoc);
};

export const updateUserData = async (uid, data) => {
  await setDoc(
    doc(db, 'users', uid),
    { uid, ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const subscribeToUserData = (uid, callback, onError) => {
  return createSubscription(
    doc(db, 'users', uid),
    (snapshot) => callback(mapSingleDoc(snapshot)),
    onError
  );
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
  return mapSnapshotDocs(snapshot);
};

export const updateProfile = async (uid, profileId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToProfiles = (uid, callback, onError) => {
  return createSubscription(
    collection(db, 'users', uid, 'profiles'),
    (snapshot) => callback(mapSnapshotDocs(snapshot)),
    onError
  );
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

export const updateTransaction = async (uid, profileId, transactionId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId, 'transactions', transactionId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (uid, profileId, transactionId) => {
  await deleteDoc(doc(db, 'users', uid, 'profiles', profileId, 'transactions', transactionId));
};

export const subscribeToTransactions = (uid, profileId, callback, onError) => {
  const transactionsQuery = query(
    collection(db, 'users', uid, 'profiles', profileId, 'transactions'),
    orderBy('date', 'desc')
  );
  return createSubscription(
    transactionsQuery,
    (snapshot) => callback(mapSnapshotDocs(snapshot)),
    onError
  );
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

export const updateBudget = async (uid, profileId, budgetId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId, 'budgets', budgetId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBudget = async (uid, profileId, budgetId) => {
  await deleteDoc(doc(db, 'users', uid, 'profiles', profileId, 'budgets', budgetId));
};

export const subscribeToBudgets = (uid, profileId, callback, onError) => {
  return createSubscription(
    collection(db, 'users', uid, 'profiles', profileId, 'budgets'),
    (snapshot) => callback(mapSnapshotDocs(snapshot)),
    onError
  );
};

// ============ PROJECT OPERATIONS ============

export const createProject = async (uid, profileId, projectData) => {
  const projectRef = doc(collection(db, 'users', uid, 'profiles', profileId, 'projects'));
  await setDoc(projectRef, {
    ...projectData,
    status: projectData.status || PROJECT_STATUS.NOT_STARTED,
    revenue: projectData.revenue || 0,
    expenses: projectData.expenses || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return projectRef.id;
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

export const subscribeToProjects = (uid, profileId, callback, onError) => {
  return createSubscription(
    collection(db, 'users', uid, 'profiles', profileId, 'projects'),
    (snapshot) => callback(mapSnapshotDocs(snapshot)),
    onError
  );
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

  try {
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
  } catch (error) {
    console.error('[Firestore] Notification dedup query failed:', error.message);
    return createNotification(uid, notificationData);
  }
  return null;
};

export const markNotificationRead = async (uid, notificationId) => {
  await updateDoc(doc(db, 'users', uid, 'notifications', notificationId), { read: true });
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

export const subscribeToNotifications = (uid, callback, onError) => {
  const notificationsQuery = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  return createSubscription(
    notificationsQuery,
    (snapshot) => callback(mapSnapshotDocs(snapshot)),
    onError
  );
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

export const updateRecurringExpense = async (uid, profileId, recurringId, data) => {
  await updateDoc(doc(db, 'users', uid, 'profiles', profileId, 'recurringExpenses', recurringId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteRecurringExpense = async (uid, profileId, recurringId) => {
  await deleteDoc(doc(db, 'users', uid, 'profiles', profileId, 'recurringExpenses', recurringId));
};

export const subscribeToRecurringExpenses = (uid, profileId, callback, onError) => {
  return createSubscription(
    collection(db, 'users', uid, 'profiles', profileId, 'recurringExpenses'),
    (snapshot) => callback(mapSnapshotDocs(snapshot)),
    onError
  );
};

// ============ BUDGET ALERT FUNCTIONS ============

const formatCurrencyAbsolute = (amount) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const checkBudgetAlerts = async (uid, profileId, transactions, budgets) => {
  const alerts = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  for (const budget of budgets) {
    if (!budget.amount || budget.amount <= 0) continue;

    const spent = transactions
      .filter((t) => {
        if (t.type !== 'expense' || t.category !== budget.category) return false;
        const date = t.date?.toDate ? t.date.toDate() : new Date(t.date);
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

  for (const alert of alerts) {
    await createNotificationIfNotExists(uid, { ...alert, profileId });
  }

  return alerts;
};

// ============ DEADLINE CHECK FUNCTIONS ============

export const checkProjectDeadlines = async (uid, profileId, projects) => {
  const now = new Date();
  const alerts = [];

  for (const project of projects) {
    if (project.status === PROJECT_STATUS.COMPLETED || !project.dueDate) continue;

    const dueDate = project.dueDate?.toDate ? project.dueDate.toDate() : new Date(project.dueDate);
    if (Number.isNaN(dueDate.getTime())) continue;

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
      if (project.status !== PROJECT_STATUS.DELAYED) {
        await updateProject(uid, profileId, project.id, { status: PROJECT_STATUS.DELAYED });
      }
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

  for (const alert of alerts) {
    await createNotificationIfNotExists(uid, { ...alert, profileId });
  }

  return alerts;
};
