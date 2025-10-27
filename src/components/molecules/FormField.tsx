import React from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  error?: string;
  required?: boolean;
}

export const FormField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  name,
  error,
  required = false
}: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>
      <Input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

