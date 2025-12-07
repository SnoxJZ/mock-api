'use client';

import { DOMMotionComponents, motion } from 'motion/react';

const ViewInAnimate = ({
  children,
  delay = 0,
  className,
  tag = 'div',
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  tag?: keyof DOMMotionComponents;
  once?: boolean;
}) => {
  const MotionComponent = motion[tag];

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once, amount: 0.3 }}
    >
      {children}
    </MotionComponent>
  );
};

export default ViewInAnimate;
