import React from 'react';
import { 
  Shield, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  ShieldAlert,
  Search,
  FileSearch,
  History,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useScanStore } from '../store/useScanStore';
import { useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Dashboard: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  const mockHistory = [
    { id: '1', date: '2024-04-04 10:30', score: 85, file: 'deployment-v1.yaml' },
    { id: '2', date: '2024-04-03 15:45', score: 92, file: 'service-auth.yaml' },
    { id: '3', date: '2024-04-02 09:12', score: 88, file: 'ingress-prod.yaml' },
  ];

  if (!scanData) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <FileSearch className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">No Scan Data Found</h2>
        <p className="text-gray-500 max-w-sm mb-8">You haven't performed any YAML analysis yet. Please upload or paste a manifest to see security insights.</p>
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

  const { misconfigurations, riskScore, riskLevel, timestamp, fileName, infrastructure } = scanData;
  const vulnerabilities = misconfigurations; // Mapping for compatibility

  // Derived stats
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
  const warningCount = vulnerabilities.filter(v => ['medium', 'low'].includes(v.severity)).length;
  const globalRiskScore = riskScore;
  const riskColor = riskLevel === 'HIGH' ? 'red' : riskLevel === 'MEDIUM' ? 'yellow' : 'emerald';


  // Chart data formatting
  const vulnDistData = [
    { category: 'High', count: vulnerabilities.filter(v => v.severity === 'high').length, color: '#f97316' },
    { category: 'Medium', count: vulnerabilities.filter(v => v.severity === 'medium').length, color: '#eab308' },
    { category: 'Low', count: vulnerabilities.filter(v => v.severity === 'low').length, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Security <span className="text-cyan-400">Overview</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Latest intelligence for <span className="text-white font-medium">{fileName}</span> analyzed at <span className="text-white font-medium">{new Date(timestamp).toLocaleTimeString()}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-gray-900/40 border border-gray-800 p-1 rounded-xl">
          <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-bold border border-cyan-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            Live View
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            Historical
          </button>
        </div>
      </div>

      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Analysis History"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400 mb-6">Review your previous security scans and risk profile trends.</p>
          <div className="space-y-3">
            {mockHistory.map((item) => (
              <div key={item.id} className="p-4 bg-black/40 border border-gray-800 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-900 rounded-xl border border-gray-800">
                    <Clock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.file}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{item.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Score</div>
                    <div className={cn(
                      "text-xl font-black",
                      item.score > 90 ? "text-emerald-400" : "text-yellow-400"
                    )}>{item.score}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsHistoryOpen(false)}
            className="w-full py-4 mt-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all"
          >
            Close History
          </button>
        </div>
      </Modal>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIItem title="Global Risk Score" value={globalRiskScore} total="/100" icon={Shield} color={riskColor} loading={false} />
        <KPIItem title="High Exposure" value={highCount} icon={AlertOctagon} color="red" loading={false} />
        <KPIItem title="Active Warnings" value={warningCount} icon={AlertTriangle} color="yellow" loading={false} />
        <KPIItem title="Analyzed Resources" value={infrastructure.findings + (infrastructure.pods || 0)} icon={CheckCircle2} color="emerald" loading={false} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
             <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Risk Trend Analysis</h3>
                <p className="text-xs text-gray-500">Global security score over last 7 days</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-6 h-[300px] flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-12 h-12 text-cyan-500/20 mx-auto mb-4" />
                <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Snapshot Analysis</p>
                <div className="text-4xl font-black text-white mt-2">{globalRiskScore}<span className="text-sm text-gray-500 ml-1">/100</span></div>
                <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-tighter">Real-time scan completed successfully</p>
              </div>
          </CardContent>
        </Card>

        {/* Vulnerability Distribution */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Vulnerability Breakdown</h3>
                <p className="text-xs text-gray-500">Total threats by severity level</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vulnDistData} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                    {vulnDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-white">Real-time Security Events</h3>
              <p className="text-xs text-gray-500">Live stream of cluster security alerts</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/20">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Incident</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Resource</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Severity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                  {vulnerabilities.slice(0, 5).map((alert: any) => (
                    <tr key={alert.id} className="group hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{alert.title}</div>
                        <div className="text-[10px] text-gray-600 font-mono mt-1">ID: {alert.id.substring(0, 8).toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-900 px-2 py-1 rounded border border-gray-800 font-mono text-gray-400">{alert.resourceId || 'YAML-SCAN'}</code>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={alert.severity}>{alert.severity}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        {new Date().toLocaleTimeString()}
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

const KPIItem = ({ title, value, total = "", icon: Icon, color, loading }: any) => (
  <Card className={loading ? "animate-pulse" : ""}>
    <CardContent className="pt-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</span>
        <Icon className={`w-5 h-5 text-${color}-500`} />
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-4xl font-black text-white">{loading ? '...' : value}</span>
        {total && <span className="text-xl font-bold text-gray-500 mb-1">{total}</span>}
      </div>
      <div className={`h-1 w-full bg-${color}-500/10 rounded-full overflow-hidden`}>
        <div className={`h-full bg-${color}-500 w-1/3`} />
      </div>
    </CardContent>
  </Card>
);
