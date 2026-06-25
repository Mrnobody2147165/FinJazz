import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Receipt,
  PiggyBank,
  FolderKanban,
  Bell,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchItems } from '@/utils/helpers';
import { clsx } from 'clsx';

const SearchResultItem = ({ item, type, onClick }) => {
  const icons = {
    transaction: Receipt,
    budget: PiggyBank,
    project: FolderKanban,
    notification: Bell,
    recurring: RefreshCw,
  };

  const Icon = icons[type] || FileText;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface)] transition-colors text-left"
    >
      <div className="flex-shrink-0 p-2 rounded-[var(--radius-sm)] bg-[var(--primary-muted)]">
        <Icon className="h-4 w-4 text-[var(--primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)] truncate">
          {item.title || item.name || item.category}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] capitalize">
          {type} {item.category && `• ${item.category}`}
        </p>
      </div>
    </button>
  );
};

const GlobalSearch = ({
  transactions = [],
  budgets = [],
  projects = [],
  notifications = [],
  recurringExpenses = [],
  activeProfile,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeType, setActiveType] = useState('all');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = {
    transactions: searchItems(transactions, query, ['title', 'category', 'amount'])
      .slice(0, 5)
      .map((t) => ({ ...t, type: 'transaction' })),
    budgets: searchItems(budgets, query, ['category', 'name'])
      .slice(0, 3)
      .map((b) => ({ ...b, type: 'budget' })),
    projects: searchItems(projects, query, ['name', 'client', 'description'])
      .slice(0, 3)
      .map((p) => ({ ...p, type: 'project' })),
    notifications: searchItems(notifications, query, ['title', 'message'])
      .slice(0, 3)
      .map((n) => ({ ...n, type: 'notification' })),
    recurring: searchItems(recurringExpenses, query, ['name', 'category'])
      .slice(0, 3)
      .map((r) => ({ ...r, type: 'recurring' })),
  };

  const filteredResults =
    activeType === 'all'
      ? [
          ...searchResults.transactions,
          ...searchResults.budgets,
          ...searchResults.projects,
          ...searchResults.notifications,
          ...searchResults.recurring,
        ]
      : searchResults[activeType] || [];

  const handleItemClick = (item) => {
    setIsOpen(false);
    setQuery('');

    switch (item.type) {
      case 'transaction':
        navigate('/transactions');
        break;
      case 'budget':
        navigate('/budgets');
        break;
      case 'project':
        navigate('/projects');
        break;
      case 'notification':
        navigate('/notifications');
        break;
      case 'recurring':
        navigate('/recurring-expenses');
        break;
      default:
        break;
    }
  };

  const hasResults = filteredResults.length > 0;

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-48 lg:w-64 h-10 pl-10 pr-8 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 lg:w-96 bg-[var(--card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--border)] z-50 max-h-[70vh] overflow-hidden"
          >
            {/* Type Filters */}
            <div className="flex items-center gap-2 p-2 border-b border-[var(--border)] overflow-x-auto">
              {['all', 'transactions', 'budgets', 'projects', 'notifications', 'recurring'].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={clsx(
                      'px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap capitalize',
                      activeType === type
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    )}
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {hasResults ? (
                <div className="divide-y divide-[var(--border)]">
                  {filteredResults.map((item, index) => (
                    <SearchResultItem
                      key={`${item.type}-${item.id || index}`}
                      item={item}
                      type={item.type}
                      onClick={() => handleItemClick(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-[var(--muted)] mb-4" />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No results for "{query}"
                  </p>
                </div>
              )}
            </div>

            {/* Keyboard shortcut hint */}
            <div className="p-2 border-t border-[var(--border)] text-xs text-center text-[var(--muted-foreground)]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)]">Esc</kbd> to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
