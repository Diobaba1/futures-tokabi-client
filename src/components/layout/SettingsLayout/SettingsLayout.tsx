// src/components/layout/SettingsLayout.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(segment => segment);
  const currentPage = pathSegments[pathSegments.length - 1] || 'settings';

  const getPageTitle = (page: string): string => {
    const titles: Record<string, string> = {
      'change-password': 'Change Password',
      'profile': 'Profile Settings',
      'security': 'Security Settings',
      'notifications': 'Notification Settings',
      'billing': 'Billing Settings',
      'privacy': 'Privacy Settings',
    };
    return titles[page] || page.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs 
            separator={<ChevronRightIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
              Dashboard
            </Link>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate('/dashboard/settings')}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <SettingsIcon sx={{ mr: 0.5 }} fontSize="small" />
              Settings
            </Link>
            <Typography color="text.primary">
              {getPageTitle(currentPage)}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SettingsIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {getPageTitle(currentPage)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your account settings and preferences
              </Typography>
            </Box>
          </Box>
        </Box>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
          }}
        >
          {children}
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default SettingsLayout;