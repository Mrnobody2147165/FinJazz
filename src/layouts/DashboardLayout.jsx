import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import useThemeStore from '@/stores/themeStore';

const DashboardLayout = () => {
  const { userData, handleLogout } = useAuth();
  const { darkMode, toggleDarkMode, getPalette } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const palette = getPalette();

  const isCompany = userData?.accountType === 'company';

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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-[var(--card)] border-b border-[var(--border)]">
        <button onClick={() => setSidebarOpen(true)} className="text-[var(--foreground)]">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">FinJazz</h1>
        <Avatar
          src={userData?.profileImage}
          name={userData?.fullName}
          size="sm"
        />
      </div>

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
                <h1 className="text-xl font-bold" style={{ color: palette.primary }}>
                  FinJazz
                </h1>
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
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[var(--primary)] text-white'
                          : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
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

      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-[var(--card)] border-r border-[var(--border)]">
        <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--border)]">
          <h1 className="text-xl font-bold" style={{ color: palette.primary }}>
            FinJazz
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-[var(--card)]/50 backdrop-blur-sm border-b border-[var(--border)]">
          <div />
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
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
                    className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-lg border border-[var(--border)] shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
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

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
