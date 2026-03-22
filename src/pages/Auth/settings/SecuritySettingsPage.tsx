import React, { useState } from "react";
import {
  Shield, Lock, KeyRound, Fingerprint, Mail, Monitor,
  History, Trash2, RefreshCw, Info, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-gray-600'}`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}

const SecuritySettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const securityLogs = [
    { id: 1, action: "Password changed", device: "Chrome on Windows", location: "New York, US", time: "2 hours ago" },
    { id: 2, action: "Successful login", device: "Safari on iPhone", location: "Los Angeles, US", time: "1 day ago" },
    { id: 3, action: "Failed login attempt", device: "Firefox on Mac", location: "London, UK", time: "3 days ago" },
    { id: 4, action: "API key created", device: "Chrome on Windows", location: "New York, US", time: "1 week ago" },
  ];

  const activeSessions = [
    { id: 1, device: "Chrome on Windows", location: "New York, US", lastActive: "Currently active" },
    { id: 2, device: "Safari on iPhone", location: "Los Angeles, US", lastActive: "2 hours ago" },
  ];

  const securityScore = twoFactorEnabled ? 100 : 85;
  const scoreColor = securityScore >= 90 ? 'bg-emerald-500' : securityScore >= 70 ? 'bg-cyan-500' : 'bg-amber-500';
  const scoreLabel = securityScore >= 90 ? 'Excellent' : securityScore >= 70 ? 'Very Strong' : 'Needs Improvement';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            Security Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your account security and privacy settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column — Security Options */}
          <div className="flex-1 space-y-6">

            {/* Account Security */}
            <div className="bg-dark-elevated border border-dark-border rounded-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Account Security</h2>
              </div>

              <div className="space-y-4">
                {/* Password */}
                <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">Password</p>
                      <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard/settings/change-password")}
                    className="flex items-center gap-2 px-4 py-2 rounded-btn bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-colors"
                  >
                    <RefreshCw size={14} />
                    Change Password
                  </button>
                </div>

                {/* Two-Factor */}
                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <button
                        role="switch"
                        aria-checked={twoFactorEnabled}
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-600'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                      <span className="text-xs text-gray-400">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>
                  {twoFactorEnabled && (
                    <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
                      <Info size={14} className="shrink-0" />
                      Two-factor authentication is active. Use your authenticator app when logging in.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-dark-elevated border border-dark-border rounded-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
              </div>
              <div className="space-y-1">
                <Toggle checked={emailNotifications} onChange={setEmailNotifications} label="Email Notifications" />
                <Toggle checked={smsNotifications} onChange={setSmsNotifications} label="SMS Notifications" />
                <Toggle checked={loginAlerts} onChange={setLoginAlerts} label="Login Alerts" />
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-dark-elevated border border-dark-border rounded-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Active Sessions</h2>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-btn border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors">
                  Log Out All Devices
                </button>
              </div>

              <div className="divide-y divide-dark-border">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-white">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.location} &middot; {session.lastActive}</p>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Status & Logs */}
          <div className="w-full lg:w-80 lg:min-w-[320px] space-y-6">

            {/* Security Score */}
            <div className="bg-dark-elevated border border-dark-border rounded-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Security Status</h2>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Account Security Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-dark-surface rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${scoreColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${securityScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{securityScore}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{scoreLabel}</p>
              </div>

              <div className="border-t border-dark-border pt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <div>
                    <p className="text-xs text-white">Strong Password</p>
                    <p className="text-[10px] text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactorEnabled
                    ? <CheckCircle2 size={14} className="text-emerald-400" />
                    : <AlertTriangle size={14} className="text-amber-400" />
                  }
                  <div>
                    <p className="text-xs text-white">Two-Factor Auth</p>
                    <p className="text-[10px] text-gray-500">{twoFactorEnabled ? 'Enabled' : 'Not enabled'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <div>
                    <p className="text-xs text-white">Email Verified</p>
                    <p className="text-[10px] text-gray-500">Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-dark-elevated border border-dark-border rounded-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              </div>

              <div className="divide-y divide-dark-border">
                {securityLogs.map((log) => (
                  <div key={log.id} className="py-2.5">
                    <p className="text-sm text-white">{log.action}</p>
                    <p className="text-[10px] text-gray-500">{log.device} &middot; {log.location} &middot; {log.time}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/dashboard/security-logs")}
                className="w-full mt-3 text-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-2"
              >
                View All Activity
              </button>
            </div>

            {/* Security Tips */}
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-card p-5">
              <p className="text-sm font-semibold text-cyan-400 flex items-center gap-1.5 mb-3">
                <Lock size={14} />
                Security Tips
              </p>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>&bull; Use a unique, strong password</li>
                <li>&bull; Enable two-factor authentication</li>
                <li>&bull; Review active sessions regularly</li>
                <li>&bull; Use a password manager</li>
                <li>&bull; Be cautious of phishing emails</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettingsPage;
