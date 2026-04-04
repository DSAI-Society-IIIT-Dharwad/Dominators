import { create } from 'zustand';
import { Finding } from '../lib/scanner/types';

export interface Misconfiguration {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  fix: string;
  category: string;
  path: string;
}

export interface WeakPoint {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
}

export interface AttackPath {
  id: string;
  source: string;
  target: string;
  description: string;
  threatLevel: 'high' | 'medium' | 'low';
}

export interface Recommendation {
  id: string;
  title: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

export interface ScanData {
  findings: Finding[];
  misconfigurations: Misconfiguration[];
  weakPoints: WeakPoint[];
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  attackPaths: AttackPath[];
  recommendations: Recommendation[];
  infrastructure: {
    nodes: number;
    pods: number;
    services: number;
    findings: number;
    graphNodes: { id: string; name: string; type: 'pod' | 'service' | 'secret' | 'node' | 'loadbalancer'; status: string }[];
    graphEdges: { id: string; source: string; target: string; label: string }[];
  };
  timestamp: string;
  fileName: string;
  rawYaml: string;
}

interface ScanStore {
  scanData: ScanData | null;
  yamlSource: string;
  setScanData: (data: ScanData | null) => void;
  setYamlSource: (yaml: string) => void;
  clearScanData: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  scanData: null,
  yamlSource: '',
  setScanData: (data) => set({ scanData: data }),
  setYamlSource: (yaml) => set({ yamlSource: yaml }),
  clearScanData: () => set({ scanData: null, yamlSource: '' }),
}));
