// ============================================================================
// FILE: src/pages/settings/ChangePasswordPage.tsx
// ============================================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Refresh,
  CheckCircle,
  Security,
  Lock,
  Warning,
  Check,
  Close,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { passwordService } from "../../../../api/services/PasswordService";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const strength = passwordService.analyzePasswordStrength(newPassword);
    if (!strength.meetsRequirements) {
      setError("New password does not meet security requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await passwordService.changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(response.error?.message || "Failed to change password");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPass = passwordService.generateSecurePassword(12);
    setNewPassword(newPass);
    setConfirmPassword(newPass);
  };

  const strength = newPassword
    ? passwordService.analyzePasswordStrength(newPassword)
    : null;

  const getStrengthColor = (score: number) => {
    if (score >= 4) return "#00e5ff"; // Cyan
    if (score >= 3) return "#00b8d4";
    if (score >= 2) return "#ff9800";
    return "#f44336";
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 4) return "Strong";
    if (score >= 3) return "Good";
    if (score >= 2) return "Fair";
    return "Weak";
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  mr: 2,
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "cyan.main",
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={600} color="text.primary">
                Change Password
              </Typography>
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert
                    severity="error"
                    icon={<Warning />}
                    sx={{
                      mb: 3,
                      bgcolor: "error.dark",
                      color: "error.contrastText",
                      "& .MuiAlert-icon": { color: "error.light" },
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    sx={{
                      mb: 3,
                      bgcolor: "success.dark",
                      color: "success.contrastText",
                      "& .MuiAlert-icon": { color: "success.light" },
                    }}
                  >
                    Password changed successfully!
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isLoading}
                margin="normal"
                variant="outlined"
                InputProps={{
                  sx: {
                    bgcolor: "action.selected",
                    "&:hover": { bgcolor: "action.hover" },
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                margin="normal"
                variant="outlined"
                InputProps={{
                  sx: {
                    bgcolor: "action.selected",
                    "&:hover": { bgcolor: "action.hover" },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {newPassword && strength && (
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Password Strength
                    </Typography>
                    <Chip
                      label={getStrengthLabel(strength.score)}
                      size="small"
                      sx={{
                        bgcolor: getStrengthColor(strength.score),
                        color: strength.score >= 4 ? "black" : "white",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                    {[1, 2, 3, 4].map((level) => (
                      <Box
                        key={level}
                        sx={{
                          flex: 1,
                          height: 4,
                          borderRadius: 1,
                          bgcolor:
                            level <= strength.score
                              ? getStrengthColor(strength.score)
                              : "action.disabledBackground",
                        }}
                      />
                    ))}
                  </Box>
                  <List dense sx={{ p: 0 }}>
                    {strength.tips.map((tip, index) => (
                      <ListItem key={index} sx={{ p: 0, mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          {tip.includes("✓") ? (
                            <Check fontSize="small" color="success" />
                          ) : (
                            <Close fontSize="small" color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={tip.replace("✓", "").replace("✗", "")}
                          primaryTypographyProps={{
                            variant: "caption",
                            color: "text.secondary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                margin="normal"
                variant="outlined"
                error={!!confirmPassword && newPassword !== confirmPassword}
                helperText={
                  !!confirmPassword && newPassword !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                InputProps={{
                  sx: {
                    bgcolor: "action.selected",
                    "&:hover": { bgcolor: "action.hover" },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Button
                variant="outlined"
                onClick={handleGeneratePassword}
                startIcon={<Refresh />}
                sx={{
                  mt: 3,
                  mb: 4,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "cyan.main",
                    color: "cyan.main",
                    bgcolor: "rgba(0, 229, 255, 0.08)",
                  },
                }}
              >
                Generate Secure Password
              </Button>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={
                    isLoading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  sx={{
                    flex: 1,
                    bgcolor: "cyan.main",
                    color: "black",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "cyan.dark",
                    },
                    "&:disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(-1)}
                  sx={{
                    flex: 1,
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": {
                      borderColor: "divider",
                      bgcolor: "action.hover",
                      color: "text.primary",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Security sx={{ mr: 1.5, color: "cyan.main" }} />
              <Typography variant="h6" color="text.primary" fontWeight={500}>
                Security Guidelines
              </Typography>
            </Box>
            <List dense>
              {[
                { icon: "✓", text: "Minimum 12 characters in length" },
                { icon: "✓", text: "Mix of uppercase and lowercase letters" },
                { icon: "✓", text: "Include numbers and special characters" },
                { icon: "✓", text: "Avoid dictionary words and personal info" },
                { icon: "✓", text: "Do not reuse previous passwords" },
                { icon: "✓", text: "Consider using a password manager" },
              ].map((item, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Check fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                      sx: { fontSize: "0.875rem" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ChangePasswordPage;
