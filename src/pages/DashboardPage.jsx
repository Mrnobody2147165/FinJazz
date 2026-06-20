import { useState, useEffect } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import {
  subscribeToTransactions,
  subscribeToBudgets,
  subscribeToProjects,
} from '@/firebase/firestore';
import { formatCurrency, formatDate, calculateTotals, getExpensesByCategory, prepareChartData } from '@/utils/helpers';

const COLORS = ['#1A472A', '#7B2FBE', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#6366f1'];

const DashboardPage = () => {
  const { user, userData } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const isCompany = userData?.accountType === 'company';
  const currency = userData?.currency || 'USD';

  useEffect(() => {
    if (!user?.uid) return;

    const unsubTransactions = subscribeToTransactions(user.uid, (data) => {
      setTransactions(data);
      setLoading(false);
    });

    const unsubBudgets = subscribeToBudgets(user.uid, (data) => {
      setBudgets(data);
    });

    let unsubProjects;
    if (isCompany) {
      unsubProjects = subscribeToProjects(user.uid, (data) => {
        setProjects(data);
      });
    }

    return () => {
      unsubTransactions();
      unsubBudgets();
      if (unsubProjects) unsubProjects();
    };
  }, [user?.uid, isCompany]);

  const totals = calculateTotals(transactions);
  const categories = getExpensesByCategory(transactions);
  const chartData = prepareChartData(transactions);
  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-4 gap-4">
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

  if (isCompany) {
    const activeProjects = projects.filter((p) => p.status === 'active').length;
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Revenue</p>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                      {formatCurrency(totalRevenue, currency)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Expenses</p>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                      {formatCurrency(totalExpenses, currency)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-red-500/10">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--primary)]/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Profit</p>
                    <p className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(profit, currency)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${profit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <Wallet className={`h-5 w-5 ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--secondary)]/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Active Projects</p>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                      {activeProjects}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-[var(--secondary)]/10">
                    <PiggyBank className="h-5 w-5 text-[var(--secondary)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.2}
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.2}
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title="No data yet"
                  description="Add transactions to see your revenue vs expenses chart"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]/50"
                    >
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{project.name}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{project.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[var(--foreground)]">
                          {formatCurrency(project.budget || 0, currency)}
                        </p>
                        <Badge
                          variant={
                            project.status === 'active'
                              ? 'success'
                              : project.status === 'completed'
                              ? 'default'
                              : 'warning'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={PiggyBank}
                  title="No projects yet"
                  description="Create your first project to track progress"
                  action={
                    <Link to="/projects">
                      <Button>Add Project</Button>
                    </Link>
                  }
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--primary)]/10 rounded-full -mr-10 -mt-10" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Current Balance</p>
                  <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                    {formatCurrency(totals.balance, currency)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-[var(--primary)]/10">
                  <Wallet className="h-5 w-5 text-[var(--primary)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Total Income</p>
                  <p className="text-2xl font-bold text-green-500 mt-1">
                    {formatCurrency(totals.income, currency)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">
                    {formatCurrency(totals.expenses, currency)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-500/10">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--secondary)]/10 rounded-full -mr-10 -mt-10" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Savings</p>
                  <p className={`text-2xl font-bold mt-1 ${totals.savings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(totals.savings, currency)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-[var(--secondary)]/10">
                  <PiggyBank className="h-5 w-5 text-[var(--secondary)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No data yet"
                description="Add transactions to see your income vs expenses chart"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => formatCurrency(value, currency)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={PiggyBank}
                title="No expenses yet"
                description="Add expense transactions to see category breakdown"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link to="/transactions">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[var(--muted)]/50 hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-green-500/10'
                          : 'bg-red-500/10'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{transaction.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Add your first transaction to start tracking your finances"
              action={
                <Link to="/transactions?action=add">
                  <Button>Add Transaction</Button>
                </Link>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
