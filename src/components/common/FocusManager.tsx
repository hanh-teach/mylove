import React, { useEffect, useRef } from 'react';

export const FocusManager: React.FC<{ children: React.ReactNode; isActive: boolean }> = ({ children, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isActive]);

  return <div ref={containerRef} className="focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg">{children}</div>;
};
