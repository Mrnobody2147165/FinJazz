import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

const Loading = ({ className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn(
          'rounded-full border-t-[var(--primary)] border-r-[var(--secondary)] border-b-[var(--muted)] border-l-[var(--muted)]',
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

const LoadingOverlay = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)] backdrop-blur-sm">
      <div className="bg-[var(--card)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] flex flex-col items-center">
        <Loading size="lg" />
        {message && <p className="mt-4 text-[var(--muted-foreground)]">{message}</p>}
      </div>
    </div>
  );
};

export { Loading, LoadingOverlay };
