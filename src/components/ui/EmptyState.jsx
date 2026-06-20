import { cn } from '@/utils/helpers';
import { FileText } from 'lucide-react';

const EmptyState = ({ icon: Icon = FileText, title, description, action, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="rounded-full bg-[var(--muted)] p-4 mb-4">
        <Icon className="h-8 w-8 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
};

export { EmptyState };
