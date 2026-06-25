import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useNotificationStore } from '@/stores/index';
import { formatDateTime, getNotificationTypeColor } from '@/utils/helpers';
import { clsx } from 'clsx';

const NotificationIcon = ({ type }) => {
  const iconProps = { className: 'h-5 w-5' };
  switch (type) {
    case 'critical':
      return <AlertCircle {...iconProps} style={{ color: 'var(--danger)' }} />;
    case 'warning':
      return <AlertTriangle {...iconProps} style={{ color: 'var(--warning)' }} />;
    case 'success':
      return <CheckCircle {...iconProps} style={{ color: 'var(--success)' }} />;
    default:
      return <Info {...iconProps} style={{ color: 'var(--primary)' }} />;
  }
};

const NotificationCenter = ({ onMarkRead, onMarkAllRead, onDelete }) => {
  const { notifications, unreadCount, isOpen, toggleOpen, setOpen } = useNotificationStore();
  const [filter, setFilter] = useState('all');
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpen]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const handleMarkRead = async (notificationId) => {
    onMarkRead?.(notificationId);
  };

  const handleMarkAllRead = async () => {
    onMarkAllRead?.();
  };

  const handleDelete = async (notificationId) => {
    onDelete?.(notificationId);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="relative p-2 rounded-[var(--radius-sm)] text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs font-semibold bg-[var(--danger)] text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-4 top-16 w-96 max-w-[calc(100vw-2rem)] bg-[var(--card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--border)] z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="p-2 rounded-[var(--radius-sm)] text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-[var(--radius-sm)] text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 p-2 border-b border-[var(--border)] overflow-x-auto">
              {['all', 'unread', 'info', 'warning', 'critical'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    'px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap',
                    filter === f
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  )}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-[var(--muted)] mb-4" />
                  <p className="text-[var(--muted-foreground)]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={clsx(
                        'p-4 hover:bg-[var(--surface)] transition-colors',
                        !notification.read && 'bg-[var(--primary)]/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 h-2 w-2 rounded-full bg-[var(--primary)]" />
                            )}
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)] mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[var(--muted)] mt-2">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkRead(notification.id)}
                            className="p-1.5 rounded text-xs text-[var(--muted-foreground)] hover:text-[var(--success)] hover:bg-[var(--success)]/10 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1.5 rounded text-xs text-[var(--muted-foreground)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
