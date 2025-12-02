// ============================================================================
// FILE: src/components/common/PasswordRequirements.tsx
// ============================================================================

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface PasswordRequirementsProps {
  password: string;
  requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  requirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
}) => {
  // Provide default values for all requirements
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = requirements;

  const checks = [
    {
      label: `At least ${minLength} characters`,
      met: password.length >= minLength,
    },
    {
      label: 'Contains uppercase letter',
      met: requireUppercase ? /[A-Z]/.test(password) : true,
    },
    {
      label: 'Contains lowercase letter',
      met: requireLowercase ? /[a-z]/.test(password) : true,
    },
    {
      label: 'Contains number',
      met: requireNumbers ? /[0-9]/.test(password) : true,
    },
    {
      label: 'Contains special character',
      met: requireSpecialChars ? /[^A-Za-z0-9]/.test(password) : true,
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        Password must meet the following requirements:
      </Typography>
      <List dense sx={{ py: 0 }}>
        {checks.map((check, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {check.met ? (
                <CheckCircleIcon fontSize="small" color="success" />
              ) : (
                <CancelIcon fontSize="small" color="error" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="caption"
                  color={check.met ? 'success.main' : 'text.secondary'}
                >
                  {check.label}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PasswordRequirements;