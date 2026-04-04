import { 
  Shield, 
  Target, 
  Zap, 
  Activity,
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useScanStore } from '../store/useScanStore';
import { useNavigate } from 'react-router-dom';

export const RiskScore: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();

  const isEmpty = !scanData;
  const vulnerabilities = scanData?.misconfigurations || [];

  // Derived metrics for radar chart
  const getSubjectScore = (subjects: string[]) => {
    let score = 100;
    vulnerabilities.forEach(v => {
      if (subjects.some(s => v.id.includes(s) || v.title.toLowerCase().includes(s.toLowerCase()))) {
        score -= v.severity === 'high' ? 20 : v.severity === 'medium' ? 10 : 5;
      }
    });
    return Math.max(0, score);
  };

  const radarData = [
    { subject: 'Network', A: getSubjectScore(['NETWORK', 'SERVICE', 'LB_']), fullMark: 100 },
    { subject: 'IAM', A: getSubjectScore(['ROOT', 'PRIVILEGE']), fullMark: 100 },
    { subject: 'Config', A: getSubjectScore(['CONTEXT', 'CAPABILITIES']), fullMark: 100 },
    { subject: 'Data', A: getSubjectScore(['FILESYSTEM', 'HOST_PATH', 'READONLY']), fullMark: 100 },
    { subject: 'Compute', A: getSubjectScore(['RESOURCE', 'LATEST']), fullMark: 100 },
  ];

  const pieData = [
    { name: 'High', value: vulnerabilities.filter(v => v.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: vulnerabilities.filter(v => v.severity === 'medium').length, color: '#eab308' },
    { name: 'Low', value: vulnerabilities.filter(v => v.severity === 'low').length, color: '#3b82f6' },
  ];

  if (isEmpty) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Activity className="w-12 h-12 text-gray-600 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Security Analytics Offline</h2>
        <p className="text-gray-500 max-w-sm mb-8">Multi-dimensional risk analysis requires active security telemetry. Run a deep-cluster audit to generate scores.</p>
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
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Risk <span className="text-cyan-400">Intelligence</span>
          </h1>
          <p className="text-gray-400">Quantified security metrics and adversarial threat modeling for global cluster health.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all shadow-xl"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Posture Radar</h3>
                <p className="text-xs text-gray-500">Security strength across 5 vectors</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" fontSize={8} />
                <Radar
                   name="Cluster A"
                   dataKey="A"
                   stroke="#22d3ee"
                   fill="#22d3ee"
                   fillOpacity={0.3}
                   animationDuration={2000}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Severity Mix</h3>
                <p className="text-xs text-gray-500">Distribution of active threats</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] pt-0">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPIItem title="Mean Time to Detect" value="4.2m" trend="-12%" icon={Activity} color="cyan" />
        <KPIItem title="Compliance Pct." value="87%" trend="+2.4%" icon={Shield} color="emerald" />
        <KPIItem title="Threat Suppression" value="98.2%" trend="+0.1%" icon={Zap} color="yellow" />
      </div>
    </div>
  );
};

const KPIItem = ({ title, value, trend, icon: Icon, color }: any) => (
  <Card className="hover:border-gray-700 transition-all">
    <CardContent className="pt-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</span>
        <div className={`p-2 bg-${color}-500/10 rounded-lg`}>
          <Icon className={`w-4 h-4 text-${color}-400`} />
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-white">{value}</span>
        <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend}
        </span>
      </div>
    </CardContent>
  </Card>
);
