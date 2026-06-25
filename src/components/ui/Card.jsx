import { cn } from '@/utils/helpers';

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow)] transition-all hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]',
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-[var(--foreground)]', className)} {...props} />
);

const CardDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-[var(--muted-foreground)]', className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
