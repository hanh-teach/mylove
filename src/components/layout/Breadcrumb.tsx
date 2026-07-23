import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-xs text-slate-500 font-medium h-8 px-3">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <button 
            onClick={item.onClick}
            className="hover:text-slate-800 transition-colors"
          >
            {item.label}
          </button>
          {index < items.length - 1 && (
            <ChevronRight size={14} className="mx-1 opacity-50" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
