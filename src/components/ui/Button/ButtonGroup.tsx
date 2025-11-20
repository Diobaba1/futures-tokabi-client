import React from 'react';
import { ButtonGroupProps } from './Button.types';

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  align = 'left',
  fullWidth = false,
  className = '',
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={`
        flex gap-2
        ${alignmentClasses[align]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ButtonGroup;