import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, FolderKanban, Loader2, Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/index';
import { createProject, updateProject, deleteProject, subscribeToProjects } from '@/firebase/firestore';
import { formatCurrency, formatDate, calculateProjectMetrics, getDeadlineColor } from '@/utils/helpers';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  client: z.string().min(1, 'Client name is required'),
  budget: z.coerce.number().min(0, 'Budget must be 0 or greater'),
  revenue: z.coerce.number().min(0, 'Revenue must be 0 or greater'),
  expenses: z.coerce.number().min(0, 'Expenses must be 0 or greater'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['not-started', 'in-progress', 'completed', 'delayed']),
});

const statusOptions = [
  { value: 'not-started', label: 'Not Started', color: 'var(--muted)' },
  { value: 'in-progress', label: 'In Progress', color: 'var(--primary)' },
  { value: 'completed', label: 'Completed', color: 'var(--success)' },
  { value: 'delayed', label: 'Delayed', color: 'var(--danger)' },
];

const statusVariants = {
  'not-started': 'default',
  'in-progress': 'secondary',
  completed: 'success',
  delayed: 'destructive',
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const { activeProfileId, activeProfile } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const currency = activeProfile?.currency || 'PKR';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      client: '',
      budget: '',
      revenue: '',
      expenses: '',
      startDate: '',
      dueDate: '',
      status: 'not-started',
    },
  });

  useEffect(() => {
    if (!user?.uid || !activeProfileId) return;

    const unsubscribe = subscribeToProjects(user.uid, activeProfileId, (data) => {
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, activeProfileId]);

  useEffect(() => {
    if (editingProject) {
      reset({
        name: editingProject.name,
        client: editingProject.client,
        budget: editingProject.budget || '',
        revenue: editingProject.revenue || '',
        expenses: editingProject.expenses || '',
        startDate: editingProject.startDate?.toDate?.().toISOString().split('T')[0] || '',
        dueDate: editingProject.dueDate?.toDate?.().toISOString().split('T')[0] || '',
        status: editingProject.status || 'not-started',
      });
    } else {
      reset({
        name: '',
        client: '',
        budget: '',
        revenue: '',
        expenses: '',
        startDate: '',
        dueDate: '',
        status: 'not-started',
      });
    }
  }, [editingProject, reset]);

  const openAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    reset();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const projectData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      };

      if (editingProject) {
        await updateProject(user.uid, activeProfileId, editingProject.id, projectData);
      } else {
        await createProject(user.uid, activeProfileId, projectData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(user.uid, activeProfileId, id);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const due = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    const now = new Date();
    return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  };

  // Calculate totals
  const totalRevenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalExpenses = projects.reduce((sum, p) => sum + (p.expenses || 0), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
  const activeProjects = projects.filter((p) => p.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Projects</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Summary Cards with theme gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ background: 'var(--kpi-income-bg)', borderLeft: '4px solid var(--kpi-income-border)' }}>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Total Revenue</p>
            <p className="text-xl font-bold text-[var(--success)] mt-1">
              {formatCurrency(totalRevenue, currency)}
            </p>
          </CardContent>
        </Card>
        <Card style={{ background: 'var(--kpi-expense-bg)', borderLeft: '4px solid var(--kpi-expense-border)' }}>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Total Expenses</p>
            <p className="text-xl font-bold text-[var(--danger)] mt-1">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </CardContent>
        </Card>
        <Card style={{ background: 'var(--kpi-balance-bg)', borderLeft: '4px solid var(--kpi-balance-border)' }}>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Total Profit</p>
            <p className={`text-xl font-bold mt-1 ${totalProfit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
              {formatCurrency(totalProfit, currency)}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Margin: {totalMargin}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--surface)] border-l-4 border-[var(--secondary)]">
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Active Projects</p>
            <p className="text-xl font-bold text-[var(--foreground)] mt-1">{activeProjects}</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">Loading...</CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to start tracking profitability and deadlines"
              action={<Button onClick={openAddModal}>Add Project</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project, index) => {
            const metrics = calculateProjectMetrics(project);
            const daysRemaining = getDaysRemaining(project.dueDate);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">{project.name}</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">{project.client}</p>
                      </div>
                      <Badge variant={statusVariants[project.status] || 'default'}>
                        {statusOptions.find(s => s.value === project.status)?.label || project.status}
                      </Badge>
                    </div>

                    {/* Deadline Warning */}
                    {daysRemaining !== null && project.status !== 'completed' && (
                      <div
                        className="flex items-center gap-2 p-2 rounded-[var(--radius-sm)] mb-4"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${getDeadlineColor(daysRemaining)} 10%, transparent)`,
                        }}
                      >
                        <Calendar
                          className="h-4 w-4"
                          style={{ color: getDeadlineColor(daysRemaining) }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: getDeadlineColor(daysRemaining) }}
                        >
                          {daysRemaining < 0
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : daysRemaining === 0
                            ? 'Due today'
                            : `${daysRemaining} days remaining`}
                        </span>
                      </div>
                    )}

                    {/* Financial Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">Revenue</p>
                        <p className="font-semibold text-[var(--success)]">
                          {formatCurrency(metrics.revenue, currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">Expenses</p>
                        <p className="font-semibold text-[var(--danger)]">
                          {formatCurrency(metrics.expenses, currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">Profit</p>
                        <p className={`font-semibold ${metrics.isProfitable ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                          {formatCurrency(metrics.profit, currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">Margin</p>
                        <p className={`font-semibold ${metrics.margin >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                          {metrics.margin}%
                        </p>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--muted-foreground)]">Budget: {formatCurrency(metrics.budget, currency)}</span>
                        <span className={metrics.budgetUtilization > 100 ? 'text-[var(--danger)]' : 'text-[var(--muted-foreground)]'}>
                          {metrics.budgetUtilization}% used
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            metrics.budgetUtilization > 100
                              ? 'bg-[var(--danger)]'
                              : metrics.budgetUtilization > 75
                              ? 'bg-[var(--warning)]'
                              : 'bg-[var(--primary)]'
                          }`}
                          style={{ width: `${Math.min(metrics.budgetUtilization, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(project)}>
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        onClick={() => setDeleteId(project.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProject ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <div className="space-y-4">
              <Input
                {...register('name')}
                label="Project Name"
                placeholder="Enter project name"
                error={errors.name?.message}
              />

              <Input
                {...register('client')}
                label="Client Name"
                placeholder="Enter client name"
                error={errors.client?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('startDate')}
                  type="date"
                  label="Start Date"
                  error={errors.startDate?.message}
                />
                <Input
                  {...register('dueDate')}
                  type="date"
                  label="Due Date"
                  error={errors.dueDate?.message}
                />
              </div>

              <Input
                {...register('budget')}
                type="number"
                step="0.01"
                label="Budget"
                placeholder="Enter budget"
                error={errors.budget?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('revenue')}
                  type="number"
                  step="0.01"
                  label="Revenue"
                  placeholder="Enter revenue"
                  error={errors.revenue?.message}
                />
                <Input
                  {...register('expenses')}
                  type="number"
                  step="0.01"
                  label="Expenses"
                  placeholder="Enter expenses"
                  error={errors.expenses?.message}
                />
              </div>

              <Select {...register('status')} label="Status" error={errors.status?.message}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
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
              ) : editingProject ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
        <ModalContent>
          <p className="text-[var(--muted-foreground)]">
            Are you sure you want to delete this project? This action cannot be undone.
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

export default ProjectsPage;
