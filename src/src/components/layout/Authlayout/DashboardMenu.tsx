// src/components/Layout/Authlayout/DashboardMenu.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Settings,
  Bell,
  CreditCard,
  Key,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Radio,
  UserPlus,
  Receipt,
  History,
  FileText,
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
  requireStaff?: boolean;
  requireAdmin?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({
  isOpen,
  onClose,
  onOpen,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isStaff = user?.is_staff || user?.is_admin;
  const isAdmin = user?.is_admin;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Menu sections with items
  const menuSections: MenuSection[] = [
    {
      title: "Main",
      items: [
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={20} />,
        },
        {
          path: "/dashboard/trading",
          label: "Trading",
          icon: <TrendingUp size={20} />,
        },
        {
          path: "/dashboard/symbol-analysis",
          label: "Analysis",
          icon: <Activity size={20} />,
        },
      ],
    },
    {
      title: "Signals",
      items: [
        {
          path: "/dashboard/signals",
          label: "AI Signals",
          icon: <Zap size={20} />,
        },
        {
          path: "/dashboard/professional-signals",
          label: "Professional Signals",
          icon: <Radio size={20} />,
          badge: "Live",
          badgeColor: "bg-green-500",
        },
        // Staff-only menu item
        {
          path: "/dashboard/staff-signals",
          label: "Manage Signals",
          icon: <Shield size={20} />,
          badge: "Staff",
          badgeColor: "bg-cyan-500",
          requireStaff: true,
        },
      ],
    },
    {
      title: "Billing",
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
      title: "Account",
      items: [
        {
          path: "/dashboard/api-key",
          label: "API Keys",
          icon: <Key size={20} />,
        },
        {
          path: "/dashboard/notifications",
          label: "Notifications",
          icon: <Bell size={20} />,
        },
      ],
    },
    {
      title: "Referrals",
      items: [
        {
          path: "/dashboard/affiliate-dashboard",
          label: "Affiliate",
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
      items: [
        {
          path: "/dashboard/settings",
          label: "Profile",
          icon: <Settings size={20} />,
        },
        {
          path: "/dashboard/settings/security",
          label: "Security",
          icon: <Shield size={20} />,
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

  const renderMenuItem = (item: MenuItem) => (
    <NavLink
      key={item.path}
      to={item.path}
      end={item.path === "/dashboard/billing"} // Exact match for billing overview
      onClick={() => onClose()}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
          isActive
            ? "bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 text-cyan-400 border border-cyan-500/30"
            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex-shrink-0 ${
              isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"
            }`}
          >
            {item.icon}
          </span>
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/10">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TOKABI</h1>
              <p className="text-xs text-cyan-400/60">AI-Powered Trading</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mx-auto">
            <Zap size={20} className="text-white" />
          </div>
        )}
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-full flex items-center justify-center border border-cyan-500/30">
              <span className="text-cyan-400 font-semibold text-sm">
                {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.full_name || "User"}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 truncate">
                  {user?.email}
                </span>
                {isStaff && (
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {isAdmin ? "ADMIN" : "STAFF"}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Subscription Status Badge */}
          {user?.is_subscribed ? (
            <div className="mt-3 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-purple-400" />
                <span className="text-xs font-medium text-purple-400">Pro Subscriber</span>
              </div>
            </div>
          ) : (
            <NavLink
              to="/pricing"
              className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all group"
            >
              <Zap size={14} className="text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 group-hover:text-cyan-300">
                Upgrade to Pro
              </span>
            </NavLink>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuSections.map((section) => {
          const filteredItems = section.items.filter(filterMenuItem);
          if (filteredItems.length === 0) return null;

          return (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {filteredItems.map(renderMenuItem)}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Upgrade CTA (collapsed mode) */}
      {isCollapsed && !user?.is_subscribed && (
        <div className="px-3 py-4 border-t border-cyan-500/10">
          <NavLink
            to="/pricing"
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 hover:border-cyan-400/50 transition-all"
            title="Upgrade to Pro"
          >
            <Zap size={18} className="text-cyan-400" />
          </NavLink>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-cyan-500/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-cyan-950/30 border-r border-cyan-500/10 z-30"
      >
        {sidebarContent}

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 shadow-lg"
        >
          {isCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 w-[280px] h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-cyan-950/30 border-r border-cyan-500/10 z-50 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <X size={20} />
            </button>

            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardMenu;