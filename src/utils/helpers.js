import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Currency configuration with PKR as default
const CURRENCY_CONFIG = {
  PKR: { symbol: 'Rs', locale: 'en-PK', position: 'before' },
  USD: { symbol: '$', locale: 'en-US', position: 'before' },
  EUR: { symbol: '€', locale: 'de-DE', position: 'after' },
  GBP: { symbol: '£', locale: 'en-GB', position: 'before' },
  AED: { symbol: 'د.إ', locale: 'ar-AE', position: 'after' },
  SAR: { symbol: 'ر.س', locale: 'ar-SA', position: 'after' },
};

export const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED', 'SAR'];

export function formatCurrency(amount, currency = 'PKR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.PKR;
  const formattedNumber = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (config.position === 'before') {
    return `${config.symbol}${formattedNumber}`;
  }
  return `${formattedNumber}${config.symbol}`;
}

export function formatDate(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getErrorMessage(error) {
  const errorMessages = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/unauthorized-domain': 'This domain is not authorized for Google sign-in.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/requires-recent-login': 'Please log in again to perform this action.',
    'storage/unauthorized': 'You do not have permission to upload files.',
    'storage/canceled': 'Upload was cancelled.',
    'storage/unknown': 'An unknown error occurred during upload.',
  };

  const code = error?.code || error?.message;
  return errorMessages[code] || error?.message || 'An unexpected error occurred.';
}

export function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export function calculateTotals(transactions, month = null, year = null) {
  const filtered = transactions.filter((t) => {
    if (month === null || year === null) return true;
    const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const income = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return {
    income,
    expenses,
    balance: income - expenses,
    savings: income - expenses,
  };
}

export function getExpensesByCategory(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const byCategory = {};
  expenses.forEach((t) => {
    const category = t.category || 'Other';
    byCategory[category] = (byCategory[category] || 0) + t.amount;
  });
  return Object.entries(byCategory).map(([name, value]) => ({
    name,
    value,
  }));
}

export function prepareChartData(transactions) {
  const data = {};
  transactions.forEach((t) => {
    const month = new Date(t.date.toDate ? t.date.toDate() : t.date).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    if (!data[month]) {
      data[month] = { month, income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      data[month].income += t.amount;
    } else {
      data[month].expenses += t.amount;
    }
  });
  return Object.values(data).reverse();
}

// Project profitability calculations
export function calculateProjectMetrics(project) {
  const revenue = project.revenue || 0;
  const expenses = project.expenses || 0;
  const budget = project.budget || 0;
  const profit = revenue - expenses;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
  const budgetUtilization = budget > 0 ? ((expenses / budget) * 100).toFixed(1) : 0;

  return {
    revenue,
    expenses,
    budget,
    profit,
    margin: parseFloat(margin),
    budgetUtilization: parseFloat(budgetUtilization),
    isProfitable: profit >= 0,
  };
}

// Recurring expense frequency helpers
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function getNextExecutionDate(frequency, fromDate = new Date()) {
  const next = new Date(fromDate);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }
  return next;
}

export function shouldExecuteRecurring(recurringExpense) {
  const now = new Date();
  const nextExecution = recurringExpense.nextExecutionDate?.toDate
    ? recurringExpense.nextExecutionDate.toDate()
    : new Date(recurringExpense.nextExecutionDate);
  return now >= nextExecution;
}

// Status color helpers
export function getStatusColor(status) {
  const colors = {
    'not-started': 'var(--muted)',
    'in-progress': 'var(--primary)',
    'completed': 'var(--success)',
    'delayed': 'var(--danger)',
  };
  return colors[status] || 'var(--muted)';
}

export function getDeadlineColor(daysRemaining) {
  if (daysRemaining < 0) return 'var(--danger)';
  if (daysRemaining <= 3) return 'var(--danger)';
  if (daysRemaining <= 7) return 'var(--warning)';
  return 'var(--success)';
}

// Notification type helpers
export function getNotificationTypeColor(type) {
  const colors = {
    info: 'var(--primary)',
    warning: 'var(--warning)',
    critical: 'var(--danger)',
    success: 'var(--success)',
  };
  return colors[type] || 'var(--muted)';
}

// Search helper
export function searchItems(items, query, fields) {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value?.toString().toLowerCase().includes(lowerQuery);
    })
  );
}
