import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Network, 
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
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

export const InfrastructureMap: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);
  const navigate = useNavigate();

  const dbResources = useMemo(() => {
    if (!scanData) return [];
    return scanData.infrastructure.graphNodes.map((n, i) => ({
      id: n.id,
      name: n.name,
      type: n.type,
      risk: scanData.misconfigurations.some(m => m.path.toLowerCase().includes(n.name.toLowerCase()) && m.severity === 'high') ? 'critical' : 'medium',
      status: n.status,
      position: { x: 350, y: i * 150 }
    }));
  }, [scanData]);

  const initialNodes: Node[] = useMemo(() => dbResources.map((n: any, i: number) => ({
    id: n.id || `node-${i}`,
    type: n.type,
    data: { 
      label: n.name, 
      risk: n.risk,
      status: n.status
    },
    position: n.position || { x: 400, y: i * 100 },
  })), [dbResources]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(scanData?.infrastructure.graphEdges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: '#22d3ee', strokeWidth: 1 }
  })) || []);

  const isEmpty = !scanData;

  if (isEmpty) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Network className="w-12 h-12 text-gray-600 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Topology Not Mapped</h2>
        <p className="text-gray-500 max-w-sm mb-8">Logical infrastructure map requires a YAML manifest analysis. Discover nodes, pods, and services automatically from your manifest.</p>
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
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex gap-6 relative overflow-hidden">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-6 left-6 z-10 flex flex-col gap-4 pointer-events-none"
      >
        <Card className="p-4 bg-black/80 backdrop-blur-xl border-gray-800 pointer-events-auto">
           <div className="flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Logical Topology</h3>
           </div>
           <div className="space-y-2">
              <div className="flex items-center justify-between gap-6">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Scanned Manifest</span>
                 <span className="text-xs font-mono text-white truncate max-w-[100px]">{scanData.fileName}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Risk Score</span>
                 <span className={`text-xs font-mono font-bold ${scanData.riskScore > 70 ? 'text-red-500' : 'text-cyan-400'}`}>{scanData.riskScore}</span>
              </div>
           </div>
        </Card>
      </motion.div> 

      <div className="flex-1 rounded-2xl overflow-hidden border border-gray-800 bg-black/40 backdrop-blur-md relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-black/10"
        >
          <Background color="#1f2937" gap={30} size={1} />
          <Controls className="bg-black border border-gray-800" />
          <MiniMap 
            style={{ backgroundColor: '#000', border: '1px solid #1f2937'}} 
            nodeColor="#333" 
            maskColor="rgba(0,0,0,0.8)"
          />
        </ReactFlow>
      </div>
    </div>
  );
};
