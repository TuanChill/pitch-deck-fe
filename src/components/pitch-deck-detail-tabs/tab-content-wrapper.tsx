/**
 * Tab Content Wrapper
 * Animated wrapper for tab content with loading state support
 */

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface TabContentWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function TabContentWrapper({ children, isLoading, className }: TabContentWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn('py-4', className)}
    >
      {children}
    </motion.div>
  );
}
