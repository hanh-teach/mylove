import React, { useState, useEffect, useRef } from 'react';

interface ContextMenuProps {
  items: { label: string; action: () => void }[];
  children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => setIsOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} onContextMenu={handleContextMenu} className="inline-block w-full">
      {children}
      {isOpen && (
        <div className="fixed bg-white shadow-xl border border-slate-200 rounded-xl p-1 z-[100]" style={{ top: position.y, left: position.x }}>
          {items.map((item, i) => (
            <button key={i} onClick={item.action} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">{item.label}</button>
          ))}
        </div>
      )}
    </div>
  );
};
