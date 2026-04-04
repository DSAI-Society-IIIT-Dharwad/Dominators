import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  FileCode, 
  AlertTriangle, 
  Upload,
  CloudIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useScanStore, ScanData } from '../store/useScanStore';
import { scanManifest, calculateRiskScore as getRiskScore } from '../lib/scanner/engine';
import { parseYaml, sanitizeYamlSource } from '../lib/scanner/utils';
import { 
  generateInfrastructure, 
  generateWeakPoints, 
  generateAttackPaths, 
  generateRecommendations,
  generateMisconfigurations
} from '../lib/scanner/intelligence';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SAMPLE_YAML = `apiVersion: v1
kind: Pod
metadata:
  name: insecure-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    securityContext:
      privileged: true
    env:
    - name: DB_PASS
      value: "secret_password_123"
    - name: STRIPE_KEY
      value: "sk_test_4eC39HqLyjWDarjtT1zdp7dc"
    - name: GOOGLE_MAPS
      value: "AIzaSyAs7W8_mR4W5iJmXvS9G0K2L4P6Q8R7S1"`;

export const YAMLAnalyzer: React.FC = () => {
  const yaml = useScanStore((state) => state.yamlSource);
  const setYaml = useScanStore((state) => state.setYamlSource);
  const scanData = useScanStore((state) => state.scanData);
  const setScanData = useScanStore((state) => state.setScanData);
  const clearScanData = useScanStore((state) => state.clearScanData);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const sourceInfo = useScanStore((state) => state.sourceInfo);

  const results = (scanData?.misconfigurations || []) as any[];
  const fileName = scanData?.fileName || '';
  const hasScanned = scanData !== null;

  // Auto-analyze if loaded from cluster
  useEffect(() => {
    if (yaml && sourceInfo && !hasScanned && !isAnalyzing) {
      handleAnalyze();
    }
  }, [yaml, sourceInfo, hasScanned]);

  const handleAnalyze = (content?: string) => {
    let yamlToAnalyze = (content !== undefined ? content : yaml) || '';
    if (!yamlToAnalyze.trim()) return;
    
    // Auto-sanitize common Python-polluted YAML from cluster extracts
    const sanitized = sanitizeYamlSource(yamlToAnalyze);
    if (sanitized !== yamlToAnalyze) {
      yamlToAnalyze = sanitized;
      setYaml(sanitized);
    }
    
    setIsAnalyzing(true);
    if (content !== undefined) setYaml(content);
    
    // Execute production-grade scanner
    setTimeout(() => {
      const { findings } = scanManifest(yamlToAnalyze);
      const { score: riskScore, riskLevel } = getRiskScore(findings);
      const resources = parseYaml(yamlToAnalyze);
      
      const infra = generateInfrastructure(resources);
      const misconfigurations = generateMisconfigurations(findings);
      const weakPoints = generateWeakPoints(findings);
      const attackPaths = generateAttackPaths(findings, resources);
      const recommendations = generateRecommendations(findings);
      
      const globalData: ScanData = {
        findings,
        misconfigurations,
        weakPoints,
        riskScore,
        riskLevel,
        attackPaths,
        recommendations,
        infrastructure: {
          nodes: infra.nodes.length,
          pods: infra.nodes.filter(n => n.type === 'pod').length,
          services: infra.nodes.filter(n => n.type === 'service').length,
          findings: findings.length,
          graphNodes: infra.nodes,
          graphEdges: infra.edges
        },
        timestamp: new Date().toISOString(),
        fileName: fileName || 'manual_input.yaml',
        rawYaml: yamlToAnalyze
      };

      setScanData(globalData);
      setIsAnalyzing(false);

      // Auto-navigate to Dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1500);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setYaml(content);
      handleAnalyze(content);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleLoadSample = () => {
    setYaml(SAMPLE_YAML);
    setScanData(null);
  };

  const handleLoadFromCluster = async () => {
    setIsAnalyzing(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${API_BASE_URL}/cluster/yaml`);
      if (!response.ok) throw new Error('Failed to fetch cluster YAML');
      
      const data = await response.json();
      if (data.yaml) {
        setYaml(data.yaml);
        setScanData(null);
      } else {
        alert("No pods found in the cluster (excluding kube-system).");
      }
    } catch (err) {
      console.error('Cluster fetch error:', err);
      alert("Error connecting to cluster. Ensure KubeShield backend is running and cluster is reachable.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">YAML Manifest Scanner</h1>
          <p className="text-gray-400 font-mono tracking-tight text-sm uppercase">Analyze infrastructure-as-code for security violations</p>
        </div>
        <div className="flex items-center gap-3">
           <input 
             type="file"
             ref={fileInputRef}
             onChange={handleFileChange}
             accept=".yaml,.yml"
             className="hidden"
           />
           <button 
             onClick={handleImportClick}
             className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl font-bold text-sm hover:text-white transition-all flex items-center gap-2"
           >
             <Upload className="w-4 h-4" />
             Import YAML
           </button>
           <button 
             onClick={handleLoadSample}
             className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl font-bold text-sm hover:text-white transition-all flex items-center gap-2"
           >
             <FileCode className="w-4 h-4" />
             Load Template
           </button>
           <button 
             onClick={handleLoadFromCluster}
             disabled={isAnalyzing}
             className="px-4 py-2 bg-gray-900 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
           >
             <CloudIcon className={cn("w-4 h-4", isAnalyzing && "animate-pulse")} />
             Load From Cluster
           </button>
           <button 
             onClick={() => handleAnalyze()}
             disabled={isAnalyzing || !yaml}
             className="px-4 py-2 bg-cyan-500 text-black rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 transition-all flex items-center gap-2 disabled:opacity-50"
           >
             {isAnalyzing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
             {isAnalyzing ? 'Scanning...' : 'Analyze Manifest'}
           </button>
        </div>
      </div>

       <div className="flex-1 flex gap-6 overflow-hidden">
          <Card className="flex-1 flex flex-col border-gray-800/50 bg-black/60 shadow-2xl relative overflow-hidden h-full">
             <CardHeader className="py-4 border-b border-gray-800 bg-gray-900/20 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Input Manifest / YAML Source</span>
                       {sourceInfo && (
                          <Badge variant="info" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 py-0.5 px-2 text-[10px]">
                             {sourceInfo}
                          </Badge>
                       )}
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           clearScanData();
                         }} 
                         className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white transition-all"
                         title="Clear all"
                       >
                          <RotateCcw className="w-4 h-4" />
                       </button>
                    </div>
                </div>
             </CardHeader>
             <CardContent className="flex-1 p-0 overflow-hidden z-10 relative">
                <textarea 
                  value={yaml}
                  onChange={(e) => setYaml(e.target.value)}
                  placeholder="Paste your Kubernetes YAML here..."
                  className="w-full h-full bg-transparent p-6 font-mono text-sm leading-relaxed text-cyan-400 focus:outline-none resize-none custom-scrollbar placeholder:text-gray-800"
                />
             </CardContent>
          </Card>

          <div className="w-[400px] flex flex-col gap-6 overflow-hidden">
             <Card className="flex-1 border-gray-800/50 bg-black/60 shadow-2xl overflow-hidden flex flex-col">
                <CardHeader className="bg-gray-900/40 py-4 border-b border-gray-800 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight">Security Findings</h3>
                   </div>
                   {results.length > 0 && <Badge variant="critical">{results.length} ISSUES</Badge>}
                </CardHeader>
                 <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {!isAnalyzing && !hasScanned && results.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-8">
                         <AlertTriangle className="w-12 h-12 text-gray-600 mb-4" />
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-loose">No scan results. Paste manifest and execute analysis.</p>
                      </div>
                    )}
                    {!isAnalyzing && hasScanned && results.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                         <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 ring-1 ring-emerald-500/30">
                            <ShieldAlert className="w-8 h-8 text-emerald-400" />
                         </div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-2">Manifest Secure</h4>
                         <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">No critical security vulnerabilities or misconfigurations detected in this manifest.</p>
                      </div>
                    )}
                   {results.map((issue: any, i) => (
                     <div key={i} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-red-500/30 transition-all group animate-in slide-in-from-right-4">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-black px-2 py-0.5 rounded border border-gray-800 truncate max-w-[180px]" title={issue.path}>{issue.path}</span>
                           <Badge variant={issue.severity}>{issue.severity}</Badge>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors mb-1">{issue.type}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{issue.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-800">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 capitalize mb-1">Recommended Fix</div>
                           <code className="block p-2 bg-black rounded text-[10px] text-emerald-400 font-mono">{issue.fix}</code>
                        </div>
                     </div>
                   ))}
                </CardContent>
             </Card>
          </div>
       </div>
    </div>
  );
};
