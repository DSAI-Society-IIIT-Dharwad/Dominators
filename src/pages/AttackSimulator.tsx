import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  RotateCcw, 
  Crosshair, 
  Terminal,
  Settings,
  Flame,
  Search,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { GraphContainer } from '../components/ui/GraphContainer';
import { useScanStore } from '../store/useScanStore';
import { useNavigate } from 'react-router-dom';

export const AttackSimulator: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<{time: string, event: string, status: string}[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);

  // Memoize events from real resources and findings
  const simulationEvents = useMemo(() => {
    if (!scanData) return [];

    const events: { event: string, status: string }[] = [];
    const { graphNodes, graphEdges } = scanData.infrastructure;
    const { findings } = scanData;

    // 1. Recon Phase
    const publicEntry = graphNodes.find(n => n.type === 'loadbalancer' || (n.type === 'service' && n.name.includes('public')));
    if (publicEntry) {
      events.push({ event: `Recon: Probing external perimeter @ ${publicEntry.name}`, status: 'Scanning' });
      events.push({ event: `Entry point identified via ${publicEntry.type.toUpperCase()}:${publicEntry.name}`, status: 'Found' });
    } else {
      events.push({ event: "Recon: Initiating perimeter sweep for exposed services...", status: "Scanning" });
    }

    // 2. Exploit Phase (based on findings)
    const criticalPods = findings.filter(f => f.severity === 'HIGH' || f.severity === 'CRITICAL');
    if (criticalPods.length > 0) {
      const target = criticalPods[0];
      events.push({ event: `Targeting vulnerable workload: ${target.resource.name}`, status: 'Attacking' });
      events.push({ event: `Exploiting ${target.id.replace(/_/g, ' ')} vector...`, status: 'Injected' });
      
      if (target.id === 'PRIVILEGED_CONTAINER' || target.id === 'HOST_PATH_VOLUME') {
        events.push({ event: `Escalating to Host Node via ${target.resource.name} context`, status: 'Escalated' });
      }
    }

    // 3. Lateral Movement Phase (based on edges)
    if (graphEdges.length > 0) {
      const edge = graphEdges[0];
      const sourceNode = graphNodes.find(n => n.id === edge.source);
      const targetNode = graphNodes.find(n => n.id === edge.target);
      if (sourceNode && targetNode) {
        events.push({ event: `Pivoting: Moving from ${sourceNode.name} to ${targetNode.name} (${edge.label})`, status: 'Pivoting' });
      }
    }

    // 4. Impact Phase
    const secrets = graphNodes.filter(n => n.type === 'secret');
    if (secrets.length > 0) {
      events.push({ event: `Dumping credentials from ${secrets[0].name}...`, status: 'Exfil' });
    }

    if (events.length === 0) {
      events.push({ event: "Running generic cluster-wide breach simulation sequence...", status: "Executing" });
    }

    events.push({ event: "Simulation Sequence Complete. Attack paths verified.", status: "Success" });

    return events;
  }, [scanData]);

  const startSimulation = () => {
    if (isSimulating || simulationEvents.length === 0) return;
    
    setIsSimulating(true);
    setLogs([]);
    
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (i < simulationEvents.length) {
        setLogs(prev => [...prev, {
          time: new Date().toLocaleTimeString().split(' ')[0],
          ...simulationEvents[i]
        }]);
        i++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsSimulating(false);
      }
    }, 1200);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timeout);
  }, [logs]);

  if (!scanData) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Crosshair className="w-12 h-12 text-gray-600 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Simulation Standby</h2>
        <p className="text-gray-500 max-w-sm mb-8">Adversarial simulation requires an active scan profile. Please analyze a YAML manifest to define the attack surface.</p>
        <button 
          onClick={() => navigate('/dashboard/yaml-analyzer')}
          className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-400 transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
          <Search className="w-5 h-5" />
          Go to YAML Analyzer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Breach Simulation</h1>
          <p className="text-gray-400 font-mono tracking-tight text-sm uppercase">Safely simulate adversarial tactics across your cluster</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={startSimulation}
             disabled={isSimulating}
             className={`px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2 ${isSimulating ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-black hover:bg-red-400'}`}
           >
             {isSimulating ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
             {isSimulating ? 'Executing...' : 'Start Red-Team Simulation'}
           </button>
        </div>
      </div>

       <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          <div className="w-80 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
             <Card className="shrink-0">
                <CardHeader className="py-4">
                   <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest">Configuration</h3>
                   </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Attack Vector</label>
                      <div className="space-y-2">
                         {['Network Lateral', 'Privilege Esc', 'Data Exfil', 'DoS Engine'].map((v) => (
                           <div key={v} className="flex items-center justify-between p-2.5 bg-black/40 border border-gray-800 rounded-lg cursor-pointer hover:border-cyan-500/30 transition-all">
                              <span className="text-xs text-gray-300 font-semibold">{v}</span>
                              <input type="radio" name="vector" defaultChecked={v === 'Network Lateral'} className="accent-cyan-500" />
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Target Scenario</label>
                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                         <span className="text-xs text-gray-400 font-medium">Profile: {scanData.fileName}</span>
                      </div>
                   </div>
                </CardContent>
             </Card>

             <Card className="flex-1 bg-red-500/[0.02] border-red-500/20 overflow-hidden flex flex-col min-h-[350px]">
                <CardHeader className="py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
                   <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-red-500" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest">Live Output</h3>
                   </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pt-4 font-mono text-xs leading-relaxed overflow-y-auto custom-scrollbar">
                   {logs.length === 0 && !isSimulating && (
                     <div className="h-full flex items-center justify-center text-gray-700 italic text-center">
                        Waiting for simulation start...
                     </div>
                   )}
                   {logs.map((log, i) => (
                     <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                        <span className="text-gray-600 shrink-0 font-mono text-[10px]">[{log.time}]</span>
                        <div className="flex-1">
                           <span className="text-gray-200 font-medium">{log.event}</span>
                           <div className="flex items-center gap-2 mt-1">
                              <div className="h-[1px] flex-1 bg-gray-800" />
                              <span className={['Success', 'Found', 'Escalated'].includes(log.status) ? 'text-emerald-500 font-black' : (log.status === 'Blocked' ? 'text-red-500 font-black' : 'text-cyan-500 font-black')}>
                                {log.status?.toUpperCase() || ''}
                              </span>
                           </div>
                        </div>
                     </div>
                   ))}
                   {isSimulating && (
                     <div className="flex gap-3 items-center animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-white font-bold italic text-[10px]">Processing sequence...</span>
                     </div>
                   )}
                   <div ref={logEndRef} />
                </CardContent>
             </Card>
          </div>

          <div className="flex-1 flex flex-col gap-6 h-full min-w-0">
             <GraphContainer 
                title="Simulation Visualization" 
                description="Live representation of attack propagation and asset compromise"
             >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                   <div className="w-[500px] h-[500px] border-4 border-dashed border-red-500/30 rounded-full animate-spin-slow" />
                </div>
                {!isSimulating && logs.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                      <div className="p-8 rounded-full bg-gray-900/40 border border-gray-800 shadow-2xl">
                         <Crosshair className="w-16 h-16 text-gray-700" />
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Simulation Standby</h4>
                   </div>
                ) : (
                   <div className="h-full flex items-center justify-center">
                       <div className="relative">
                           <div className={`absolute inset-0 ${isSimulating ? 'bg-red-500/20' : 'bg-emerald-500/20'} blur-[100px] animate-pulse`} />
                           <div className={`w-64 h-64 rounded-full bg-black border-4 ${isSimulating ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]'} flex flex-col items-center justify-center relative z-10 transition-all duration-500 transform hover:scale-110`}>
                              {isSimulating ? <Flame className="w-20 h-20 text-red-500 animate-bounce" /> : <Activity className="w-20 h-20 text-emerald-500" />}
                              <span className="text-lg font-black text-white mt-4 uppercase tracking-tighter">{isSimulating ? 'BREACH ACTIVE' : 'SEQ COMPLETE'}</span>
                           </div>
                       </div>
                   </div>
                )}
             </GraphContainer>
          </div>
       </div>

       <style>{`
         @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
         .animate-spin-slow { animation: spin-slow 20s linear infinite; }
       `}</style>
    </div>
  );
};
