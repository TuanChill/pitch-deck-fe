'use client';

import { ANIMATION_STAGGER, DEFAULT_TRANSITION } from '@/constants/animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

type StaggerChildrenProps = HTMLMotionProps<'div'> & {
  staggerDelay?: number;
  childClassName?: string;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: DEFAULT_TRANSITION
  }
};

export const StaggerChildren = ({
  children,
  staggerDelay = ANIMATION_STAGGER.normal,
  childClassName,
  className,
  ...props
}: StaggerChildrenProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children as React.ReactNode}</div>;
  }

  const childrenAsArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {childrenAsArray.map((child, i) => (
        <motion.div key={i} variants={itemVariants} className={childClassName}>
          {child as React.ReactNode}
        </motion.div>
      ))}
    </motion.div>
  );
};
