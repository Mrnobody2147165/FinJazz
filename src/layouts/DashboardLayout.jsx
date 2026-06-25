import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/hooks/useThemeColors';
import useThemeStore from '@/stores/themeStore';
import { useAuthStore, useNotificationStore } from '@/stores/index';
import ProfileSwitcher from '@/components/ProfileSwitcher';
import NotificationCenter from '@/components/NotificationCenter';
import GlobalSearch from '@/components/GlobalSearch';
import CreateProfileModal from '@/components/CreateProfileModal';
import {
  subscribeToNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  subscribeToProfiles,
  subscribeToTransactions,
  subscribeToBudgets,
  subscribeToProjects,
  subscribeToRecurringExpenses,
  checkBudgetAlerts,
  checkProjectDeadlines,
} from '@/firebase/firestore';

const DashboardLayout = () => {
  const { userData, handleLogout } = useAuth();
  const themeColors = useThemeColors();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const {
    user,
    profiles,
    setProfiles,
    activeProfileId,
    activeProfile,
  } = useAuthStore();
  const { setNotifications, notifications } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [createProfileOpen, setCreateProfileOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const navigate = useNavigate();

  // Subscribe to profiles
  useEffect(() => {
    if (!user?.uid) return;
    return subscribeToProfiles(user.uid, setProfiles);
  }, [user?.uid]);

  // Subscribe to notifications
  useEffect(() => {
    if (!user?.uid) return;
    return subscribeToNotifications(user.uid, setNotifications);
  }, [user?.uid]);

  // Subscribe to active profile data
  useEffect(() => {
    if (!user?.uid || !activeProfileId) return;

    const unsubTransactions = subscribeToTransactions(user.uid, activeProfileId, setTransactions);
    const unsubBudgets = subscribeToBudgets(user.uid, activeProfileId, setBudgets);
    const unsubRecurring = subscribeToRecurringExpenses(user.uid, activeProfileId, setRecurringExpenses);
    let unsubProjects;
    if (activeProfile?.profileType === 'company') {
      unsubProjects = subscribeToProjects(user.uid, activeProfileId, setProjects);
    }

    return () => {
      unsubTransactions();
      unsubBudgets();
      unsubRecurring();
      if (unsubProjects) unsubProjects();
    };
  }, [user?.uid, activeProfileId, activeProfile?.profileType]);

  // Check budget alerts when transactions or budgets change
  useEffect(() => {
    if (!user?.uid || !activeProfileId || transactions.length === 0 || budgets.length === 0) return;
    checkBudgetAlerts(user.uid, activeProfileId, transactions, budgets);
  }, [user?.uid, activeProfileId, transactions.length, budgets.length]);

  // Check project deadlines when projects change (company only)
  useEffect(() => {
    if (!user?.uid || !activeProfileId || !isCompany || projects.length === 0) return;
    checkProjectDeadlines(user.uid, activeProfileId, projects);
  }, [user?.uid, activeProfileId, isCompany, projects.length]);

  const isCompany = activeProfile?.profileType === 'company';

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: Receipt,
    },
    {
      name: 'Budgets',
      href: '/budgets',
      icon: PiggyBank,
    },
    {
      name: 'Recurring',
      href: '/recurring-expenses',
      icon: RefreshCw,
    },
    ...(isCompany
      ? [
          {
            name: 'Projects',
            href: '/projects',
            icon: FolderKanban,
          },
        ]
      : []),
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(user.uid, notificationId);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(user.uid);
  };

  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification(user.uid, notificationId);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-[var(--card)] border-b border-[var(--border)]">
        <button onClick={() => setSidebarOpen(true)} className="text-[var(--foreground)]">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold gradient-text">FinJazz</h1>
        <div className="flex items-center gap-2">
          <NotificationCenter
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onDelete={handleDeleteNotification}
          />
          <Avatar
            src={userData?.profileImage}
            name={userData?.fullName}
            size="sm"
          />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[var(--card)] border-r border-[var(--border)]"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h1 className="text-xl font-bold gradient-text">FinJazz</h1>
                <button onClick={() => setSidebarOpen(false)} className="text-[var(--foreground)]">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-[var(--primary-foreground)] shadow-[var(--shadow-primary)]'
                          : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - with theme-gradient background */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col"
        style={{ background: themeColors.gradientSidebar }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-[var(--sidebar-text)]">FinJazz</h1>
        </div>

        {/* Profile Switcher */}
        <ProfileSwitcher onAddProfile={() => setCreateProfileOpen(true)} />

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] transition-all ${
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-text)] shadow-[var(--shadow-primary)]'
                    : 'text-[var(--sidebar-icon)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-[var(--radius-sm)] text-[var(--sidebar-icon)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] transition-all"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-[var(--card)]/80 backdrop-blur-sm border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <GlobalSearch
              transactions={transactions}
              budgets={budgets}
              projects={projects}
              notifications={notifications}
              recurringExpenses={recurringExpenses}
              activeProfile={activeProfile}
            />
            <span className="text-sm text-[var(--muted-foreground)]">
              {activeProfile?.profileType === 'company' ? 'Company Dashboard' : 'Personal Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onDelete={handleDeleteNotification}
            />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-[var(--radius-sm)] text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-all"
              >
                <Avatar src={userData?.profileImage} name={userData?.fullName} size="sm" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {userData?.fullName}
                </span>
                <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow-lg)] overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={createProfileOpen}
        onClose={() => setCreateProfileOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
