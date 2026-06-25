import { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

const Input = forwardRef(({ className, type = 'text', label, error, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded-[var(--radius-sm)] border border-[var(--input-border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-[var(--danger)] focus:ring-[var(--danger)] focus:border-[var(--danger)]',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
