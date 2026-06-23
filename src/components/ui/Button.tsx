import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon = false,
  disabled = false,
  children,
  onClick,
  className = '',
  title,
  type = 'button',
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    icon ? 'btn--icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      title={title}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
