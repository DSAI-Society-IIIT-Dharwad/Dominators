import yaml from 'js-yaml';
import { ResourceInfo } from './types.ts';

/**
 * Safely parse multiple YAML documents.
 */
export const parseYaml = (content: string): any[] => {
  try {
    const docs = yaml.loadAll(content);
    return docs.filter(doc => doc && typeof doc === 'object');
  } catch (e) {
    console.error('YAML parsing error:', e);
    return [];
  }
};

/**
 * Extract metadata from a Kubernetes resource.
 */
export const getMetadata = (resource: any): ResourceInfo => {
  return {
    kind: resource?.kind || 'Unknown',
    name: resource?.metadata?.name || 'anonymous',
    namespace: resource?.metadata?.namespace || 'default'
  };
};

/**
 * Extract containers from a resource (Pod, Deployment, Job, etc.).
 */
export const getContainers = (resource: any): any[] => {
  // Case 1: Direct Pod
  if (resource?.kind === 'Pod') {
    return resource?.spec?.containers || [];
  }

  // Case 2: Deployment, StatefulSet, DaemonSet, Job, ReplicaSet, etc.
  if (resource?.spec?.template?.spec?.containers) {
    return resource?.spec?.template?.spec?.containers;
  }

  // Case 3: CronJob
  if (resource?.spec?.jobTemplate?.spec?.template?.spec?.containers) {
    return resource?.spec?.jobTemplate?.spec?.template?.spec?.containers;
  }

  return [];
};

/**
 * Extract initContainers from a resource.
 */
export const getInitContainers = (resource: any): any[] => {
  if (resource?.kind === 'Pod') {
    return resource?.spec?.initContainers || [];
  }

  if (resource?.spec?.template?.spec?.initContainers) {
    return resource?.spec?.template?.spec?.initContainers;
  }

  return [];
};

/**
 * Merge containers and initContainers for full coverage.
 */
export const getAllContainers = (resource: any): any[] => {
  return [...getContainers(resource), ...getInitContainers(resource)];
};
