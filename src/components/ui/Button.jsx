import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/helpers';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--gradient-primary)] text-[var(--primary-foreground)] rounded-[var(--radius-sm)] shadow-[var(--shadow-primary)] hover:opacity-90 focus-visible:ring-[var(--ring)]',
        secondary: 'bg-[var(--gradient-secondary)] text-[var(--secondary-foreground)] rounded-[var(--radius-sm)] shadow-[var(--shadow-secondary)] hover:opacity-90 focus-visible:ring-[var(--secondary)]',
        outline: 'border border-[var(--border)] bg-transparent text-[var(--foreground)] rounded-[var(--radius-sm)] hover:bg-[var(--surface)] hover:border-[var(--border-hover)] focus-visible:ring-[var(--ring)]',
        ghost: 'text-[var(--muted-foreground)] rounded-[var(--radius-sm)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]',
        destructive: 'bg-[var(--danger)] text-[var(--danger-foreground)] rounded-[var(--radius-sm)] hover:opacity-90 focus-visible:ring-[var(--danger)]',
        success: 'bg-[var(--success)] text-[var(--success-foreground)] rounded-[var(--radius-sm)] hover:opacity-90 focus-visible:ring-[var(--success)]',
        gradient: 'bg-[var(--gradient-primary)] text-[var(--primary-foreground)] rounded-[var(--radius-sm)] shadow-[var(--shadow-primary)] hover:shadow-lg hover:scale-[1.02] focus-visible:ring-[var(--ring)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-[var(--radius-sm)] px-3',
        lg: 'h-11 rounded-[var(--radius)] px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
