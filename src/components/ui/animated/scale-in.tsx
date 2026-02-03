'use client';

import { DEFAULT_TRANSITION } from '@/constants/animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion, HTMLMotionProps } from 'framer-motion';

type ScaleInProps = HTMLMotionProps<'div'> & {
  delay?: number;
  initialScale?: number;
};

export const ScaleIn = ({ children, delay = 0, initialScale = 0.9, ...props }: ScaleInProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DEFAULT_TRANSITION.duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: DEFAULT_TRANSITION.ease
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
