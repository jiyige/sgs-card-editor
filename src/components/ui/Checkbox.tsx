import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <label className="form-checkbox">
      <div
        className={`form-checkbox__box ${checked ? 'form-checkbox__box--checked' : ''}`}
        onClick={() => onChange(!checked)}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
