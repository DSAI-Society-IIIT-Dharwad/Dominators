import React from 'react';
import { motion } from 'framer-motion';

const TechStack: React.FC = () => {
  const stack = [
    { name: 'React', color: 'text-cyan-400' },
    { name: 'TypeScript', color: 'text-blue-400' },
    { name: 'Tailwind CSS', color: 'text-cyan-400' },
    { name: 'D3.js', color: 'text-orange-400' },
    { name: 'Supabase', color: 'text-green-400' },
    { name: 'Docker', color: 'text-blue-400' },
    { name: 'Kubernetes', color: 'text-blue-400' },
  ];

  return (
    <section id="tech-stack" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-6"
          >
            Built With Best-in-Class Tech
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Seamlessly Integrated with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Your Workflow</span>
          </motion.h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20">
          {stack.map((tech, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, filter: 'brightness(1.5)' }}
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-2xl bg-black/40 backdrop-blur-xl border border-gray-800 flex items-center justify-center bg-gray-900/50 transition-all duration-300 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10">
                <span className={`text-2xl lg:text-3xl font-black ${tech.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                   {tech.name.charAt(0)}
                </span>
              </div>
              <span className="text-gray-500 font-bold text-xs uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
