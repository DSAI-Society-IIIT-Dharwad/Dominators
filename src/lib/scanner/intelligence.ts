import { Finding } from './types.ts';
import { getMetadata } from './utils.ts';
import { WeakPoint, AttackPath, Recommendation, Misconfiguration } from '../../store/useScanStore';

/**
 * Generate infrastructure nodes and edges from parsed resources.
 */
export const generateInfrastructure = (resources: any[]) => {
  const nodes: { id: string; name: string; type: 'pod' | 'service' | 'secret' | 'node' | 'loadbalancer'; status: string }[] = [];
  const edges: { id: string; source: string; target: string; label: string }[] = [];

  resources.forEach((res) => {
    const meta = getMetadata(res);
    const id = `${meta.kind}-${meta.name}`.toLowerCase();
    
    // Map K8s Kind to our UI Node Types
    let type: any = 'node';
    if (meta.kind === 'Pod' || meta.kind === 'Deployment' || meta.kind === 'StatefulSet') type = 'pod';
    else if (meta.kind === 'Service') type = 'service';
    else if (meta.kind === 'Secret') type = 'secret';
    else if (meta.kind === 'Ingress') type = 'loadbalancer';

    nodes.push({
      id,
      name: meta.name,
      type,
      status: 'active'
    });

    // Simple relationship inference: Service -> Pods
    if (res.kind === 'Service' && res.spec?.selector) {
      const selector = res.spec.selector;
      resources.forEach(target => {
        const targetMeta = getMetadata(target);
        const targetId = `${targetMeta.kind}-${targetMeta.name}`.toLowerCase();
        
        if (target.kind === 'Pod' || target.spec?.template?.metadata?.labels) {
          const labels = target.kind === 'Pod' ? target.metadata?.labels : target.spec?.template?.metadata?.labels;
          if (labels) {
            const matches = Object.entries(selector).every(([k, v]) => labels[k] === v);
            if (matches) {
              edges.push({
                id: `edge-${id}-${targetId}`,
                source: id,
                target: targetId,
                label: 'routes-to'
              });
            }
          }
        }
      });
    }
  });

  return { nodes, edges };
};

/**
 * Generate misconfigurations from findings.
 */
export const generateMisconfigurations = (findings: Finding[]): Misconfiguration[] => {
  return findings.map(f => ({
    id: f.id,
    title: f.message,
    severity: f.severity.toLowerCase() as any,
    description: f.message,
    fix: f.recommendation,
    category: f.id.includes('NETWORK') ? 'Network' : 'Security Context',
    path: `${f.resource.kind}/${f.resource.name}`
  }));
};

/**
 * Generate weak points with resource hotspots.
 */
export const generateWeakPoints = (findings: Finding[]): WeakPoint[] => {
  const categories = new Map<string, { findings: Finding[], resources: Set<string> }>();

  findings.forEach(f => {
    let cat = 'Security Configuration';
    if (f.id.includes('PRIVILEGE') || f.id.includes('ROOT')) cat = 'Privilege Escalation';
    if (f.id.includes('NETWORK') || f.id.includes('SERVICE')) cat = 'Network Exposure';
    if (f.id.includes('RESOURCE')) cat = 'Resource Exhaustion';
    if (f.id.includes('CAPABILITIES')) cat = 'System Access';

    if (!categories.has(cat)) {
      categories.set(cat, { findings: [], resources: new Set() });
    }
    const entry = categories.get(cat)!;
    entry.findings.push(f);
    entry.resources.add(`${f.resource.kind}/${f.resource.name}`);
  });

  return Array.from(categories.entries()).map(([cat, data], idx) => {
    const highestSeverity = data.findings.some(f => f.severity === 'HIGH') ? 'high' : 
                            data.findings.some(f => f.severity === 'MEDIUM') ? 'medium' : 'low';
    
    return {
      id: `wp-${idx + 1}`,
      title: cat,
      severity: highestSeverity,
      description: `Detected ${data.findings.length} vulnerabilities related to ${cat.toLowerCase()} across ${data.resources.size} resources.`,
      impact: `Affected resources: ${Array.from(data.resources).join(', ')}`
    };
  });
};

/**
 * Generate logical attack paths from findings and resources.
 */
export const generateAttackPaths = (findings: Finding[], resources: any[]): AttackPath[] => {
  const paths: AttackPath[] = [];
  
  // Add a default entry point
  paths.push({
    id: 'ap-entry',
    source: 'External Internet',
    target: 'Cluster Ingress',
    description: 'Attack starts from external network scanning public endpoints.',
    threatLevel: 'low'
  });

  // Rule 1: Service Exposure -> Target Resource
  const services = resources.filter(r => r.kind === 'Service');
  services.forEach(svc => {
    const meta = getMetadata(svc);
    const svcId = `${meta.kind}-${meta.name}`.toLowerCase();
    
    if (svc.spec?.type === 'LoadBalancer' || svc.spec?.type === 'NodePort') {
      paths.push({
        id: `ap-ingress-${svcId}`,
        source: 'Cluster Ingress',
        target: svcId,
        description: `Service ${meta.name} is exposed via ${svc.spec.type}.`,
        threatLevel: 'medium'
      });
    }
  });

  // Rule 2: Privileged Container -> Node Escape
  findings.filter(f => f.id === 'PRIVILEGED_CONTAINER').forEach(f => {
    const targetId = `${f.resource.kind}-${f.resource.name}`.toLowerCase();
    paths.push({
      id: `ap-escape-${targetId}`,
      source: targetId,
      target: 'Host Node',
      description: 'Privileged container allows for full host namespace breakout.',
      threatLevel: 'high'
    });
  });

  // Rule 3: Host Network -> Node Network
  findings.filter(f => f.id === 'HOST_NETWORK').forEach(f => {
    const targetId = `${f.resource.kind}-${f.resource.name}`.toLowerCase();
    paths.push({
      id: `ap-net-escape-${targetId}`,
      source: targetId,
      target: 'Host Network',
      description: 'Host network access allows sniffing host-level traffic.',
      threatLevel: 'high'
    });
  });

  return paths;
};

/**
 * Generate unique recommendations from findings.
 */
export const generateRecommendations = (findings: Finding[]): Recommendation[] => {
  const seen = new Set<string>();
  const recs: Recommendation[] = [];

  findings.forEach(f => {
    if (!seen.has(f.id)) {
      seen.add(f.id);
      recs.push({
        id: `rec-${f.id}`,
        title: f.message,
        action: f.recommendation,
        priority: f.severity.toLowerCase() as any,
        impact: `Reduces exploit surface for ${f.id.toLowerCase().replace(/_/g, ' ')} attacks.`
      });
    }
  });

  return recs;
};
