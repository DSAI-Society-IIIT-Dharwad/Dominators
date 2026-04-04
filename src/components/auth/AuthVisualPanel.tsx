import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Activity, Lock } from 'lucide-react';

export const AuthVisualPanel: React.FC = () => {
  return (
    <div className="relative h-[600px] bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-8"
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
          <div className="text-red-400 font-bold text-sm">Critical Risk</div>
          <div className="text-gray-500 text-xs">RBAC Overexposure</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-32 right-12"
      >
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-sm">
          <Shield className="w-8 h-8 text-cyan-400 mb-2" />
          <div className="text-cyan-400 font-bold text-sm">Protected</div>
          <div className="text-gray-500 text-xs">42 Pods Secured</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 left-16"
      >
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
          <Activity className="w-8 h-8 text-purple-400 mb-2" />
          <div className="text-purple-400 font-bold text-sm">Active Scan</div>
          <div className="text-gray-500 text-xs">3 Clusters</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-20 right-8"
      >
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
          <Lock className="w-8 h-8 text-green-400 mb-2" />
          <div className="text-green-400 font-bold text-sm">Hardened</div>
          <div className="text-gray-500 text-xs">18 Nodes</div>
        </div>
      </motion.div>

      {/* Central Network Visualization */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative w-64 h-64"
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Network Lines */}
            <motion.line
              x1="100" y1="100" x2="50" y2="50"
              stroke="rgba(34, 211, 238, 0.3)"
              strokeWidth="1"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.line
              x1="100" y1="100" x2="150" y2="50"
              stroke="rgba(147, 51, 234, 0.3)"
              strokeWidth="1"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.line
              x1="100" y1="100" x2="50" y2="150"
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="1"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <motion.line
              x1="100" y1="100" x2="150" y2="150"
              stroke="rgba(239, 68, 68, 0.3)"
              strokeWidth="2"
              strokeDasharray="4"
              animate={{ strokeDashoffset: [0, 8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Network Nodes */}
            <motion.circle
              cx="100" cy="100" r="8"
              fill="rgba(34, 211, 238, 0.8)"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="50" cy="50" r="5" fill="rgba(147, 51, 234, 0.8)" />
            <circle cx="150" cy="50" r="5" fill="rgba(34, 197, 94, 0.8)" />
            <circle cx="50" cy="150" r="5" fill="rgba(34, 197, 94, 0.8)" />
            <circle cx="150" cy="150" r="6" fill="rgba(239, 68, 68, 0.8)" />
          </svg>
        </motion.div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-cyan-400">24/7</div>
            <div className="text-xs text-gray-500">Monitoring</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-purple-400">99.9%</div>
            <div className="text-xs text-gray-500">Uptime</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-green-400">1.2M</div>
            <div className="text-xs text-gray-500">Scans</div>
          </motion.div>
        </div>
      </div>

      {/* Title Overlay */}
      <div className="absolute top-8 left-8 right-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Security Intelligence</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Real-time attack path visualization, misconfiguration detection, and automated hardening for your Kubernetes infrastructure.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
