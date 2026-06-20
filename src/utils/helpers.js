import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
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

export function calculateTotals(transactions) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
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
