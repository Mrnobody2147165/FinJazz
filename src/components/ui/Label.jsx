import { cn } from '@/utils/helpers';

const Label = ({ className, ...props }) => (
  <label
    className={cn(
      'text-sm font-medium leading-none text-[var(--foreground)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
);

export { Label };
