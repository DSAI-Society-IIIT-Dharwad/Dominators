import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">
          <div className="flex flex-col gap-6 lg:col-span-1">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  KubeShield
                </span>
             </div>
             <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Empowering DevOps and Security teams with AI-driven Kubernetes intelligence for proactive threat detection and remediation.
             </p>
             <div className="flex gap-4">
                {[Github, Twitter, Linkedin, Mail].map((Icon, idx) => (
                  <motion.a 
                    key={idx} 
                    href="#" 
                    whileHover={{ scale: 1.1, color: '#22d3ee' }}
                    className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-400 transition-colors hover:border-cyan-500/50"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
             </div>
          </div>

          <div>
             <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">Platform</h4>
             <ul className="flex flex-col gap-4">
                {['Features', 'Security Intelligence', 'Automated Hardening', 'Pricing', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 text-sm hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                      {item}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                    </a>
                  </li>
                ))}
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">Company</h4>
             <ul className="flex flex-col gap-4">
                {['About Us', 'Careers', 'Blog', 'Security Portal', 'Legal'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 text-sm hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                      {item}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                    </a>
                  </li>
                ))}
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest">Stay Updated</h4>
             <p className="text-gray-500 text-sm mb-6">Receive our latest security advisories and product updates.</p>
             <div className="relative">
                <input 
                  type="email" 
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-all" 
                  placeholder="Enter your email" 
                />
                <button className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all px-4 rounded-lg text-xs font-bold text-black">
                  Join
                </button>
             </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">
              &copy; {currentYear} KUBESHIELD CYBERSECURITY. ALL RIGHTS RESERVED.
           </div>
           <div className="flex gap-8">
              <a href="#" className="text-gray-600 text-[10px] font-mono uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 text-[10px] font-mono uppercase tracking-widest hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-600 text-[10px] font-mono uppercase tracking-widest hover:text-white transition-colors">Cookbook</a>
           </div>
           <div className="text-gray-600 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
           </div>
        </div>
      </div>
      
      {/* Footer background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-[120px]" />
    </footer>
  );
};

export default Footer;
