import { cn } from '@/utils/helpers';
import { getInitials } from '@/utils/helpers';

const Avatar = ({ src, name, className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    default: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-24 w-24 text-2xl',
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white font-medium',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
};

export { Avatar };
