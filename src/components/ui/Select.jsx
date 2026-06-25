import { forwardRef } from 'react';
import { cn } from '@/utils/helpers';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ className, children, label, error, id, ...props }, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex h-10 w-full appearance-none rounded-[var(--radius-sm)] border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 pr-10 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer',
            error && 'border-[var(--danger)] focus:ring-[var(--danger)] focus:border-[var(--danger)]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
