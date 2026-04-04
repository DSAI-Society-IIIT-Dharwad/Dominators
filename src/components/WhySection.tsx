import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, Target, Sparkles } from 'lucide-react';

const WhySection: React.FC = () => {
  const cards = [
    { 
      icon: <Zap className="w-8 h-8 text-yellow-400" />, 
      title: 'Real-Time Insights', 
      description: 'Get immediate notifications and visual updates as soon as your cluster state changes.' 
    },
    { 
      icon: <Sparkles className="w-8 h-8 text-purple-400" />, 
      title: 'AI Analysis', 
      description: 'Leverage machine learning to predict potential attack vectors before they are even exploited.' 
    },
    { 
      icon: <Eye className="w-8 h-8 text-cyan-400" />, 
      title: 'Full Visibility', 
      description: 'See every connection, permission, and resource in one unified, interactive security graph.' 
    },
    { 
      icon: <Target className="w-8 h-8 text-red-500" />, 
      title: 'Actionable Fixes', 
      description: 'Don\'t just find problems — fix them with one-click automated security hardening.' 
    },
  ];

  return (
    <section id="why-kubeshield" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-6"
             >
               Why Choose Us
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-4xl lg:text-5xl font-bold mb-8 text-white leading-tight"
             >
               The Next Generation of <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Cloud Native Security</span>
             </motion.h2>
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="text-gray-400 text-lg mb-10 leading-relaxed"
             >
               Legacy tools were built for yesterday's infrastructure. KubeShield is designed from the ground up for the complexity of modern Kubernetes clusters.
             </motion.p>
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-gray-800 bg-gradient-to-br from-cyan-500/10 to-transparent relative group overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Target className="w-32 h-32 text-cyan-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Unmatched Precision</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">Our proprietary analysis engine reduces false positives by 90% compared to traditional scanners.</p>
                <button className="text-cyan-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300">
                  Read our technical whitepaper
                  <span>&rarr;</span>
                </button>
             </motion.div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ translateY: -10 }}
                className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-gray-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300"
              >
                <div className="mb-6">{card.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
