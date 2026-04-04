import React from 'react';
import { 
  Search, 
  ArrowRight,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useScanStore } from '../store/useScanStore';
import { useNavigate } from 'react-router-dom';

export const WeakPoints: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();

  const isEmpty = !scanData || scanData.weakPoints.length === 0;
  const vulnerabilities = scanData?.weakPoints || [];

  if (isEmpty) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Target className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">No Vulnerabilities Detected</h2>
        <p className="text-gray-500 max-w-sm mb-8">Your manifest is currently secure against known perimeter exploits. Upload a YAML file to identify potential weak points.</p>
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
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Weak <span className="text-red-500">Points</span>
          </h1>
          <p className="text-gray-400">Targeted identification of high-risk security gaps and potential entry points.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vulnerabilities.map((point: any) => (
            <Card key={point.id} className="group hover:border-red-500/30 transition-all duration-500 relative overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-16 h-16 text-yellow-500" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={point.severity}>{point.severity} RISK</Badge>
                  <span className="text-[10px] text-gray-600 font-mono">UID: {point.id.toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">{point.title}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400 leading-relaxed font-medium">{point.description}</p>
                
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Resource Hotspots</span>
                  <div className="flex flex-wrap gap-2">
                    {point.impact.replace('Affected resources: ', '').split(', ').map((res: string, i: number) => (
                      <div key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded font-mono text-[10px] text-red-400 flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                        {res}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Threat Level</span>
                    <span className="text-xs text-gray-300 font-bold uppercase">{point.severity} Risk</span>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-all uppercase tracking-widest group/btn">
                    Exploit Details
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};
