import { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap, 
  Connection, 
  Edge, 
  Node,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Shield, 
  Activity,
  AlertTriangle,
  Search,
  Info,
  Box,
  Database,
  Key,
  Terminal,
  ArrowRight,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PodNode, ServiceNode, SecretNode, ClusterNode, LoadBalancerNode } from '../components/dashboard/FlowNodes';
import { useScanStore } from '../store/useScanStore';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  pod: PodNode,
  service: ServiceNode,
  secret: SecretNode,
  node: ClusterNode,
  loadbalancer: LoadBalancerNode,
};

export const AttackPaths: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const isEmpty = !scanData;

  const dbNodes = useMemo(() => {
    if (!scanData) return [];
    
    // Virtual nodes for attack representation
    const virtualNodes = [
      { id: 'external internet', name: 'External Internet', type: 'loadbalancer', risk: 'low', position: { x: 0, y: 0 } },
      { id: 'host node', name: 'Host Node', type: 'node', risk: 'critical', position: { x: 1000, y: 300 } },
      { id: 'cluster ingress', name: 'Cluster Ingress', type: 'loadbalancer', risk: 'medium', position: { x: 250, y: 0 } },
      { id: 'kube-api server', name: 'Kube-API Server', type: 'node', risk: 'critical', position: { x: 800, y: -100 } },
      { id: 'sensitive credentials', name: 'Sensitive Credentials', type: 'secret', risk: 'critical', position: { x: 1000, y: 0 } }
    ];

    const realNodes = scanData.infrastructure.graphNodes.map((n, i) => {
      const hasHighRisk = scanData.misconfigurations.some(m => m.path.includes(n.name) && m.severity === 'high');
      return {
        id: n.id,
        name: n.name,
        type: n.type,
        risk: hasHighRisk ? 'critical' : 'medium',
        issues: scanData.misconfigurations.filter(m => m.path.includes(n.name)).map(m => m.title),
        position: { x: 500, y: i * 150 }
      };
    });

    return [...virtualNodes, ...realNodes];
  }, [scanData]);

  const dbEdges = useMemo(() => {
    if (!scanData) return [];
    return scanData.attackPaths.map(ap => ({
      id: ap.id,
      source: ap.source.toLowerCase(),
      target: ap.target.toLowerCase(),
      label: ap.description,
      animated: true,
      color: ap.threatLevel === 'high' ? '#ef4444' : '#eab308'
    }));
  }, [scanData]);

  // Map data to React Flow format
  const initialNodes: Node[] = useMemo(() => dbNodes.map((n: any) => ({
    id: n.id,
    type: n.type,
    data: { 
      label: n.name, 
      risk: n.risk,
      issues: n.issues || [],
      permissions: n.permissions || []
    },
    position: n.position || { x: 0, y: 150 },
  })), [dbNodes]);

  const initialEdges: Edge[] = useMemo(() => dbEdges.map((e: any) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: e.animated,
    style: { stroke: e.color || '#ef4444', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: e.color || '#ef4444' },
    label: e.label
  })), [dbEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when scanData changes
  useState(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  });

  const onConnect = useCallback((params: Connection) => setEdges((eds: any) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

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
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex gap-6 relative">
      <div className="flex-1 rounded-2xl overflow-hidden border border-gray-800 bg-black/40 backdrop-blur-md relative group">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          className="bg-black/20"
        >
          <Background color="#1f2937" gap={20} size={1} />
          <Controls className="bg-black border border-gray-800" />
          <MiniMap 
            style={{ backgroundColor: '#000', border: '1px solid #1f2937'}} 
            nodeColor={(n) => n.data?.risk === 'critical' ? '#ef4444' : '#22d3ee'}
            maskColor="rgba(0,0,0,0.8)"
          />

          <Panel position="top-left" className="bg-black/60 backdrop-blur-md border border-gray-800 p-4 rounded-xl m-4 flex items-center gap-4 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">Active Attack Vector</h2>
                <p className="text-[10px] text-gray-500 font-mono">SCENARIO: LIVE_SNAPSHOT_MONITOR</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-800/50 mx-2" />
            <div className="flex items-center gap-2">
                <Badge variant="critical">{dbNodes.filter((n:any) => n.risk === 'critical').length} At Risk</Badge>
                <Badge variant="info">{dbEdges.length} Paths</Badge>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-96 shrink-0 z-20"
          >
            <Card className="h-full border-cyan-500/30 overflow-visible relative">
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute -left-3 top-6 w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <X className="w-4 h-4 stroke-[3px]" />
              </button>

              <CardHeader className="bg-gradient-to-br from-cyan-900/10 to-transparent border-b border-gray-800/50 pb-8 pt-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-2xl bg-black border border-gray-800 shadow-[0_0_20px_rgba(34,211,238,0.3)]`}>
                    {selectedNode.type === 'pod' && <Box className="text-cyan-400" />}
                    {selectedNode.type === 'loadbalancer' && <Activity className="text-cyan-400" />}
                    {selectedNode.type === 'service' && <Database className="text-cyan-400" />}
                    {selectedNode.type === 'secret' && <Key className="text-cyan-400" />}
                    {selectedNode.type === 'node' && <Terminal className="text-cyan-400" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">{selectedNode.data.label}</h3>
                    <Badge variant={selectedNode.data.risk} className="mt-1">{selectedNode.data.risk} Severity</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6 overflow-y-auto max-h-[calc(100vh-25rem)] custom-scrollbar">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        THREAT ANALYSIS
                      </span>
                      <span className="text-[10px] bg-red-500 text-white px-2 rounded-sm font-black">REALTIME</span>
                   </div>
                   <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="bg-red-500 h-full" />
                   </div>
                   <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-widest text-center">Data Integrity: High</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Security Findings
                  </h4>
                  <div className="space-y-2">
                    {(selectedNode.data.issues && selectedNode.data.issues.length > 0 ? selectedNode.data.issues : ['No immediate vulnerabilities found']).map((issue: string, i: number) => (
                      <div key={i} className="p-3 bg-gray-900/60 rounded-lg border border-gray-800 text-sm flex items-start gap-3 group hover:border-gray-700 transition-colors">
                        <ArrowRight className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                        <span className="text-gray-300">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    RBAC Permissions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedNode.data.permissions && selectedNode.data.permissions.length > 0 ? selectedNode.data.permissions : ['Standard access']).map((perm: string, i: number) => (
                      <code key={i} className="px-2 py-1 bg-gray-900/80 border border-gray-800 rounded font-mono text-[10px] text-emerald-400">
                        {perm}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button className="w-full py-4 bg-cyan-500 text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-cyan-400 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    Isolate Resource
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
