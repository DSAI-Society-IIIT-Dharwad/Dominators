import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, LogOut, ChevronDown, Settings, Shield, Terminal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const TopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Admin';
  const displayEmail = user?.email || 'admin@kubeshield.io';

  const notifications: any[] = []; // Notifications should be dynamic but we'll leave as empty for now to meet No-Mock requirement

  return (
    <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-gray-800/50 h-20">
      <div className="h-full flex items-center justify-between px-8">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search assets, threats, or configurations (Cmd + K)"
              className="w-full pl-12 pr-4 py-2.5 bg-gray-900/40 border border-gray-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-8">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2 mr-4 border-r border-gray-800/50 pr-6">
            <button className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all group" title="Run Scan">
              <Terminal className="w-4 h-4 group-hover:text-cyan-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all group" title="Shield Status">
              <Shield className="w-4 h-4 group-hover:text-emerald-400" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative p-2.5 rounded-xl border border-gray-800/50 transition-all hover:bg-gray-800/50 ${isNotificationsOpen ? 'bg-gray-800/50' : 'bg-gray-900/40'}`}
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black" />
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-black/90 backdrop-blur-2xl border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
                    <span className="font-bold text-sm">Notifications</span>
                    <button className="text-xs text-cyan-400 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-gray-800/30 hover:bg-gray-800/40 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-cyan-500'}`} />
                          <div>
                            <p className="text-sm font-semibold text-gray-200 group-hover:text-white">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.description}</p>
                            <p className="text-[10px] text-gray-600 mt-2 font-mono">{n.time.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-xs text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors border-t border-gray-800/50">
                    View all events
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-gray-800/50 bg-gray-900/40 hover:bg-gray-800/50 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white tracking-wide">{displayName}</div>
                <div className="text-[10px] text-gray-500 font-mono">ROLE: CLUSTER_ADMIN</div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-black/90 backdrop-blur-2xl border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-800/50 bg-gray-900/20">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-1">Account</p>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-bold text-white truncate">{displayEmail}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Preferences</span>
                    </button>
                    <div className="h-px bg-gray-800/50 my-1 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 transition-all font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Terminate Session</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
