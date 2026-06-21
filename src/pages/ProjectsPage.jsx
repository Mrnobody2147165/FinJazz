import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, FolderKanban, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { createProject, updateProject, deleteProject, subscribeToProjects } from '@/firebase/firestore';
import { formatCurrency } from '@/utils/helpers';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  client: z.string().min(1, 'Client name is required'),
  budget: z.coerce.number().min(0, 'Budget must be 0 or greater'),
  revenue: z.coerce.number().min(0, 'Revenue must be 0 or greater'),
  expenses: z.coerce.number().min(0, 'Expenses must be 0 or greater'),
  status: z.enum(['active', 'completed', 'on-hold']),
});

const statusVariants = {
  active: 'success',
  completed: 'default',
  'on-hold': 'warning',
};

const ProjectsPage = () => {
  const { user, userData } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const currency = userData?.currency || 'USD';

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
      status: 'active',
    },
  });

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToProjects(user.uid, (data) => {
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    if (editingProject) {
      reset({
        name: editingProject.name,
        client: editingProject.client,
        budget: editingProject.budget || '',
        revenue: editingProject.revenue || '',
        expenses: editingProject.expenses || '',
        status: editingProject.status || 'active',
      });
    } else {
      reset({
        name: '',
        client: '',
        budget: '',
        revenue: '',
        expenses: '',
        status: 'active',
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
      if (editingProject) {
        await updateProject(user.uid, editingProject.id, data);
      } else {
        await createProject(user.uid, data);
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
      await deleteProject(user.uid, id);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const totalRevenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalExpenses = projects.reduce((sum, p) => sum + (p.expenses || 0), 0);
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Projects</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Total Revenue</p>
            <p className="text-xl font-bold text-[var(--success)] mt-1">
              {formatCurrency(totalRevenue, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--muted-foreground)]">Total Expenses</p>
            <p className="text-xl font-bold text-[var(--error)] mt-1">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
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
              description="Create your first project to start tracking"
              action={<Button onClick={openAddModal}>Add Project</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--foreground)]">
                      Client
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--foreground)]">
                      Budget
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--foreground)]">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--foreground)]">
                      Expenses
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--foreground)]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--foreground)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[var(--foreground)]">{project.name}</p>
                      </td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">{project.client}</td>
                      <td className="px-6 py-4 text-right text-[var(--foreground)]">
                        {formatCurrency(project.budget || 0, currency)}
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--success)]">
                        {formatCurrency(project.revenue || 0, currency)}
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--error)]">
                        {formatCurrency(project.expenses || 0, currency)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={statusVariants[project.status] || 'outline'}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(project)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[var(--error)] hover:text-[var(--error)]/80 hover:bg-[var(--error)]/10"
                            onClick={() => setDeleteId(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

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

              <Input
                {...register('budget')}
                type="number"
                step="0.01"
                label="Budget"
                placeholder="Enter budget"
                error={errors.budget?.message}
              />

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

              <Select {...register('status')} label="Status" error={errors.status?.message}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
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
