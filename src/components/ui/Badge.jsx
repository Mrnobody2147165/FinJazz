import { cva } from 'class-variance-authority';
import { cn } from '@/utils/helpers';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--primary)] text-white',
        secondary: 'border-transparent bg-[var(--secondary)] text-white',
        success: 'border-transparent bg-green-500/10 text-green-600 border-green-500/20',
        warning: 'border-transparent bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        destructive: 'border-transparent bg-red-500/10 text-red-600 border-red-500/20',
        outline: 'text-[var(--foreground)] border-[var(--border)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = ({ className, variant, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariants };
