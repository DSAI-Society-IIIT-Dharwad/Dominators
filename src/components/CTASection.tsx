import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl aspect-square bg-cyan-500/10 rounded-full blur-[160px]" />

      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 overflow-hidden bg-gray-950/40 p-12 lg:p-20 text-center flex flex-col items-center gap-10"
        >
          {/* Animated background lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-gray-900/50 border border-gray-800 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-300 relative z-10">
            <ShieldCheck className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>

          <div className="max-w-4xl relative z-10 flex flex-col gap-6">
             <h2 className="text-4xl lg:text-7xl font-bold leading-tight text-white">
                Start Securing Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Kubernetes Infrastructure</span> Today
             </h2>
             <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Join 500+ enterprises who trust KubeShield for their cloud-native security intelligence and automated threat hunting.
             </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
            <Link to="/signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 px-10 py-5 rounded-full text-lg font-black flex items-center gap-2 group shadow-[0_4px_40px_rgba(34,211,238,0.4)]">
              <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              Launch Platform
            </Link>
            <Link to="/signup" className="border border-gray-700 text-white hover:bg-gray-900/50 transition-all duration-300 px-10 py-5 rounded-full text-lg font-black flex items-center gap-2">
              Learn More
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Floating UI mock elements around CTA */}
          <div className="absolute top-10 left-10 hidden lg:block">
             <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-cyan-500/30 text-[10px] font-mono text-cyan-400">
                CVE SCAN: 0 CRITICAL
             </div>
          </div>
          <div className="absolute bottom-10 right-10 hidden lg:block">
             <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-purple-500/30 text-[10px] font-mono text-purple-400">
                NODES HARDENED: 100%
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
