import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, PiggyBank, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth, useActiveProfile } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks';
import { createBudget, updateBudget, deleteBudget } from '@/firebase/firestore';
import { formatCurrency, getErrorMessage } from '@/utils/helpers';

const budgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  period: z.enum(['monthly', 'yearly']),
});

const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

const BudgetsPage = () => {
  const { user } = useAuth();
  const { activeProfileId, currency } = useActiveProfile();
  const { budgets, transactions, isLoading } = useDashboardData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: '',
      amount: '',
      category: '',
      period: 'monthly',
    },
  });

  useEffect(() => {
    if (editingBudget) {
      reset({
        name: editingBudget.name,
        amount: editingBudget.amount,
        category: editingBudget.category,
        period: editingBudget.period || 'monthly',
      });
    } else {
      reset({
        name: '',
        amount: '',
        category: '',
        period: 'monthly',
      });
    }
  }, [editingBudget, reset]);

  const calculateSpent = (budget) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter((t) => {
        const transactionDate = t.date?.toDate ? t.date.toDate() : new Date(t.date);
        const isExpense = t.type === 'expense';
        const matchesCategory = t.category === budget.category;
        const isCurrentPeriod =
          budget.period === 'monthly'
            ? transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            : transactionDate.getFullYear() === currentYear;

        return isExpense && matchesCategory && isCurrentPeriod;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const openAddModal = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!user?.uid || !activeProfileId) return;
    setSubmitting(true);
    setFormError('');
    try {
      if (editingBudget) {
        await updateBudget(user.uid, activeProfileId, editingBudget.id, data);
      } else {
        await createBudget(user.uid, activeProfileId, data);
      }
      closeModal();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user?.uid || !activeProfileId) return;
    try {
      await deleteBudget(user.uid, activeProfileId, id);
      setDeleteId(null);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Budgets</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={PiggyBank}
              title="No budgets yet"
              description="Create your first budget to start tracking your spending"
              action={<Button onClick={openAddModal}>Add Budget</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const spent = calculateSpent(budget);
            const remaining = budget.amount - spent;
            const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            const isOverBudget = spent > budget.amount;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">{budget.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {budget.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {budget.period}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(budget)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[var(--error)] hover:text-[var(--error)]/80 hover:bg-[var(--error)]/10"
                          onClick={() => setDeleteId(budget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[var(--muted-foreground)]">Spent</span>
                        <span
                          className={`font-semibold ${
                            isOverBudget ? 'text-[var(--error)]' : 'text-[var(--foreground)]'
                          }`}
                        >
                          {formatCurrency(spent, currency)} / {formatCurrency(budget.amount, currency)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        barClassName={isOverBudget ? 'bg-[var(--error)]' : percentage > 75 ? 'bg-[var(--warning)]' : 'bg-[var(--primary)]'}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--muted-foreground)]">Remaining</span>
                      <span
                        className={`text-sm font-semibold ${
                          isOverBudget ? 'text-[var(--error)]' : 'text-[var(--success)]'
                        }`}
                      >
                        {isOverBudget
                          ? `${formatCurrency(Math.abs(remaining), currency)} over`
                          : formatCurrency(remaining, currency)}
                      </span>
                    </div>

                    {isOverBudget && (
                      <div className="mt-3 p-2 bg-[var(--error)]/10 rounded-lg">
                        <p className="text-xs text-[var(--error)]">
                          You've exceeded this budget by {formatCurrency(Math.abs(remaining), currency)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBudget ? 'Edit Budget' : 'Add Budget'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <div className="space-y-4">
              <Input
                {...register('name')}
                label="Budget Name"
                placeholder="e.g., Monthly Groceries"
                error={errors.name?.message}
              />

              <Input
                {...register('amount')}
                type="number"
                step="0.01"
                label="Budget Amount"
                placeholder="Enter amount"
                error={errors.amount?.message}
              />

              <Select {...register('category')} label="Category" error={errors.category?.message}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>

              <Select {...register('period')} label="Period">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </div>
            {formError && (
              <p className="text-sm text-[var(--danger)] mt-4">{formError}</p>
            )}
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
              ) : editingBudget ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Budget">
        <ModalContent>
          <p className="text-[var(--muted-foreground)]">
            Are you sure you want to delete this budget? This action cannot be undone.
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

export default BudgetsPage;
