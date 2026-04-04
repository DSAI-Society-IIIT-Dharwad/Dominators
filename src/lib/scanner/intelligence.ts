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
    else if (meta.kind === 'Secret' || meta.kind === 'ConfigMap') type = 'secret';
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

    // RBAC Subjects as Nodes
    if ((res.kind === 'ClusterRoleBinding' || res.kind === 'RoleBinding') && res.subjects) {
      res.subjects.forEach((sub: any) => {
        const subId = `${sub.kind}-${sub.name}`.toLowerCase();
        if (!nodes.find(n => n.id === subId)) {
          nodes.push({
            id: subId,
            name: sub.name,
            type: sub.kind === 'ServiceAccount' ? 'pod' : 'node',
            status: 'active'
          });
        }
        edges.push({
          id: `edge-${subId}-${id}`,
          source: subId,
          target: id,
          label: 'binds-to'
        });
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
  
  // 1. Entry Point Detection
  const hasIngress = resources.some(r => r.kind === 'Ingress');
  const publicServices = resources.filter(r => 
    r.kind === 'Service' && (r.spec?.type === 'LoadBalancer' || r.spec?.type === 'NodePort')
  );

  if (hasIngress) {
    paths.push({
      id: 'ap-external-ingress',
      source: 'External Internet',
      target: 'Cluster Ingress',
      description: 'Attack starts from external network via publicly exposed Ingress controller.',
      threatLevel: 'low'
    });
  } else if (publicServices.length > 0) {
    publicServices.forEach(svc => {
      const id = `service-${svc.metadata.name}`.toLowerCase();
      paths.push({
        id: `ap-entry-svc-${id}`,
        source: 'External Internet',
        target: id,
        description: `Direct access to ${svc.metadata.name} via ${svc.spec.type} exposure.`,
        threatLevel: 'medium'
      });
    });
  } else {
    paths.push({
      id: 'ap-entry-default',
      source: 'External Internet',
      target: 'Cluster Ingress',
      description: 'Attempting to find entry points in the cluster perimeter.',
      threatLevel: 'low'
    });
  }

  // 2. Scenario: Host Escape (Privileged + HostPath)
  findings.filter(f => f.id === 'PRIVILEGED_CONTAINER' || f.id === 'HOST_PATH_VOLUME').forEach(f => {
    const podId = `${f.resource.kind}-${f.resource.name}`.toLowerCase();
    const isEscalation = findings.some(f2 => f2.id === 'RUN_AS_ROOT' && f2.resource.name === f.resource.name);
    
    paths.push({
      id: `ap-escape-${podId}-${f.id}`,
      source: podId,
      target: 'Host Node',
      description: f.id === 'PRIVILEGED_CONTAINER' 
        ? 'Privileged container escape to host kernel.' 
        : 'HostPath mount allows direct host filesystem access.',
      threatLevel: isEscalation ? 'high' : 'medium'
    });
  });

  // 3. Scenario: Credential Exposure (Sensitive Config)
  findings.filter(f => f.id === 'SENSITIVE_CONFIG').forEach(f => {
    const resId = `${f.resource.kind}-${f.resource.name}`.toLowerCase();
    paths.push({
      id: `ap-creds-${resId}`,
      source: resId,
      target: 'Sensitive Credentials',
      description: 'Searching configuration for leaked passwords, tokens, or API keys.',
      threatLevel: 'high'
    });
  });

  // 4. Scenario: RBAC Escalation
  findings.filter(f => f.id === 'CLUSTER_ADMIN_RBAC').forEach(f => {
    // Find the actual resource to extract subjects
    const binding = resources.find(r => r.kind === f.resource.kind && r.metadata.name === f.resource.name);
    if (binding && binding.subjects) {
      binding.subjects.forEach((sub: any) => {
        const subId = `${sub.kind}-${sub.name}`.toLowerCase();
        paths.push({
          id: `ap-rbac-${subId}-${binding.metadata.name}`,
          source: subId,
          target: 'Kube-API Server',
          description: `${sub.kind}/${sub.name} leverages ${binding.roleRef.name} permissions to compromise control plane.`,
          threatLevel: 'high'
        });
      });
    }
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
