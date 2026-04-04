import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, TrendingUp, ChevronRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[180px] animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-wider uppercase self-start">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            AI-Powered Kubernetes Security Intelligence
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            Visualize <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Vulnerabilities</span>. <br />
            Predict Attack Paths. <br />
            Secure Kubernetes.
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
            KubeShield transforms complex Kubernetes security risks into clear visual intelligence — helping teams detect attack paths, uncover misconfigurations, and strengthen cluster defenses before threats strike.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 px-8 py-4 rounded-full text-base font-bold flex items-center gap-2 group shadow-[0_4px_30px_rgba(34,211,238,0.4)]" aria-label="Get Started">
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-gray-700 text-white hover:bg-gray-900/50 transition-all duration-300 px-8 py-4 rounded-full text-base font-bold flex items-center gap-2" aria-label="Explore Features">
              <Play className="w-4 h-4 fill-current" />
              Explore Features
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Mock UI Dashboard */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-xs text-gray-500 font-mono">cluster-prod-01.kubeshield.io</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div 
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-800"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Risk Level</div>
                <motion.div 
                  className="text-2xl font-bold text-red-500"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >Critical</motion.div>
              </motion.div>
              <motion.div 
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-800"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Active Alerts</div>
                <motion.div 
                  className="text-2xl font-bold text-white"
                  animate={{ 
                    scale: [1, 1.03, 1],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >42</motion.div>
              </motion.div>
            </div>

            {/* Mock Graph Visual */}
            <motion.div 
              className="h-64 rounded-xl border border-gray-800 bg-gray-950/50 overflow-hidden relative flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                 <motion.svg 
                   className="w-full h-full opacity-60" 
                   viewBox="0 0 200 100"
                   initial={{ scale: 0.8 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: 1.5, duration: 0.6 }}
                 >
                    {/* Animated nodes */}
                    <motion.circle 
                      cx="100" cy="50" r="10" 
                      className="fill-cyan-400"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.circle 
                      cx="50" cy="20" r="6" 
                      className="fill-purple-400"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                    <motion.circle 
                      cx="50" cy="80" r="6" 
                      className="fill-purple-400"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                    <motion.circle 
                      cx="150" cy="20" r="6" 
                      className="fill-red-500"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.circle 
                      cx="150" cy="80" r="6" 
                      className="fill-green-500"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    />
                    
                    {/* Animated connections */}
                    <motion.line 
                      x1="100" y1="50" x2="50" y2="20" 
                      className="stroke-gray-600" 
                      strokeWidth="1"
                      animate={{ 
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.line 
                      x1="100" y1="50" x2="50" y2="80" 
                      className="stroke-gray-600" 
                      strokeWidth="1"
                      animate={{ 
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                    <motion.line 
                      x1="100" y1="50" x2="150" y2="20" 
                      className="stroke-red-500/50" 
                      strokeWidth="2" 
                      strokeDasharray="4"
                      animate={{ 
                        strokeDashoffset: [0, 8],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.line 
                      x1="100" y1="50" x2="150" y2="80" 
                      className="stroke-gray-600" 
                      strokeWidth="1"
                      animate={{ 
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                 </motion.svg>
                 <motion.div 
                   className="absolute top-4 left-4 flex flex-col gap-2"
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 2, duration: 0.6 }}
                 >
                    <motion.div 
                      className="bg-black/60 backdrop-blur-sm p-2 border border-cyan-500/30 rounded flex items-center gap-2 text-[10px]"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        borderColor: ['rgb(34 211 238 / 0.3)', 'rgb(34 211 238 / 0.6)', 'rgb(34 211 238 / 0.3)']
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <TrendingUp className="w-3 h-3 text-cyan-400" />
                        </motion.div>
                        Scanning...
                    </motion.div>
                 </motion.div>
              </div>
            </motion.div>

            {/* Animated Floating nodes */}
            <motion.div 
              className="absolute -top-10 -right-10 bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/30 shadow-xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
               <motion.div
                 animate={{ 
                   scale: [1, 1.1, 1],
                   rotate: [0, 5, -5, 0]
                 }}
                 transition={{ 
                   duration: 4,
                   repeat: Infinity,
                   ease: "easeInOut"
                 }}
               >
                 <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
               </motion.div>
               <div className="text-xs font-bold">New Attack Path Detected</div>
               <div className="text-[10px] text-gray-500">Namespace: default</div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-10 -left-10 bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/30 shadow-xl"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
               <motion.div
                 animate={{ 
                   scale: [1, 1.1, 1],
                   rotate: [0, -3, 3, 0]
                 }}
                 transition={{ 
                   duration: 3.5,
                   repeat: Infinity,
                   ease: "easeInOut"
                 }}
               >
                 <Shield className="w-8 h-8 text-cyan-400 mb-2" />
               </motion.div>
               <div className="text-xs font-bold">Hardening Complete</div>
               <div className="text-[10px] text-gray-500">Pod Security Policy Applied</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
