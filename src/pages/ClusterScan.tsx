import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  RotateCcw, 
  Box,
  Radar,
  CheckCircle2,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useLiveScan } from '../hooks/useLiveScan';
import { useScanStore } from '../store/useScanStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ClusterScan: React.FC = () => {
  const { data, loading, error, refetch } = useLiveScan();
  const navigate = useNavigate();
  const setYaml = useScanStore((state) => state.setYamlSource);
  const setSourceInfo = useScanStore((state) => state.setSourceInfo);
  const clearScanData = useScanStore((state) => state.clearScanData);

  const isScanning = loading || !data;

  // Placeholder for when backend hasn't finished first scan
  const isInitializing = data?.last_scan_time === "Scanning initialization...";

  const handleAnalyzeResource = async (name: string, namespace: string, kind: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${API_BASE_URL}/cluster/resource-yaml?name=${name}&namespace=${namespace}&kind=${kind}`);
      if (!response.ok) throw new Error("Failed to fetch resource YAML");
      
      const result = await response.json();
      if (result.yaml) {
        clearScanData();
        setYaml(result.yaml);
        setSourceInfo(`Cluster: ${kind}/${name}`);
        navigate('/analyzer');
      }
    } catch (err) {
      console.error("Resource fetch error:", err);
      alert("Error loading resource from cluster.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Radar className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Live Cluster <span className="text-cyan-400">Scanner</span>
            </h1>
          </div>
          <p className="text-gray-400 max-w-xl">
             Real-time security auditing of active Kubernetes workloads. Background scans execute every 10 seconds.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-900/40 border border-gray-800 p-1 rounded-xl">
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-bold border border-emerald-500/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            LIVE
          </div>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            Sync Now
          </button>
        </div>
      </div>

      {error ? (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Backend Connection Failed</h3>
            <p className="text-gray-400 max-w-md mb-6">Unable to connect to the live scanning service. Please ensure the KubeShield backend is running.</p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Connection
            </button>
          </CardContent>
        </Card>
      ) : isScanning || isInitializing ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-900/40 border border-gray-800 rounded-3xl" />
            ))}
          </div>
          <div className="h-[400px] bg-gray-900/40 border border-gray-800 rounded-3xl flex items-center justify-center">
             <div className="text-center">
                <Box className="w-12 h-12 text-gray-700 animate-bounce mx-auto mb-4" />
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Awaiting first scan results...</p>
             </div>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPIItem 
              title="Total Resources" 
              value={data.total_pods_scanned} 
              icon={Box} 
              color="cyan" 
            />
             <KPIItem 
              title="High Risk" 
              value={data.summary.high} 
              icon={ShieldAlert} 
              color="red" 
            />
            <KPIItem 
              title="Medium Risk" 
              value={data.summary.medium} 
              icon={AlertTriangle} 
              color="yellow" 
            />
            <KPIItem 
              title="Low Risk" 
              value={data.summary.low} 
              icon={Shield} 
              color="blue" 
            />
          </div>

          {/* Detailed Findings */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800 bg-gray-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white uppercase tracking-tight">Active Cluster Vulnerabilities</h3>
                  <p className="text-xs text-gray-500 font-mono">Last scanned: {new Date(data.last_scan_time).toLocaleTimeString()}</p>
                </div>
              </div>
              <Badge variant={data.findings.length > 0 ? "critical" : "success"}>
                {data.findings.length} ISSUES DETECTED
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
               {data.findings.length === 0 ? (
                 <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/20">
                       <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Cluster Secure</h4>
                    <p className="text-gray-500 max-w-sm">No security violations found in the currently running workloads.</p>
                 </div>
               ) : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-gray-800 bg-gray-900/10">
                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Resource</th>
                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Kind</th>
                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Namespace</th>
                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Risk Level</th>
                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-800/50">
                          {data.findings.map((finding, idx) => (
                             <tr key={`${finding.name}-${idx}`} className="group hover:bg-gray-800/20 transition-colors">
                                <td className="px-6 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="p-2 bg-gray-900 rounded-lg group-hover:bg-gray-800 transition-colors">
                                         <Box className="w-4 h-4 text-gray-400" />
                                      </div>
                                      <span className="font-bold text-white">{finding.name}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                   <Badge variant="info" className="bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                                      {finding.kind}
                                   </Badge>
                                </td>
                                <td className="px-6 py-5">
                                   <code className="text-xs bg-gray-900/60 px-2 py-1 rounded border border-gray-800 font-mono text-cyan-400">{finding.namespace}</code>
                                </td>
                                <td className="px-6 py-5">
                                   <Badge variant={finding.risk.toLowerCase() as any}>{finding.risk}</Badge>
                                </td>
                                <td className="px-6 py-5">
                                   <button 
                                     onClick={() => handleAnalyzeResource(finding.name, finding.namespace, finding.kind)}
                                     className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black rounded-lg text-xs font-bold transition-all border border-cyan-500/20"
                                   >
                                      <Search className="w-3 h-3" />
                                      Analyze
                                      <ChevronRight className="w-3 h-3" />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const KPIItem = ({ title, value, icon: Icon, color }: any) => (
  <Card className="relative overflow-hidden group">
    <div className={cn(
      "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
      `bg-${color}-500`
    )} />
    <CardContent className="pt-8 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</span>
        <div className={cn("p-2 rounded-lg bg-black/40 border border-gray-800", `text-${color}-400`)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-4xl font-black text-white">{value}</span>
      </div>
       <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
        <div className={cn("h-full", `bg-${color}-500`, value > 0 ? "w-1/3" : "w-0")} />
      </div>
    </CardContent>
  </Card>
);
