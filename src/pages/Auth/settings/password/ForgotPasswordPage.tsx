// ============================================================================
// FILE: src/pages/auth/ForgotPasswordPage.tsx
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
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import {
  LockReset as LockResetIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { passwordService } from "../../../../api/services/PasswordService";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!passwordService.validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const rateLimitStatus =
        passwordService.getRateLimitStatus("forgotPassword");
      if (rateLimitStatus.limited) {
        throw new Error(
          `Too many attempts. Please try again in ${rateLimitStatus.remainingTime} seconds.`
        );
      }

      const response = await passwordService.forgotPassword({ email });

      if (response.success) {
        setSuccess(true);
        passwordService.clearRateLimit("forgotPassword");
      } else {
        throw new Error(
          response.error?.message || "Failed to send reset email"
        );
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 3 : 4,
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
                component="h1"
                gutterBottom
                fontWeight={600}
                color="text.primary"
              >
                Reset Your Password
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {success
                  ? "Check your email for reset instructions"
                  : "Enter your email to receive a password reset link"}
              </Typography>
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert
                    severity="success"
                    icon={<CheckCircleIcon />}
                    sx={{
                      mb: 3,
                      bgcolor: "success.dark",
                      color: "success.contrastText",
                      "& .MuiAlert-icon": { color: "success.light" },
                    }}
                  >
                    Password reset link sent! Please check your email.
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {!success ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  disabled={isLoading}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      bgcolor: "action.selected",
                      "&:hover": { bgcolor: "action.hover" },
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || !email}
                  sx={{
                    mt: 3,
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
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            ) : (
              <Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    mb: 2,
                    bgcolor: "cyan.main",
                    color: "black",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "cyan.dark",
                    },
                  }}
                >
                  Back to Login
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setSuccess(false)}
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
                  Resend Email
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/login")}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "cyan.main",
                    bgcolor: "rgba(0, 229, 255, 0.08)",
                  },
                }}
              >
                Back to Sign In
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
