// src/components/Layout/Authlayout/DashboardMenu.tsx
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Bell,
  CreditCard,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Activity,
  Zap,
  Shield,
  Radio,
  UserPlus,
  Receipt,
  History,
  FileText,
  Link2,
  Wallet,
  BarChart3,
  Sparkles,
  Crown,
  Gift,
  User,
  Lock,
} from "lucide-react";

interface DashboardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  badgeGlow?: boolean;
  requireStaff?: boolean;
  requireAdmin?: boolean;
  description?: string;
}

interface MenuSection {
  title: string;
  icon?: React.ReactNode;
  items: MenuItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isStaff = user?.is_staff || user?.is_admin;
  const isAdmin = user?.is_admin;

  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Main", "Signals", "Account"])
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Menu sections with items - REDESIGNED with better organization
  const menuSections: MenuSection[] = [
    {
      title: "Main",
      icon: <LayoutDashboard size={16} />,
      collapsible: false,
      defaultOpen: true,
      items: [
        {
          path: "/dashboard",
          label: "Overview",
          icon: <BarChart3 size={20} />,
          description: "Dashboard overview",
        },
        {
          path: "/dashboard/trading",
          label: "Live Trading",
          icon: <TrendingUp size={20} />,
          badge: "Active",
          badgeColor: "bg-emerald-500",
          badgeGlow: true,
        },
        {
          path: "/dashboard/trading-config",
          label: "Trade Settings",
          icon: <Settings size={20} />,
        },
        {
          path: "/dashboard/symbol-analysis",
          label: "Market Analysis",
          icon: <Activity size={20} />,
        },
      ],
    },
    {
      title: "Signals",
      icon: <Zap size={16} />,
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          path: "/dashboard/signals",
          label: "AI Signals",
          icon: <Sparkles size={20} />,
          badge: "AI",
          badgeColor: "bg-violet-500",
        },
        {
          path: "/dashboard/professional-signals",
          label: "Pro Signals",
          icon: <Radio size={20} />,
          badge: "Live",
          badgeColor: "bg-emerald-500",
          badgeGlow: true,
        },
        {
          path: "/dashboard/staff-signals",
          label: "Manage Signals",
          icon: <Shield size={20} />,
          badge: "Staff",
          badgeColor: "bg-amber-500",
          requireStaff: true,
        },
      ],
    },
    {
      title: "Account",
      icon: <User size={16} />,
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          path: "/dashboard/api-key",
          label: "Connect Exchange",
          icon: <Link2 size={20} />,
          description: "Binance, Bybit",
        },
        {
          path: "/dashboard/notifications",
          label: "Notifications",
          icon: <Bell size={20} />,
        },
      ],
    },
    {
      title: "Billing",
      icon: <Wallet size={16} />,
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          path: "/dashboard/billing",
          label: "Overview",
          icon: <CreditCard size={20} />,
        },
        {
          path: "/dashboard/billing/subscription",
          label: "Subscription",
          icon: <Receipt size={20} />,
        },
        {
          path: "/dashboard/billing/payments",
          label: "Payments",
          icon: <History size={20} />,
        },
        {
          path: "/dashboard/billing/invoices",
          label: "Invoices",
          icon: <FileText size={20} />,
        },
      ],
    },
    {
      title: "Referrals",
      icon: <Gift size={16} />,
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          path: "/dashboard/affiliate-dashboard",
          label: "Affiliate Program",
          icon: <Users size={20} />,
        },
        {
          path: "/dashboard/referals",
          label: "My Referrals",
          icon: <UserPlus size={20} />,
        },
      ],
    },
    {
      title: "Settings",
      icon: <Settings size={16} />,
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          path: "/dashboard/settings",
          label: "Profile",
          icon: <User size={20} />,
        },
        {
          path: "/dashboard/settings/security",
          label: "Security",
          icon: <Lock size={20} />,
        },
      ],
    },
  ];

  // Filter menu items based on user permissions
  const filterMenuItem = (item: MenuItem): boolean => {
    if (item.requireAdmin && !isAdmin) return false;
    if (item.requireStaff && !isStaff) return false;
    return true;
  };

  // Check if current path is within a section
  const isSectionActive = (section: MenuSection): boolean => {
    return section.items.some((item) => location.pathname === item.path);
  };

  const renderMenuItem = (item: MenuItem) => (
    <NavLink
      key={item.path}
      to={item.path}
      end={item.path === "/dashboard/billing" || item.path === "/dashboard"}
      onClick={() => onClose()}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
          isActive
            ? "text-white"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator background */}
          {isActive && (
            <motion.div
              layoutId="activeMenuItem"
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-cyan-400/15 to-transparent border-l-2 border-cyan-400 rounded-xl"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}

          {/* Icon with glow effect when active */}
          <span
            className={`relative flex-shrink-0 transition-all duration-300 ${
              isActive
                ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                : "text-gray-500 group-hover:text-cyan-400"
            }`}
          >
            {item.icon}
          </span>

          {!isCollapsed && (
            <>
              <div className="relative flex-1 min-w-0">
                <span className={`text-sm font-medium ${isActive ? "text-white" : ""}`}>
                  {item.label}
                </span>
                {item.description && !isActive && (
                  <p className="text-[10px] text-gray-600 truncate">{item.description}</p>
                )}
              </div>

              {item.badge && (
                <span
                  className={`relative text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor} ${
                    item.badgeGlow ? "shadow-lg shadow-current/50 animate-pulse" : ""
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}

          {/* Collapsed mode tooltip */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border border-cyan-500/20">
              {item.label}
              {item.badge && (
                <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );

  // Render collapsible section header
  const renderSectionHeader = (section: MenuSection) => {
    const isExpanded = expandedSections.has(section.title);
    const hasActiveItem = isSectionActive(section);

    if (!section.collapsible || isCollapsed) {
      return (
        <h3 className={`text-[10px] font-semibold uppercase tracking-wider px-3 mb-2 flex items-center gap-2 ${
          hasActiveItem ? "text-cyan-400" : "text-gray-600"
        }`}>
          {section.icon}
          {!isCollapsed && section.title}
        </h3>
      );
    }

    return (
      <button
        onClick={() => toggleSection(section.title)}
        className={`w-full text-[10px] font-semibold uppercase tracking-wider px-3 mb-2 flex items-center justify-between gap-2 hover:text-gray-400 transition-colors ${
          hasActiveItem ? "text-cyan-400" : "text-gray-600"
        }`}
      >
        <span className="flex items-center gap-2">
          {section.icon}
          {section.title}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={12} />
        </motion.span>
      </button>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Header - Enhanced with glassmorphism */}
      <div className="relative flex items-center justify-between p-4 border-b border-white/5">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />

        {!isCollapsed ? (
          <motion.div
            className="relative flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-30 animate-pulse" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Zap size={20} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                TOKABI
              </h1>
              <p className="text-[10px] text-cyan-400/60 font-medium tracking-wider">
                AI-POWERED TRADING
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="relative mx-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-30" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap size={20} className="text-white" />
            </div>
          </motion.div>
        )}
      </div>

      {/* User Info - Enhanced with better hierarchy */}
      {!isCollapsed && (
        <motion.div
          className="px-4 py-4 border-b border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar with status indicator */}
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                <span className="text-white font-semibold text-base">
                  {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              {/* Online status */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-lg shadow-emerald-500/50" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.full_name || "User"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-gray-500 truncate">
                  {user?.email}
                </span>
              </div>
            </div>

            {/* Role badge */}
            {isStaff && (
              <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                {isAdmin ? "ADMIN" : "STAFF"}
              </span>
            )}
          </div>

          {/* Subscription Status - Enhanced CTA */}
          <motion.div
            className="mt-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {user?.is_subscribed ? (
              <div className="relative overflow-hidden px-3 py-2.5 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-xl border border-purple-500/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
                <div className="relative flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Crown size={14} className="text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">Pro Member</span>
                    <p className="text-[10px] text-purple-400/80">All features unlocked</p>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                to="/pricing"
                className="group relative flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap size={14} className="text-white" />
                </div>
                <div className="relative">
                  <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    Upgrade to Pro
                  </span>
                  <p className="text-[10px] text-gray-500">Unlock all features</p>
                </div>
                <ChevronRight size={14} className="text-cyan-500/50 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Collapsed mode user avatar */}
      {isCollapsed && (
        <div className="px-3 py-4 border-b border-white/5 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center border border-white/10">
              <span className="text-white font-semibold text-sm">
                {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900" />
          </div>
        </div>
      )}

      {/* Navigation - Enhanced with collapsible sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {menuSections.map((section) => {
          const filteredItems = section.items.filter(filterMenuItem);
          if (filteredItems.length === 0) return null;

          const isExpanded = expandedSections.has(section.title) || !section.collapsible;

          return (
            <div key={section.title} className="space-y-1">
              {renderSectionHeader(section)}

              <AnimatePresence initial={false}>
                {(isExpanded || isCollapsed) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 overflow-hidden"
                  >
                    {filteredItems.map(renderMenuItem)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Upgrade CTA (collapsed mode) */}
      {isCollapsed && !user?.is_subscribed && (
        <div className="px-3 py-4 border-t border-white/5">
          <NavLink
            to="/pricing"
            className="group relative w-full flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 hover:border-cyan-400/40 transition-all overflow-hidden"
            title="Upgrade to Pro"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <Zap size={18} className="relative text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all" />
          </NavLink>
        </div>
      )}

      {/* Logout Button - Enhanced */}
      <div className="p-4 border-t border-white/5">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Enhanced with glassmorphism */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30"
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-cyan-500/20" />

        {/* Content */}
        <div className="relative flex flex-col h-full">
          {sidebarContent}
        </div>

        {/* Collapse Toggle - Enhanced */}
        <motion.button
          onClick={onToggleCollapse}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 shadow-xl shadow-black/50"
        >
          <motion.span
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight size={14} />
          </motion.span>
        </motion.button>
      </motion.aside>

      {/* Mobile Overlay - Enhanced */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar - Enhanced */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 w-[300px] h-screen z-50"
          >
            {/* Background layers */}
            <div className="absolute inset-0 bg-gray-950/98 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-cyan-500/20" />

            {/* Shadow */}
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-black/20 translate-x-full pointer-events-none" />

            {/* Content */}
            <div className="relative flex flex-col h-full">
              {/* Close Button - Enhanced */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10 border border-white/5"
              >
                <X size={18} />
              </motion.button>

              {sidebarContent}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardMenu;