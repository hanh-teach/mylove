import React, { useRef, useEffect } from 'react';

interface LoveNoteTitleProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const LoveNoteTitle: React.FC<LoveNoteTitleProps> = ({
  value,
  onChange,
  placeholder = 'Nhập tiêu đề...',
  maxLength = 120,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !value) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full relative flex flex-col gap-1 mb-4">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full text-2xl sm:text-3xl font-bold font-serif text-rose-950 placeholder:text-rose-300 bg-transparent border-b border-rose-200/80 pb-2 focus:outline-none focus:border-rose-500 transition-colors"
      />
      <div className="flex justify-between items-center text-[11px] text-rose-400 font-medium px-0.5">
        <span>Tiêu đề bức thư</span>
        <span>{value.length}/{maxLength}</span>
      </div>
    </div>
  );
};
