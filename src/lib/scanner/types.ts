export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ResourceInfo {
  kind: string;
  name: string;
  namespace: string;
}

export interface Finding {
  id: string;
  severity: Severity;
  message: string;
  resource: ResourceInfo;
  recommendation: string;
}

export interface ScannerResult {
  findings: Finding[];
}

export interface RiskScore {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Rule {
  id: string;
  description: string;
  severity: Severity;
  resourceTypes?: string[];
  check: (resource: any) => boolean;
  recommendation: string;
}
