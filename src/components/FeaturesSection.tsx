import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, ScanLine, BarChart3, FileCode, ShieldAlert } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    { 
      icon: <Activity className="w-8 h-8 text-cyan-400" />, 
      title: 'Attack Path Detection', 
      description: 'Identify every potential route an attacker could take to exploit your Kubernetes cluster.' 
    },
    { 
      icon: <Database className="w-8 h-8 text-purple-400" />, 
      title: 'Graph Visualization', 
      description: 'Visualize complex resource relationships and security dependencies in real-time.' 
    },
    { 
      icon: <ScanLine className="w-8 h-8 text-blue-400" />, 
      title: 'Misconfiguration Scanner', 
      description: 'Scan your cluster for common security pitfalls and non-compliant configurations.' 
    },
    { 
      icon: <BarChart3 className="w-8 h-8 text-green-400" />, 
      title: 'Risk Scoring Engine', 
      description: 'Automatically prioritize threats based on potential impact and exploitability.' 
    },
    { 
      icon: <FileCode className="w-8 h-8 text-yellow-400" />, 
      title: 'YAML Analyzer', 
      description: 'Audit your manifest files before deployment to ensure baseline security.' 
    },
    { 
      icon: <ShieldAlert className="w-8 h-8 text-red-400" />, 
      title: 'Security Recommendations', 
      description: 'Get actionable, step-by-step guidance on how to remediate detected vulnerabilities.' 
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-6"
          >
            Core Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Everything you need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Ironclad Kubernetes Security</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            A comprehensive suite of tools designed to provide total visibility and control over your cluster's security posture.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ scale: 1.02, translateY: -10 }}
              className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-gray-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mb-6 p-4 rounded-xl bg-gray-900/50 border border-gray-800 inline-block group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
