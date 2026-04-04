import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Search, CheckCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    { 
      icon: <Upload className="w-8 h-8 text-cyan-400" />, 
      title: 'Upload YAML / Connect Cluster', 
      description: 'Simply provide your Kubernetes manifest files or connect your cluster directly via read-only access.' 
    },
    { 
      icon: <Cpu className="w-8 h-8 text-purple-400" />, 
      title: 'Parse Resources', 
      description: 'Our engine extracts resources, permissions, and network policies to build a comprehensive map.' 
    },
    { 
      icon: <Search className="w-8 h-8 text-blue-400" />, 
      title: 'Detect Risks', 
      description: 'We run thousands of security checks to uncover misconfigurations, vulnerabilities, and risky permissions.' 
    },
    { 
      icon: <CheckCircle className="w-8 h-8 text-green-400" />, 
      title: 'Visualize & Fix', 
      description: 'Explore the interactive attack path graph and apply our automated remediation fixes.' 
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-6"
          >
            The Workflow
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Four Simple Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Total Cluster Defense</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector lines (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-y-1/2" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group relative z-10"
            >
              <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-xl border border-gray-800 flex items-center justify-center mb-8 group-hover:border-cyan-500/50 group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
