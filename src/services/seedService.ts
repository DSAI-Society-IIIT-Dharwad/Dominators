import { 
  collection, 
  addDoc, 
  getDocs, 
  writeBatch, 
  doc 
} from "firebase/firestore";
import { db } from "../lib/firebase";

const resources = [
  { name: 'Worker Node 01', type: 'node', risk: 'low', namespace: 'kube-system', labels: { role: 'worker' }, status: 'Healthy' },
  { name: 'Worker Node 02', type: 'node', risk: 'medium', namespace: 'kube-system', labels: { role: 'worker' }, status: 'Warning' },
  { name: 'Payment Gateway', type: 'service', risk: 'low', namespace: 'production', labels: { app: 'payments' }, status: 'Healthy' },
  { name: 'Frontend UI', type: 'service', risk: 'low', namespace: 'production', labels: { app: 'frontend' }, status: 'Healthy' },
  { name: 'pay-pod-01', type: 'pod', risk: 'low', namespace: 'production', labels: { app: 'payments' }, status: 'Healthy' },
  { name: 'pay-pod-02', type: 'pod', risk: 'low', namespace: 'production', labels: { app: 'payments' }, status: 'Healthy' },
  { name: 'ui-pod-01', type: 'pod', risk: 'critical', namespace: 'production', labels: { app: 'frontend' }, status: 'Failed' },
  { name: 'ui-pod-02', type: 'pod', risk: 'low', namespace: 'production', labels: { app: 'frontend' }, status: 'Healthy' },
  { name: 'db-secret', type: 'secret', risk: 'critical', namespace: 'production', labels: { type: 'credentials' }, status: 'Critical' },
];

const vulnerabilities = [
  { title: 'Privileged Container', severity: 'critical', category: 'Configuration', resourceId: 'ui-pod-01', description: 'Container is running with privileged access to the host.', fix: 'Set privileged: false', timestamp: new Date(Date.now() - 120000) },
  { title: 'Outdated Nginx', severity: 'high', category: 'Vulnerability', resourceId: 'frontend-service', description: 'Nginx version 1.14.2 has 12 known CVEs.', fix: 'Update to nginx:latest', timestamp: new Date(Date.now() - 900000) },
  { title: 'HostPath Mount', severity: 'medium', category: 'Security', resourceId: 'pay-pod-01', description: 'Pod mounts host system directory.', fix: 'Use persistent volume claim', timestamp: new Date(Date.now() - 3600000) },
  { title: 'Insecure Registry', severity: 'low', category: 'Compliance', resourceId: 'ui-pod-02', description: 'Image pulled from untrusted registry.', fix: 'Use private secure registry', timestamp: new Date(Date.now() - 10800000) },
];

const riskTrend = [
  { name: 'Mon', score: 45, timestamp: new Date(Date.now() - 6 * 86400000) },
  { name: 'Tue', score: 52, timestamp: new Date(Date.now() - 5 * 86400000) },
  { name: 'Wed', score: 48, timestamp: new Date(Date.now() - 4 * 86400000) },
  { name: 'Thu', score: 61, timestamp: new Date(Date.now() - 3 * 86400000) },
  { name: 'Fri', score: 55, timestamp: new Date(Date.now() - 2 * 86400000) },
  { name: 'Sat', score: 42, timestamp: new Date(Date.now() - 1 * 86400000) },
  { name: 'Sun', score: 38, timestamp: new Date() },
];

const attackPaths = [
  { source: 'lb-1', target: 'ui-pod-01', type: 'ingress', label: 'Public Ingress', animated: true },
  { source: 'ui-pod-01', target: 'worker-node-01', type: 'escalation', label: 'Privilege Escalation', animated: true },
  { source: 'worker-node-01', target: 'db-secret', type: 'breach', label: 'Credential Theft', animated: true },
];

const recommendations = [
  { title: 'Network Policies', category: 'Network', effort: 'Medium', impact: 'High', description: 'Restrict pod-to-pod communication.' },
  { title: 'Secret Encryption', category: 'Data', effort: 'Low', impact: 'Critical', description: 'Encrypt etcd secrets at rest.' },
  { title: 'RBAC Review', category: 'Access', effort: 'High', impact: 'Medium', description: 'Identify overprivileged service accounts.' },
];

export async function seedClusterData() {
  console.log('Starting Firestore seeding...');
  
  try {
    const batch = writeBatch(db);

    // Seed Resources
    for (const res of resources) {
      const docRef = doc(collection(db, 'resources'));
      batch.set(docRef, res);
    }

    // Seed Vulnerabilities
    for (const vuln of vulnerabilities) {
      const docRef = doc(collection(db, 'vulnerabilities'));
      batch.set(docRef, vuln);
    }

    // Seed Risk Trend
    for (const trend of riskTrend) {
      const docRef = doc(collection(db, 'riskTrend'));
      batch.set(docRef, trend);
    }

    // Seed Attack Paths
    for (const path of attackPaths) {
      const docRef = doc(collection(db, 'attackPaths'));
      batch.set(docRef, path);
    }

    // Seed Recommendations
    for (const rec of recommendations) {
      const docRef = doc(collection(db, 'recommendations'));
      batch.set(docRef, rec);
    }

    await batch.commit();
    console.log('Firestore seeding completed successfully.');
    return true;
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    throw error;
  }
}

export async function isFirestoreEmpty() {
  const q = collection(db, 'resources');
  const snapshot = await getDocs(q);
  return snapshot.empty;
}
