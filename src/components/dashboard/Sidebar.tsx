import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Route, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  FileCode, 
  Shield,
  Menu,
  X,
  Target,
  Zap,
  Network,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFirestoreRealtime } from '../../services/dataService';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string | number;
  variant?: 'danger' | 'warning' | 'default';
  countId?: string; // To map to firestore collections
}

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Real-time counts for badges
  const { data: vNodes } = useFirestoreRealtime<any>('attackPaths');
  const { data: vVulns } = useFirestoreRealtime<any>('vulnerabilities');
  const { data: vRecs } = useFirestoreRealtime<any>('recommendations');

  const sidebarItems: SidebarItem[] = [
    {
      icon: FileCode,
      label: 'YAML Analyzer',
      href: '/dashboard/yaml-analyzer'
    },
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: Route,
      label: 'Attack Paths',
      href: '/dashboard/attack-paths',
      badge: vNodes.length || undefined,
      variant: 'danger'
    },
    {
      icon: TrendingUp,
      label: 'Risk Score',
      href: '/dashboard/risk-score'
    },
    {
      icon: AlertTriangle,
      label: 'Misconfigurations',
      href: '/dashboard/misconfigurations',
      badge: vVulns.length || undefined,
      variant: 'warning'
    },
    {
      icon: Target,
      label: 'Weak Points',
      href: '/dashboard/weak-points'
    },
    {
      icon: Zap,
      label: 'Attack Simulator',
      href: '/dashboard/attack-simulator'
    },
    {
      icon: Lightbulb,
      label: 'Recommendations',
      href: '/dashboard/recommendations',
      badge: vRecs.length || undefined
    },
    {
      icon: Network,
      label: 'Infrastructure Map',
      href: '/dashboard/infrastructure-map'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
        }}
        className={cn(
          "fixed left-0 top-0 h-full bg-black/60 backdrop-blur-2xl border-r border-gray-800/50 z-50 overflow-hidden flex flex-col transition-all duration-300",
          isMobileOpen && "translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Link to="/dashboard" className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-transform group-hover:scale-105">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight"
              >
                KubeShield
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {sidebarItems.map((item) => {
            const Active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group relative flex items-center h-12 rounded-xl transition-all duration-200 overflow-hidden",
                  Active 
                    ? "bg-cyan-500/10 text-cyan-400 font-semibold" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/40",
                  isCollapsed ? "justify-center px-0" : "px-4 gap-3"
                )}
              >
                {/* Active Indicator */}
                {Active && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full"
                  />
                )}

                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  Active ? "scale-110" : "group-hover:scale-110"
                )} />

                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-all",
                    item.variant === 'danger' ? "bg-red-500/20 text-red-400" :
                    item.variant === 'warning' ? "bg-yellow-500/20 text-yellow-500" :
                    "bg-gray-800 text-gray-400"
                  )}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 border border-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity translate-x-[-10px] group-hover:translate-x-0 font-medium whitespace-nowrap shadow-2xl z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Settings Section */}
        <div className="p-4 border-t border-gray-800/50 space-y-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-10 hidden lg:flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:bg-gray-800/40 rounded-xl transition-all"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center text-white active:scale-95 transition-transform"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </>
  );
};
