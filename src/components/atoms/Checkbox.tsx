import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
}

export const Checkbox = ({ 
  checked, 
  onChange,
  className = '',
  id,
  name
}: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      id={id}
      name={name}
      className={`appearance-none w-5 h-5 border-2 border-white/30 rounded bg-white/5 transition-all duration-200 cursor-pointer flex-shrink-0 checked:bg-teal-400 checked:border-teal-400 relative ${className}`}
      style={{
        backgroundImage: checked ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%230d2333' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")" : 'none',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
};


