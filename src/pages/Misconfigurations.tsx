import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  ArrowRight,
  Info,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useScanStore } from '../store/useScanStore';
import { useNavigate } from 'react-router-dom';

export const Misconfigurations: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();

  const isEmpty = !scanData || scanData.misconfigurations.length === 0;
  const vulnerabilities = scanData?.misconfigurations || [];

  if (isEmpty) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">No Misconfigurations Found</h2>
        <p className="text-gray-500 max-w-sm mb-8">All resources are currently passing basic security configuration checks. Upload a YAML manifest to begin analysis.</p>
        <button 
          onClick={() => navigate('/dashboard/yaml-analyzer')}
          className="flex items-center gap-3 px-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          <Search className="w-5 h-5" />
          Go to YAML Analyzer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Policy <span className="text-cyan-400">Audit</span>
          </h1>
          <p className="text-gray-400">Review and remediate failed security configuration checks across global namespaces.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search findings..." 
              className="pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50 min-w-[280px] transition-all"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/40">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Policy Check</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Resource ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Severity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                  {vulnerabilities.map((log: any) => (
                    <tr key={log.id} className="group hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${log.severity === 'high' ? 'bg-red-500/10' : 'bg-gray-800'}`}>
                            {log.severity === 'high' ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <Info className="w-4 h-4 text-gray-400" />}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{log.title}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">UID: {log.id.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-black/40 border border-gray-800 rounded font-mono text-[10px] text-gray-400">{log.path || 'YAML-SCAN'}</code>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs text-gray-400">{log.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={log.severity}>{log.severity}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                           <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Failed Audit</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-2 ml-auto group/btn">
                          View Fix 
                          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
