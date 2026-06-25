import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/index';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  subscribeToTransactions,
} from '@/firebase/firestore';
import { formatCurrency, formatDate, getErrorMessage } from '@/utils/helpers';

const transactionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'],
};

const TransactionsPage = () => {
  const { user } = useAuth();
  const { activeProfileId, activeProfile } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const currency = activeProfile?.currency || 'PKR';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const watchType = watch('type');

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!user?.uid || !activeProfileId) return;

    const unsubscribe = subscribeToTransactions(user.uid, activeProfileId, (data) => {
      setTransactions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, activeProfileId]);

  useEffect(() => {
    if (editingTransaction) {
      const date = editingTransaction.date?.toDate
        ? editingTransaction.date.toDate()
        : new Date(editingTransaction.date);
      reset({
        title: editingTransaction.title,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: date.toISOString().split('T')[0],
        notes: editingTransaction.notes || '',
      });
    } else {
      reset({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [editingTransaction, reset]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    reset();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const transactionData = {
        ...data,
        date: new Date(data.date),
      };

      if (editingTransaction) {
        await updateTransaction(user.uid, activeProfileId, editingTransaction.id, transactionData);
      } else {
        await createTransaction(user.uid, activeProfileId, transactionData);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(user.uid, activeProfileId, id);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Transactions</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Total Income</p>
            <p className="text-xl font-bold text-[var(--success)] mt-1">
              {formatCurrency(totalIncome, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Total Expenses</p>
            <p className="text-xl font-bold text-[var(--error)] mt-1">
              {formatCurrency(totalExpense, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Net</p>
            <p
              className={`text-xl font-bold mt-1 ${
                totalIncome - totalExpense >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'
              }`}
            >
              {formatCurrency(totalIncome - totalExpense, currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-40"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-40"
            >
              <option value="all">All Categories</option>
              {[...categories.income, ...categories.expense].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-[var(--muted-foreground)]">Loading...</div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={ArrowUpRight}
              title="No transactions found"
              description={
                searchQuery || filterType !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first transaction to start tracking'
              }
              action={
                !searchQuery && filterType === 'all' && filterCategory === 'all' ? (
                  <Button onClick={openAddModal}>Add Transaction</Button>
                ) : null
              }
            />
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 hover:bg-[var(--muted)]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-[var(--success)]/10'
                          : 'bg-[var(--error)]/10'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-[var(--success)]" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-[var(--error)]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{transaction.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--error)]'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount, currency)}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(transaction)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[var(--error)] hover:text-[var(--error)]/80 hover:bg-[var(--error)]/10"
                        onClick={() => setDeleteId(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <div className="space-y-4">
              <Input
                {...register('title')}
                label="Title"
                placeholder="Enter transaction title"
                error={errors.title?.message}
              />

              <Input
                {...register('amount')}
                type="number"
                step="0.01"
                label="Amount"
                placeholder="Enter amount"
                error={errors.amount?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    Type
                  </label>
                  <div className="flex gap-2">
                    <label
                      className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border cursor-pointer transition-all ${
                        watchType === 'income'
                          ? 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]'
                          : 'border-[var(--border)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      <input
                        type="radio"
                        value="income"
                        {...register('type')}
                        className="sr-only"
                      />
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Income
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border cursor-pointer transition-all ${
                        watchType === 'expense'
                          ? 'border-[var(--error)] bg-[var(--error)]/10 text-[var(--error)]'
                          : 'border-[var(--border)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      <input
                        type="radio"
                        value="expense"
                        {...register('type')}
                        className="sr-only"
                      />
                      <ArrowDownRight className="h-4 w-4 mr-2" />
                      Expense
                    </label>
                  </div>
                </div>

                <Select {...register('category')} label="Category" error={errors.category?.message}>
                  <option value="">Select category</option>
                  {categories[watchType]?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              <Input
                {...register('date')}
                type="date"
                label="Date"
                error={errors.date?.message}
              />

              <Textarea {...register('notes')} label="Notes (optional)" placeholder="Add notes..." rows={3} />
            </div>
          </ModalContent>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingTransaction ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Transaction">
        <ModalContent>
          <p className="text-[var(--muted-foreground)]">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
        </ModalContent>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(deleteId)}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
