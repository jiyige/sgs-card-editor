import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'form-input--sm' : '';
  return (
    <input
      type="text"
      className={`form-input ${sizeClass} ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
};

export default Input;
