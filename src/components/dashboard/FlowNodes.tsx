import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Network, Key, Server, Activity } from 'lucide-react';
import { clsx } from 'clsx';

const BaseNode = ({ 
  label, 
  icon: Icon, 
  type, 
  risk, 
  selected
}: { 
  label: string, 
  icon: any, 
  type: string, 
  risk: 'critical' | 'high' | 'medium' | 'low',
  selected?: boolean,
  id: string
}) => {
  const riskColors = {
    critical: "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-500/10",
    high: "border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)] bg-orange-500/10",
    medium: "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)] bg-yellow-500/10",
    low: "border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.2)] bg-cyan-500/10",
  };

  const riskText = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-cyan-400",
  };

  return (
    <div className={clsx(
      "px-4 py-3 rounded-xl border-2 transition-all duration-300 min-w-[180px] backdrop-blur-xl group",
      riskColors[risk],
      selected ? "ring-2 ring-white ring-offset-4 ring-offset-black scale-105" : "hover:scale-102"
    )}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-600 border-none" />
      
      <div className="flex items-center gap-3">
        <div className={clsx("p-2 rounded-lg bg-black/40", riskText[risk])}>
          <Icon size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">{type}</div>
          <div className="text-sm font-bold text-white truncate">{label}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] uppercase font-bold tracking-tight">
        <span className={riskText[risk]}>{risk} RISK</span>
        <div className="flex gap-1">
          <div className={clsx("w-1 h-3 rounded-full", risk === 'critical' ? 'bg-red-500' : 'bg-gray-800')} />
          <div className={clsx("w-1 h-3 rounded-full", ['critical', 'high'].includes(risk) ? 'bg-orange-500' : 'bg-gray-800')} />
          <div className={clsx("w-1 h-3 rounded-full", ['critical', 'high', 'medium'].includes(risk) ? 'bg-yellow-500' : 'bg-gray-800')} />
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-600 border-none" />
    </div>
  );
};

export const PodNode = memo(({ data, selected, id }: NodeProps) => (
  <BaseNode id={id} label={data.label} icon={Box} type="Pod" risk={data.risk} selected={selected} />
));

export const ServiceNode = memo(({ data, selected, id }: NodeProps) => (
  <BaseNode id={id} label={data.label} icon={Network} type="Service" risk={data.risk} selected={selected} />
));

export const SecretNode = memo(({ data, selected, id }: NodeProps) => (
  <BaseNode id={id} label={data.label} icon={Key} type="Secret" risk={data.risk} selected={selected} />
));

export const ClusterNode = memo(({ data, selected, id }: NodeProps) => (
  <BaseNode id={id} label={data.label} icon={Server} type="Node" risk={data.risk} selected={selected} />
));

export const LoadBalancerNode = memo(({ data, selected, id }: NodeProps) => (
  <BaseNode id={id} label={data.label} icon={Activity} type="LoadBalancer" risk={data.risk} selected={selected} />
));
