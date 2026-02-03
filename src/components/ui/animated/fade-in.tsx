'use client';

import { DEFAULT_TRANSITION } from '@/constants/animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion, HTMLMotionProps } from 'framer-motion';

type FadeInProps = HTMLMotionProps<'div'> & {
  delay?: number;
  duration?: number;
};

export const FadeIn = ({
  children,
  delay = 0,
  duration = DEFAULT_TRANSITION.duration,
  ...props
}: FadeInProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
