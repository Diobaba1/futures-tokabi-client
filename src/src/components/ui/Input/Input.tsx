import React from 'react';
import { InputProps } from './Input.types';

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName = '',
  className = '',
  leftIcon,
  rightIcon,
  helperText,
  fullWidth = true,
  required = false,
  ...props
}) => {
  const hasIcons = leftIcon || rightIcon;

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            ${fullWidth ? 'w-full' : 'w-auto'}
            px-3 py-2 border rounded-lg shadow-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
            ${error 
              ? 'border-red-500 bg-red-500/10 text-red-300' 
              : 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
            }
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;