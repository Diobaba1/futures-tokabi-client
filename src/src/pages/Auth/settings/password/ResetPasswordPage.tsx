// ============================================================================
// FILE: src/pages/auth/ResetPasswordPage.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockReset as LockResetIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Check,
  Close,
  Lock,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { passwordService } from "../../../../api/services/PasswordService";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const theme = useTheme();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate("/login");
    }
  }, [success, countdown, navigate]);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Reset token is missing");
        setIsValidating(false);
        return;
      }

      try {
        const response = await passwordService.validateResetToken(token);
        if (response.success && response.data?.valid) {
          setTokenValid(true);
          if (response.data.expires_at) {
            passwordService.storeResetToken(token, response.data.expires_at);
          }
        } else {
          setTokenValid(false);
          setError("This reset link is invalid or has expired");
        }
      } catch {
        setTokenValid(false);
        setError("Failed to validate reset link");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const strength = passwordService.analyzePasswordStrength(password);
    if (!strength.meetsRequirements) {
      setError("Password does not meet security requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await passwordService.resetPassword({
        token,
        new_password: password,
        confirm_password: confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        passwordService.clearStoredResetToken();
      } else {
        throw new Error(response.error?.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = passwordService.generateSecurePassword(12);
    setPassword(newPassword);
    setConfirmPassword(newPassword);
  };

  const strength = password
    ? passwordService.analyzePasswordStrength(password)
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

  if (isValidating) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress sx={{ color: "cyan.main" }} />
        </Box>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              maxWidth: 400,
            }}
          >
            <ErrorIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
            <Typography
              variant="h5"
              gutterBottom
              color="text.primary"
              fontWeight={500}
            >
              Invalid Reset Link
            </Typography>
            <Typography color="text.secondary" paragraph sx={{ mb: 3 }}>
              {error || "This password reset link is invalid or has expired"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/forgot-password")}
              sx={{
                mr: 2,
                bgcolor: "cyan.main",
                color: "black",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "cyan.dark",
                },
              }}
            >
              Request New Link
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "divider",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "cyan.main",
                  color: "cyan.main",
                  bgcolor: "rgba(0, 229, 255, 0.08)",
                },
              }}
            >
              Back to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              maxWidth: 400,
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 60, color: "success.main", mb: 2 }}
            />
            <Typography
              variant="h5"
              gutterBottom
              color="text.primary"
              fontWeight={500}
            >
              Password Reset Successful!
            </Typography>
            <Typography color="text.secondary" paragraph sx={{ mb: 2 }}>
              Redirecting to login in {countdown} seconds...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(5 - countdown) * 20}
              sx={{
                mb: 3,
                height: 4,
                borderRadius: 2,
                bgcolor: "action.disabledBackground",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "cyan.main",
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "cyan.main",
                color: "black",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "cyan.dark",
                },
              }}
            >
              Go to Login Now
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          bgcolor: "background.default",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ width: "100%" }}
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
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <LockResetIcon
                sx={{
                  fontSize: 60,
                  color: "cyan.main",
                  mb: 2,
                  filter: "drop-shadow(0 0 8px rgba(0, 229, 255, 0.3))",
                }}
              />
              <Typography
                variant="h4"
                gutterBottom
                fontWeight={600}
                color="text.primary"
              >
                Create New Password
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your new password below
              </Typography>
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert
                    severity="error"
                    icon={<ErrorIcon />}
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

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {password && strength && (
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
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                margin="normal"
                variant="outlined"
                error={!!confirmPassword && password !== confirmPassword}
                helperText={
                  !!confirmPassword && password !== confirmPassword
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
                size="small"
                onClick={handleGeneratePassword}
                startIcon={<RefreshIcon />}
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

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={
                  isLoading ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword
                }
                sx={{
                  py: 1.5,
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
                  "Reset Password"
                )}
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
