import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Search, Filter, Share2, MoreHorizontal } from 'lucide-react';

const ProductPreview: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[160px]" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Security Command Center</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            A high-fidelity view of how KubeShield visualizes your cluster's safety.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Main Dashboard UI Mock */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
            {/* Window header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/30" />
                </div>
                <div className="h-6 w-px bg-gray-700" />
                <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">Dashboard / Cluster Security / <span className="text-cyan-400">Attack Graph</span></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" className="bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-1.5 text-xs text-gray-300 w-48 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="Search resources..." />
                </div>
                <div className="p-2 rounded-lg bg-gray-900/50 border border-gray-700 hover:bg-gray-800/50 cursor-pointer">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 min-h-[600px]">
              {/* Left Sidebar */}
              <div className="col-span-3 border-r border-gray-800 p-6 bg-gray-900/30">
                <div className="mb-8">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Security Posture</div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-300">Overall Risk</span>
                    <span className="text-sm font-bold text-red-500">Critical</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-yellow-500 to-red-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Key Findings</div>
                  {[
                    { title: 'Privileged Container', severity: 'Critical', color: 'text-red-500' },
                    { title: 'Wide Open Ingress', severity: 'High', color: 'text-orange-500' },
                    { title: 'Default Service Account', severity: 'Medium', color: 'text-yellow-500' },
                    { title: 'Secrets Exposed', severity: 'Critical', color: 'text-red-500' },
                  ].map((finding, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">{finding.title}</span>
                        <div className={`w-2 h-2 rounded-full ${finding.color === 'text-red-500' ? 'bg-red-500' : finding.color === 'text-orange-500' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      </div>
                      <div className={`text-[10px] font-bold ${finding.color}`}>{finding.severity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content (Attack Graph) */}
              <div className="col-span-9 p-8 relative flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-cyan-400" />
                    Attack Path Visualizer
                  </h3>
                  <div className="flex gap-2">
                     <button className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all">Export Report</button>
                     <button className="p-2 rounded-lg bg-gray-900/50 border border-gray-700 hover:bg-gray-800/50"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </div>

                <div className="flex-grow rounded-2xl border border-gray-800 bg-gray-950/50 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  {/* Graph visualization mock */}
                  <svg className="w-full h-full max-w-lg" viewBox="0 0 400 300">
                    {/* Pulsing connections */}
                    <path d="M50,150 Q200,50 350,150" className="stroke-red-500/40 fill-none" strokeWidth="2" strokeDasharray="5,5">
                       <animate attributeName="stroke-dashoffset" from="50" to="0" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path d="M50,150 Q200,250 350,150" className="stroke-cyan-400/40 fill-none" strokeWidth="1" strokeDasharray="5,5">
                       <animate attributeName="stroke-dashoffset" from="0" to="50" dur="3s" repeatCount="indefinite" />
                    </path>
                    
                    {/* Nodes */}
                    <g className="cursor-pointer group">
                      <circle cx="50" cy="150" r="12" className="fill-cyan-400/20 stroke-cyan-400" strokeWidth="2" />
                      <Shield className="w-4 h-4 text-cyan-400" x="42" y="142" />
                      <text x="50" y="180" textAnchor="middle" className="text-[10px] fill-gray-400 font-mono">Internet Ingress</text>
                    </g>
                    
                    <g className="cursor-pointer group">
                      <circle cx="200" cy="100" r="15" className="fill-red-500/20 stroke-red-500" strokeWidth="2" />
                      <AlertTriangle className="w-5 h-5 text-red-500" x="190" y="90" />
                      <text x="200" y="130" textAnchor="middle" className="text-[10px] fill-gray-400 font-mono">Compromised Pod</text>
                    </g>

                    <g className="cursor-pointer group">
                      <circle cx="200" cy="200" r="15" className="fill-purple-400/20 stroke-purple-400" strokeWidth="2" />
                      <CheckCircle2 className="w-5 h-5 text-purple-400" x="190" y="190" />
                      <text x="200" y="230" textAnchor="middle" className="text-[10px] fill-gray-400 font-mono">Secure API Server</text>
                    </g>

                    <g className="cursor-pointer group">
                      <circle cx="350" cy="150" r="15" className="fill-white/10 stroke-white/40" strokeWidth="2" />
                      <Database className="w-5 h-5 text-gray-400" x="340" y="140" />
                      <text x="350" y="180" textAnchor="middle" className="text-[10px] fill-gray-400 font-mono">etcd Database</text>
                    </g>
                  </svg>
                  
                  {/* Floating labels */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-gray-900/80 p-2 border border-gray-700 rounded-lg flex items-center gap-2 text-[10px] text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      High Exploitation Probability
                    </div>
                  </div>
                </div>

                {/* Bottom Panel */}
                <div className="mt-8 grid grid-cols-3 gap-6">
                   <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Resources</div>
                      <div className="text-xl font-bold text-white">1,248</div>
                   </div>
                   <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Policy Violations</div>
                      <div className="text-xl font-bold text-purple-400">12</div>
                   </div>
                   <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Security Score</div>
                      <div className="text-xl font-bold text-green-400">84/100</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Database: React.FC<any> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </svg>
);

export default ProductPreview;
