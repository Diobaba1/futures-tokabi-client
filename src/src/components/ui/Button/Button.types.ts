import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The content of the button
   */
  children: ReactNode;
  
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * The type of the button
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
}

export interface ButtonGroupProps {
  /**
   * The buttons to render in the group
   */
  children: ReactNode;
  
  /**
   * The alignment of the buttons
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Whether the buttons should be full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}