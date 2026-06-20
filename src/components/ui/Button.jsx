import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/helpers';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--primary)] text-white hover:opacity-90 focus-visible:ring-[var(--primary)]',
        secondary: 'bg-[var(--secondary)] text-white hover:opacity-90 focus-visible:ring-[var(--secondary)]',
        outline: 'border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] focus-visible:ring-[var(--primary)]',
        ghost: 'hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
        success: 'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
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
