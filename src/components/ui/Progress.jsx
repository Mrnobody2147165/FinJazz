import { cn } from '@/utils/helpers';

const Progress = ({ value, className, barClassName }) => {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]', className)}>
      <div
        className={cn('h-full bg-[var(--primary)] transition-all duration-500', barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
      />
    </div>
  );
};

export { Progress };
