import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
  return (
    <motion.div
      className={`animate-pulse bg-[var(--muted)] rounded-lg ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />
  );
};

export { Skeleton };
