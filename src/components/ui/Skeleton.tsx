import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-slate-200 ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
    <Skeleton height="120px" className="w-full rounded-2xl" />
    <div className="space-y-2">
      <Skeleton height="20px" width="70%" />
      <Skeleton height="14px" width="90%" />
      <Skeleton height="14px" width="40%" />
    </div>
    <div className="pt-2 border-t border-slate-50 flex justify-between">
      <Skeleton height="12px" width="30%" />
      <Skeleton height="12px" width="20%" />
    </div>
  </div>
);
