import { useState, useEffect } from 'react';

export interface ClusterFinding {
  name: string;
  namespace: string;
  kind: string;
  risk: string;
  issues: string[];
}

export interface ClusterSummary {
  total_resources: number;
  high: number;
  medium: number;
  low: number;
}

export interface ClusterScanResponse {
  mode: string;
  timestamp: string;
  last_scan_time: string;
  total_pods_scanned: number;
  summary: {
    total_resources: number;
    high: number;
    medium: number;
    low: number;
  };
  findings: ClusterFinding[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function useLiveScan() {
  const [data, setData] = useState<ClusterScanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/live`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch live scan:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScan();
    const interval = setInterval(fetchScan, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchScan };
}
