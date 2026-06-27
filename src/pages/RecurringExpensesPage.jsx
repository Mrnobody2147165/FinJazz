import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  Loader2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { useAuth, useActiveProfile } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks';
import {
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  createTransaction,
  createNotification,
} from '@/firebase/firestore';
import {
  formatCurrency,
  formatDate,
  FREQUENCY_OPTIONS,
  getNextExecutionDate,
  getErrorMessage,
} from '@/utils/helpers';

const recurringSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
});

const categories = [
  'Housing',
  'Utilities',
  'Insurance',
  'Subscription',
  'Transportation',
  'Entertainment',
  'Food',
  'Healthcare',
  'Education',
  'Other',
];

const RecurringExpensesPage = () => {
  const { user } = useAuth();
  const { activeProfileId, currency } = useActiveProfile();
  const { recurringExpenses, isLoading } = useDashboardData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recurringSchema),
    defaultValues: {
      name: '',
      amount: 0,
      category: 'Other',
      frequency: 'monthly',
    },
  });

  const openAddModal = () => {
    reset({
      name: '',
      amount: 0,
      category: 'Other',
      frequency: 'monthly',
    });
    setEditingRecurring(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (recurring) => {
    reset({
      name: recurring.name,
      amount: recurring.amount,
      category: recurring.category,
      frequency: recurring.frequency,
    });
    setEditingRecurring(recurring);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecurring(null);
    setError('');
  };

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    setError('');

    try {
      const nextExecutionDate = getNextExecutionDate(data.frequency);

      if (editingRecurring) {
        await updateRecurringExpense(user.uid, activeProfileId, editingRecurring.id, {
          ...data,
          nextExecutionDate,
        });
      } else {
        await createRecurringExpense(user.uid, activeProfileId, {
          ...data,
          nextExecutionDate,
        });
      }

      closeModal();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRecurringExpense(user.uid, activeProfileId, deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleExecuteNow = async (recurring) => {
    try {
      // Create the expense transaction
      await createTransaction(user.uid, activeProfileId, {
        title: recurring.name,
        amount: recurring.amount,
        type: 'expense',
        category: recurring.category,
        date: new Date(),
        recurringId: recurring.id,
      });

      // Update next execution date
      const nextDate = getNextExecutionDate(recurring.frequency);
      await updateRecurringExpense(user.uid, activeProfileId, recurring.id, {
        nextExecutionDate: nextDate,
      });

      // Create notification
      await createNotification(user.uid, {
        type: 'success',
        title: 'Recurring Expense Added',
        message: `${recurring.name} (${formatCurrency(recurring.amount, currency)}) has been recorded.`,
        profileId: activeProfileId,
      });
    } catch (err) {
      console.error('Error executing:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const totalMonthly = recurringExpenses
    .filter((r) => r.active)
    .reduce((sum, r) => {
      switch (r.frequency) {
        case 'daily':
          return sum + r.amount * 30;
        case 'weekly':
          return sum + r.amount * 4;
        case 'monthly':
          return sum + r.amount;
        case 'yearly':
          return sum + r.amount / 12;
        default:
          return sum + r.amount;
      }
    }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Recurring Expenses</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Monthly total: {formatCurrency(totalMonthly, currency)}
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recurring
        </Button>
      </div>

      {recurringExpenses.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={RefreshCw}
              title="No recurring expenses"
              description="Set up recurring expenses to automate your finances"
              action={
                <Button onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recurring Expense
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {recurringExpenses.map((recurring, index) => (
              <motion.div
                key={recurring.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`relative ${!recurring.active ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--danger)]/10">
                          <RefreshCw className="h-4 w-4 text-[var(--danger)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{recurring.name}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {recurring.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(recurring)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
                          onClick={() => setDeleteId(recurring.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">Amount</span>
                        <span className="font-bold text-[var(--danger)]">
                          -{formatCurrency(recurring.amount, currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">Frequency</span>
                        <Badge variant="outline" className="capitalize">
                          {recurring.frequency}
                        </Badge>
                      </div>

                      {recurring.nextExecutionDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--muted-foreground)]">Next</span>
                          <span className="text-sm text-[var(--foreground)]">
                            {formatDate(recurring.nextExecutionDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleExecuteNow(recurring)}
                      >
                        Execute Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRecurring ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <div className="space-y-4">
              <Input
                {...register('name')}
                label="Name"
                placeholder="e.g., Monthly Rent"
                error={errors.name?.message}
              />

              <Input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                label="Amount"
                placeholder="0.00"
                error={errors.amount?.message}
              />

              <Select {...register('category')} label="Category" error={errors.category?.message}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>

              <Select {...register('frequency')} label="Frequency" error={errors.frequency?.message}>
                {FREQUENCY_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </Select>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-sm px-4 py-3 rounded-[var(--radius-sm)]"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </ModalContent>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitLoading}>
              {submitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingRecurring ? 'Saving...' : 'Adding...'}
                </>
              ) : editingRecurring ? (
                'Save Changes'
              ) : (
                'Add Recurring'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Recurring Expense">
        <ModalContent>
          <p className="text-[var(--muted-foreground)]">
            Are you sure you want to delete this recurring expense? This action cannot be undone.
          </p>
        </ModalContent>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RecurringExpensesPage;
