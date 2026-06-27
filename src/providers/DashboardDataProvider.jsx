import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useAuthStore, { selectIsCompanyProfile } from '@/stores/authStore';
import {
  subscribeToTransactions,
  subscribeToBudgets,
  subscribeToProjects,
  subscribeToRecurringExpenses,
  checkBudgetAlerts,
  checkProjectDeadlines,
} from '@/firebase/firestore';

const DashboardDataContext = createContext(null);

const initialLoading = {
  transactions: true,
  budgets: true,
  projects: true,
  recurringExpenses: true,
};

const initialErrors = {
  transactions: null,
  budgets: null,
  projects: null,
  recurringExpenses: null,
};

export const DashboardDataProvider = ({ children }) => {
  const userId = useAuthStore((s) => s.user?.uid);
  const activeProfileId = useAuthStore((s) => s.activeProfileId);
  const isCompany = useAuthStore(selectIsCompanyProfile);

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [errors, setErrors] = useState(initialErrors);

  const alertsRanRef = useRef({ budget: '', deadlines: '' });

  useEffect(() => {
    if (!userId || !activeProfileId) {
      setTransactions([]);
      setBudgets([]);
      setProjects([]);
      setRecurringExpenses([]);
      setLoading(initialLoading);
      setErrors(initialErrors);
      return;
    }

    setLoading(initialLoading);
    setErrors(initialErrors);

    const markLoaded = (key) =>
      setLoading((prev) => ({ ...prev, [key]: false }));

    const markError = (key, error) => {
      setErrors((prev) => ({ ...prev, [key]: error.message }));
      markLoaded(key);
    };

    const unsubTransactions = subscribeToTransactions(
      userId,
      activeProfileId,
      (data) => {
        setTransactions(data);
        markLoaded('transactions');
      },
      (error) => markError('transactions', error)
    );

    const unsubBudgets = subscribeToBudgets(
      userId,
      activeProfileId,
      (data) => {
        setBudgets(data);
        markLoaded('budgets');
      },
      (error) => markError('budgets', error)
    );

    const unsubRecurring = subscribeToRecurringExpenses(
      userId,
      activeProfileId,
      (data) => {
        setRecurringExpenses(data);
        markLoaded('recurringExpenses');
      },
      (error) => markError('recurringExpenses', error)
    );

    let unsubProjects = () => {};
    if (isCompany) {
      unsubProjects = subscribeToProjects(
        userId,
        activeProfileId,
        (data) => {
          setProjects(data);
          markLoaded('projects');
        },
        (error) => markError('projects', error)
      );
    } else {
      setProjects([]);
      markLoaded('projects');
    }

    return () => {
      unsubTransactions();
      unsubBudgets();
      unsubRecurring();
      unsubProjects();
    };
  }, [userId, activeProfileId, isCompany]);

  useEffect(() => {
    if (!userId || !activeProfileId || transactions.length === 0 || budgets.length === 0) return;

    const key = `${activeProfileId}-${transactions.length}-${budgets.length}`;
    if (alertsRanRef.current.budget === key) return;
    alertsRanRef.current.budget = key;

    checkBudgetAlerts(userId, activeProfileId, transactions, budgets).catch((error) => {
      console.error('[Dashboard] Budget alert check failed:', error);
    });
  }, [userId, activeProfileId, transactions, budgets]);

  useEffect(() => {
    if (!userId || !activeProfileId || !isCompany || projects.length === 0) return;

    const key = `${activeProfileId}-${projects.length}`;
    if (alertsRanRef.current.deadlines === key) return;
    alertsRanRef.current.deadlines = key;

    checkProjectDeadlines(userId, activeProfileId, projects).catch((error) => {
      console.error('[Dashboard] Deadline check failed:', error);
    });
  }, [userId, activeProfileId, isCompany, projects]);

  const isLoading = useMemo(
    () =>
      !activeProfileId
        ? false
        : loading.transactions ||
          loading.budgets ||
          loading.recurringExpenses ||
          (isCompany && loading.projects),
    [activeProfileId, loading, isCompany]
  );

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      projects,
      recurringExpenses,
      loading,
      isLoading,
      errors,
    }),
    [transactions, budgets, projects, recurringExpenses, loading, isLoading, errors]
  );

  return (
    <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within DashboardDataProvider');
  }
  return context;
};

export default DashboardDataProvider;
