'use client';

import { DEFAULT_TRANSITION } from '@/constants/animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion, HTMLMotionProps } from 'framer-motion';

type SlideUpProps = HTMLMotionProps<'div'> & {
  delay?: number;
  distance?: number;
};

export const SlideUp = ({ children, delay = 0, distance = 20, ...props }: SlideUpProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
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
