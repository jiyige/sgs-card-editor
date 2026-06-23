import React from 'react';

interface AccordionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
  id,
  title,
  icon,
  expanded,
  onToggle,
  children,
}) => {
  return (
    <div className={`accordion ${expanded ? 'accordion--expanded' : ''}`}>
      <div className="accordion__header" onClick={onToggle}>
        <span className="accordion__title">
          {icon && <span className="accordion__title-icon">{icon}</span>}
          {title}
        </span>
        <span className="accordion__icon">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M6 8L1 3h10z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
      <div
        className={`accordion__content ${expanded ? 'accordion__content--expanded' : 'accordion__content--collapsed'}`}
      >
        <div className="accordion__body">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
