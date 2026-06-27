import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { useActiveProfile } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks';
import { formatCurrency, formatDate, calculateTotals, getExpensesByCategory, prepareChartData, getDeadlineColor } from '@/utils/helpers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { PROJECT_STATUS } from '@/constants';

const PROJECT_STATUS_VARIANTS = {
  [PROJECT_STATUS.IN_PROGRESS]: 'success',
  [PROJECT_STATUS.COMPLETED]: 'default',
  [PROJECT_STATUS.DELAYED]: 'destructive',
  [PROJECT_STATUS.NOT_STARTED]: 'warning',
};

const DashboardPage = () => {
  const { activeProfileId, profiles, isCompany, currency } = useActiveProfile();
  const { transactions, budgets, projects, isLoading } = useDashboardData();
  const themeColors = useThemeColors();

  const totals = calculateTotals(transactions);
  const categories = getExpensesByCategory(transactions);
  const chartData = prepareChartData(transactions);
  const recentTransactions = transactions.slice(0, 5);

  const budgetAlerts = useMemo(() => {
    if (budgets.length === 0) return [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return budgets
      .map((budget) => {
        const spent = transactions
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

        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        let severity = 'info';
        if (percentage >= 100) severity = 'critical';
        else if (percentage >= 90) severity = 'warning';
        else if (percentage >= 75) severity = 'warning';

        return {
          ...budget,
          spent,
          remaining: budget.amount - spent,
          percentage: Math.min(percentage, 100),
          severity,
          isOverBudget: spent > budget.amount,
        };
      })
      .filter((b) => b.percentage >= 50 || b.isOverBudget)
      .sort((a, b) => b.percentage - a.percentage);
  }, [budgets, transactions]);

  const projectDeadlines = useMemo(() => {
    if (!isCompany || projects.length === 0) return [];
    const now = new Date();

    return projects
      .filter((p) => p.status !== PROJECT_STATUS.COMPLETED && p.dueDate)
      .map((project) => {
        const dueDate = project.dueDate?.toDate ? project.dueDate.toDate() : new Date(project.dueDate);
        const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        let status = 'on-track';
        if (daysRemaining < 0) status = 'overdue';
        else if (daysRemaining <= 3) status = 'urgent';
        else if (daysRemaining <= 7) status = 'warning';

        return { ...project, dueDateObj: dueDate, daysRemaining, status };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 5);
  }, [projects, isCompany]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!activeProfileId && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <EmptyState
          icon={Wallet}
          title="No profiles yet"
          description="Complete onboarding to get started"
        />
      </div>
    );
  }

  if (!activeProfileId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <EmptyState
          icon={Wallet}
          title="Select a profile"
          description="Choose a profile from the sidebar to view your dashboard"
        />
      </div>
    );
  }

  if (isCompany) {
    const activeProjects = projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length;
    const totalRevenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalExpenses = projects.reduce((sum, p) => sum + (p.expenses || 0), 0);
    const profit = totalRevenue - totalExpenses;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <Link to="/transactions?action=add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="relative overflow-hidden" style={{ background: 'var(--kpi-income-bg)', borderLeft: '4px solid var(--kpi-income-border)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Revenue</p>
                    <p className="text-2xl font-bold text-[var(--success)] mt-1">{formatCurrency(totalRevenue, currency)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[var(--success)]/20 shadow-[var(--shadow-primary)]">
                    <TrendingUp className="h-5 w-5 text-[var(--success)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden" style={{ background: 'var(--kpi-expense-bg)', borderLeft: '4px solid var(--kpi-expense-border)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Expenses</p>
                    <p className="text-2xl font-bold text-[var(--danger)] mt-1">{formatCurrency(totalExpenses, currency)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[var(--danger)]/20 shadow-[var(--shadow-secondary)]">
                    <TrendingDown className="h-5 w-5 text-[var(--danger)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="relative overflow-hidden" style={{ background: 'var(--kpi-balance-bg)', borderLeft: '4px solid var(--kpi-balance-border)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Profit</p>
                    <p className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {formatCurrency(profit, currency)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full shadow-[var(--shadow-primary)] ${profit >= 0 ? 'bg-[var(--success)]/20' : 'bg-[var(--danger)]/20'}`}>
                    <Wallet className={`h-5 w-5 ${profit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="relative overflow-hidden bg-[var(--surface)] border-l-4 border-[var(--secondary)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Active Projects</p>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{activeProjects}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[var(--secondary)]/20 shadow-[var(--shadow-secondary)]">
                    <PiggyBank className="h-5 w-5 text-[var(--secondary)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Revenue vs Expenses</CardTitle></CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="income" stroke={themeColors.success} fill={themeColors.success} fillOpacity={0.2} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stroke={themeColors.error} fill={themeColors.error} fillOpacity={0.2} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={TrendingUp} title="No data yet" description="Add transactions to see your revenue vs expenses chart" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Recent Projects</CardTitle></CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]/50">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{project.name}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{project.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[var(--foreground)]">{formatCurrency(project.budget || 0, currency)}</p>
                        <Badge variant={PROJECT_STATUS_VARIANTS[project.status] || 'warning'}>{project.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={PiggyBank}
                  title="No projects yet"
                  description="Create your first project to track progress"
                  action={<Link to="/projects"><Button>Add Project</Button></Link>}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <Link to="/transactions?action=add">
          <Button><Plus className="h-4 w-4 mr-2" />Add Transaction</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Balance', value: formatCurrency(totals.balance, currency), icon: Wallet, style: { background: 'var(--kpi-balance-bg)', borderLeft: '4px solid var(--kpi-balance-border)' }, color: 'text-[var(--foreground)]' },
          { label: 'Total Income', value: formatCurrency(totals.income, currency), icon: TrendingUp, style: { background: 'var(--kpi-income-bg)', borderLeft: '4px solid var(--kpi-income-border)' }, color: 'text-[var(--success)]' },
          { label: 'Total Expenses', value: formatCurrency(totals.expenses, currency), icon: TrendingDown, style: { background: 'var(--kpi-expense-bg)', borderLeft: '4px solid var(--kpi-expense-border)' }, color: 'text-[var(--danger)]' },
          { label: 'Savings', value: formatCurrency(totals.savings, currency), icon: PiggyBank, style: { background: 'var(--surface)', borderLeft: '4px solid var(--secondary)' }, color: totals.savings >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.1 }}>
            <Card className="relative overflow-hidden" style={kpi.style}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">{kpi.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[var(--primary)]/20 shadow-[var(--shadow-primary)]">
                    <kpi.icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Income vs Expenses</CardTitle></CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="income" stroke={themeColors.success} fill={themeColors.success} fillOpacity={0.2} name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke={themeColors.error} fill={themeColors.error} fillOpacity={0.2} name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingUp} title="No data yet" description="Add transactions to see your income vs expenses chart" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Expense Categories</CardTitle></CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categories} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={themeColors.chart[index % themeColors.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} formatter={(value) => formatCurrency(value, currency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={PiggyBank} title="No expenses yet" description="Add expense transactions to see category breakdown" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link to="/transactions"><Button variant="ghost" size="sm">View All</Button></Link>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--muted)]/50 hover:bg-[var(--muted)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-[var(--success)]/10' : 'bg-[var(--danger)]/10'}`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-[var(--success)]" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-[var(--danger)]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{transaction.title || 'Untitled'}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{transaction.category} • {formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Add your first transaction to start tracking your finances"
              action={<Link to="/transactions?action=add"><Button>Add Transaction</Button></Link>}
            />
          )}
        </CardContent>
      </Card>

      {budgetAlerts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
              Budget Alerts
            </CardTitle>
            <Link to="/budgets"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetAlerts.slice(0, 3).map((budget) => (
                <div key={budget.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{budget.category}</Badge>
                      <span className="font-medium text-[var(--foreground)]">{budget.name}</span>
                    </div>
                    <Badge variant={budget.isOverBudget ? 'destructive' : budget.severity === 'warning' ? 'warning' : 'outline'}>
                      {budget.isOverBudget ? 'Over Budget' : `${Math.round(budget.percentage)}%`}
                    </Badge>
                  </div>
                  <Progress
                    value={budget.percentage}
                    barClassName={budget.isOverBudget ? 'bg-[var(--danger)]' : budget.percentage >= 75 ? 'bg-[var(--warning)]' : 'bg-[var(--primary)]'}
                  />
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-[var(--muted-foreground)]">{formatCurrency(budget.spent, currency)} spent</span>
                    <span className={budget.isOverBudget ? 'text-[var(--danger)]' : 'text-[var(--success)]'}>
                      {budget.isOverBudget ? `${formatCurrency(Math.abs(budget.remaining), currency)} over` : `${formatCurrency(budget.remaining, currency)} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isCompany && projectDeadlines.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--primary)]" />
              Upcoming Deadlines
            </CardTitle>
            <Link to="/projects"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectDeadlines.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: project.status === 'overdue' ? 'var(--danger)' : 'var(--primary)', opacity: 0.2 }}>
                      {project.status === 'overdue' ? (
                        <AlertTriangle className="h-4 w-4 text-[var(--danger)]" />
                      ) : (
                        <Calendar className="h-4 w-4 text-[var(--primary)]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{project.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{project.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: getDeadlineColor(project.daysRemaining) }}>
                      {project.status === 'overdue'
                        ? `${Math.abs(project.daysRemaining)} days overdue`
                        : project.daysRemaining === 0
                        ? 'Due today'
                        : `${project.daysRemaining} days left`}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">Due: {formatDate(project.dueDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
