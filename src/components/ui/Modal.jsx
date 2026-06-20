import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';

const Modal = ({ isOpen, onClose, children, title, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full max-w-lg bg-[var(--card)] rounded-xl shadow-2xl border border-[var(--border)] p-6 max-h-[90vh] overflow-y-auto',
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
);

const ModalFooter = ({ children, className }) => (
  <div className={cn('mt-6 flex justify-end gap-3', className)}>{children}</div>
);

export { Modal, ModalContent, ModalFooter };
