import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

const Toggle = ({ enabled, onChange, label, className }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        enabled ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]',
        className
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-md',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
};

export { Toggle };
