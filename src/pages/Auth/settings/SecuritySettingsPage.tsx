import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Password as PasswordIcon,
  Fingerprint as FingerprintIcon,
  Email as EmailIcon,
  Devices as DevicesIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SecuritySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  //   const theme = useTheme();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const securityLogs = [
    {
      id: 1,
      action: "Password changed",
      device: "Chrome on Windows",
      location: "New York, US",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Successful login",
      device: "Safari on iPhone",
      location: "Los Angeles, US",
      time: "1 day ago",
    },
    {
      id: 3,
      action: "Failed login attempt",
      device: "Firefox on Mac",
      location: "London, UK",
      time: "3 days ago",
    },
    {
      id: 4,
      action: "API key created",
      device: "Chrome on Windows",
      location: "New York, US",
      time: "1 week ago",
    },
  ];

  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, US",
      lastActive: "Currently active",
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Los Angeles, US",
      lastActive: "2 hours ago",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Security Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account security and privacy settings
          </Typography>
        </Box>

        {/* Main Content Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {/* Left Column - Security Options */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Account Security Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <SecurityIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h6">Account Security</Typography>
              </Box>

              <Stack spacing={3}>
                {/* Password Card */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <PasswordIcon sx={{ mr: 2, color: "primary.main" }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Password
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last changed 30 days ago
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() =>
                          navigate("/dashboard/settings/change-password")
                        }
                        startIcon={<RefreshIcon />}
                        size={window.innerWidth < 600 ? "small" : "medium"}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication Card */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <FingerprintIcon
                          sx={{ mr: 2, color: "primary.main" }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Two-Factor Authentication
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Add an extra layer of security
                          </Typography>
                        </Box>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={twoFactorEnabled}
                            onChange={(e) =>
                              setTwoFactorEnabled(e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={twoFactorEnabled ? "Enabled" : "Disabled"}
                      />
                    </Box>
                    {twoFactorEnabled && (
                      <Alert
                        severity="info"
                        sx={{
                          mt: 2,
                          borderRadius: 1,
                        }}
                      >
                        Two-factor authentication is active. Use your
                        authenticator app when logging in.
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Paper>

            {/* Notification Settings */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <EmailIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h6">Notification Preferences</Typography>
              </Box>

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                  sx={{ py: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                  sx={{ py: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={loginAlerts}
                      onChange={(e) => setLoginAlerts(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Login Alerts"
                  sx={{ py: 0.5 }}
                />
              </Stack>
            </Paper>

            {/* Active Sessions */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  mb: 3,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DevicesIcon sx={{ mr: 2, color: "primary.main" }} />
                  <Typography variant="h6">Active Sessions</Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size={window.innerWidth < 600 ? "small" : "medium"}
                >
                  Log Out All Devices
                </Button>
              </Box>

              <List>
                {activeSessions.map((session) => (
                  <ListItem
                    key={session.id}
                    divider
                    sx={{
                      py: 2,
                    }}
                  >
                    <ListItemIcon>
                      <DevicesIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={session.device}
                      secondary={`${session.location} • ${session.lastActive}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* Right Column - Security Status & Logs */}
          <Box
            sx={{
              width: { xs: "100%", md: "320px" },
              minWidth: { md: "320px" },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Security Status */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <ShieldIcon sx={{ mr: 2, color: "success.main" }} />
                <Typography variant="h6">Security Status</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Account Security Score
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: 8,
                      bgcolor: "grey.200",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: "85%",
                        height: "100%",
                        bgcolor: "success.main",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                  <Typography variant="body1" fontWeight="bold" sx={{ ml: 2 }}>
                    85%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Very Strong
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PasswordIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Strong Password"
                    secondary="Last changed 30 days ago"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {twoFactorEnabled ? (
                      <FingerprintIcon color="success" fontSize="small" />
                    ) : (
                      <FingerprintIcon color="warning" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Auth"
                    secondary={twoFactorEnabled ? "Enabled" : "Not enabled"}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EmailIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Email Verified" secondary="Verified" />
                </ListItem>
              </List>
            </Paper>

            {/* Security Logs */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <HistoryIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h6">Recent Activity</Typography>
              </Box>

              <Box sx={{ flex: 1, overflow: "auto" }}>
                <List dense>
                  {securityLogs.map((log) => (
                    <ListItem
                      key={log.id}
                      divider
                      sx={{
                        py: 1.5,
                      }}
                    >
                      <ListItemText
                        primary={log.action}
                        secondary={`${log.device} • ${log.location} • ${log.time}`}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => navigate("/dashboard/security-logs")}
                size="small"
              >
                View All Activity
              </Button>
            </Paper>

            {/* Security Tips */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "info.50",
                border: "1px solid",
                borderColor: "info.200",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                gutterBottom
                color="info.main"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LockIcon fontSize="small" />
                Security Tips
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  • Use a unique, strong password
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Enable two-factor authentication
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Review active sessions regularly
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Use a password manager
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Be cautious of phishing emails
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default SecuritySettingsPage;
