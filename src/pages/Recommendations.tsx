import React from 'react';
import { 
  ArrowRight,
  TrendingUp,
  Zap,
  RefreshCw,
  Search,
  Loader2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useScanStore, Recommendation } from '../store/useScanStore';
import { useNavigate } from 'react-router-dom';

export const Recommendations: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();
  const [fixingId, setFixingId] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState<Recommendation | null>(null);

  const handleImplementFix = (rec: Recommendation) => {
    setFixingId(rec.id);
    // Simulate API call
    setTimeout(() => {
      setFixingId(null);
      setShowSuccess(rec);
    }, 2000);
  };

  const isEmpty = !scanData || scanData.recommendations.length === 0;
  const recommendations = scanData?.recommendations || [];

  if (isEmpty) {
     return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl scale-110">
          <ShieldCheck className="w-12 h-12 text-gray-600 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Posture Synchronized</h2>
        <p className="text-gray-500 max-w-sm mb-8">No critical remediation tasks pending. High security standards detected across the current infrastructure.</p>
        <button 
          onClick={() => navigate('/dashboard/yaml-analyzer')}
          className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
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
            Action <span className="text-emerald-400">Items</span>
          </h1>
          <p className="text-gray-400">Prioritized security enhancements to optimize cluster defense and compliance scores.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec: any) => (
            <Card key={rec.id} className="group hover:border-emerald-500/30 transition-all duration-500 relative flex flex-col bg-black/40 backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-16 h-16 text-emerald-500" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={rec.priority}>{rec.priority}</Badge>
                  <div className="items-center gap-1.5 hidden md:flex">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Impact: {rec.impact}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight line-clamp-2">{rec.title}</h3>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-0">
                <p className="text-sm text-gray-400 leading-relaxed font-medium mb-6">Action: {rec.action}. Improving this will strengthen your cluster posture.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-800/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Est. Effort</span>
                      <span className="text-sm text-white font-bold">Low</span>
                    </div>
                    <div className="w-10 h-10 bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleImplementFix(rec)}
                    disabled={!!fixingId}
                    className="w-full py-4 bg-gray-900 border border-gray-800 text-emerald-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group/btn hover:border-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {fixingId === rec.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        Implement Fix
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <Modal
        isOpen={!!showSuccess}
        onClose={() => setShowSuccess(null)}
        title="Remediation Successful"
        maxWidth="md"
      >
        {showSuccess && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Posture Updated</h4>
              <p className="text-sm text-gray-400">
                The security recommendation <span className="text-emerald-400 font-bold">"{showSuccess.title}"</span> has been successfully applied to your cluster configuration.
              </p>
            </div>
            <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 text-left">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Impact Analysis</div>
              <p className="text-xs text-gray-300 font-medium">{showSuccess.impact}</p>
            </div>
            <button 
              onClick={() => setShowSuccess(null)}
              className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all"
            >
              Exfiltration Complete
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
