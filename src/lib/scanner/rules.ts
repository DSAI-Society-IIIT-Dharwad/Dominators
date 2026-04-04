import { Rule } from './types.ts';
import { getAllContainers } from './utils.ts';

export const securityRules: Rule[] = [
  {
    id: 'PRIVILEGED_CONTAINER',
    description: 'Privileged containers detected',
    severity: 'HIGH',
    check: (resource) => 
      getAllContainers(resource).some(c => c?.securityContext?.privileged === true),
    recommendation: 'Remove privileged: true from the container securityContext to prevent host node compromise.'
  },
  {
    id: 'RUN_AS_ROOT',
    description: 'Containers running as root (user 0) detected',
    severity: 'HIGH',
    check: (resource) => {
      const containerCtx = getAllContainers(resource).some(c => c?.securityContext?.runAsUser === 0);
      const podCtx = resource?.spec?.securityContext?.runAsUser === 0 || 
                    resource?.spec?.template?.spec?.securityContext?.runAsUser === 0;
      return containerCtx || podCtx;
    },
    recommendation: 'Specify a non-root user (runAsUser > 0) in the securityContext.'
  },
  {
    id: 'ALLOW_PRIVILEGE_ESCALATION',
    description: 'Allowing privilege escalation detected',
    severity: 'MEDIUM',
    check: (resource) => 
      getAllContainers(resource).some(c => c?.securityContext?.allowPrivilegeEscalation !== false),
    recommendation: 'Explicitly set allowPrivilegeEscalation: false in the securityContext.'
  },
  {
    id: 'HOST_NETWORK',
    description: 'Host network access enabled',
    severity: 'HIGH',
    check: (resource) => 
      resource?.spec?.hostNetwork === true || resource?.spec?.template?.spec?.hostNetwork === true,
    recommendation: 'Disable hostNetwork to isolate the pod from the host network namespace.'
  },
  {
    id: 'MISSING_RESOURCE_LIMITS',
    description: 'Container CPU or Memory limits missing',
    severity: 'MEDIUM',
    check: (resource) => {
      const containers = getAllContainers(resource);
      if (containers.length === 0) return false;
      return containers.some(c => !c?.resources?.limits?.cpu || !c?.resources?.limits?.memory);
    },
    recommendation: 'Define resource.limits for both CPU and Memory to prevent resource exhaustion attacks.'
  },
  {
    id: 'DANGEROUS_CAPABILITIES',
    description: 'Dangerous Linux capabilities (NET_ADMIN, SYS_ADMIN) detected',
    severity: 'HIGH',
    check: (resource) => {
      const dangerous = ['NET_ADMIN', 'SYS_ADMIN', 'NET_RAW'];
      return getAllContainers(resource).some(c => 
        c?.securityContext?.capabilities?.add?.some((cap: string) => dangerous.includes(cap))
      );
    },
    recommendation: 'Drop all capabilities and only add those strictly necessary for the application.'
  },
  {
    id: 'LATEST_IMAGE_TAG',
    description: 'Using "latest" image tag or missing tag',
    severity: 'MEDIUM',
    check: (resource) => 
      getAllContainers(resource).some(c => {
        const image = c?.image || '';
        return image.includes(':latest') || !image.includes(':');
      }),
    recommendation: 'Use specific, immutable image tags (e.g., v1.2.3 or SHA) instead of "latest".'
  },
  {
    id: 'WRITABLE_ROOT_FS',
    description: 'Read-only root filesystem not enabled',
    severity: 'LOW',
    check: (resource) => {
      const containers = getAllContainers(resource);
      if (containers.length === 0) return false;
      return containers.some(c => c?.securityContext?.readOnlyRootFilesystem !== true);
    },
    recommendation: 'Set readOnlyRootFilesystem: true to prevent persistent malware on the container filesystem.'
  },
  {
    id: 'MISSING_SECURITY_CONTEXT',
    description: 'No securityContext defined for pod or container',
    severity: 'MEDIUM',
    check: (resource) => {
      const podCtx = resource?.spec?.securityContext || resource?.spec?.template?.spec?.securityContext;
      const containers = getAllContainers(resource);
      if (containers.length === 0) return false;
      const allContainersHaveCtx = containers.every(c => c?.securityContext);
      return !podCtx && !allContainersHaveCtx;
    },
    recommendation: 'Implement a comprehensive securityContext at both the Pod and Container levels.'
  },
  {
    id: 'LB_SERVICE_EXPOSURE',
    description: 'Service type LoadBalancer detected (public exposure risk)',
    severity: 'LOW',
    resourceTypes: ['Service'],
    check: (resource) => 
      resource?.kind === 'Service' && resource?.spec?.type === 'LoadBalancer',
    recommendation: 'Ensure LoadBalancer services are restricted by security groups or use Ingress controllers.'
  }
];
