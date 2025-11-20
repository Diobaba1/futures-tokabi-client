// components/forms/FormInput/FormInput.tsx
import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import Input from '../../ui/Input';

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  error?: FieldError;
  register: UseFormRegister<any>;
  name: string;
  required?: boolean;
  endAdornment?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  placeholder,
  autoComplete,
  className,
  error,
  register,
  name,
  required = false,
  endAdornment,
}) => {
  return (
    <Input
      label={label}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={className}
      error={error?.message}
      rightIcon={endAdornment}
      {...register(name, { required })}
    />
  );
};

export default FormInput;