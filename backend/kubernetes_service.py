from kubernetes import client, config
import yaml
import datetime
from schemas import (
    PodInfo, 
    DeploymentInfo, 
    SecurityIssue, 
    ScanResult,
    YamlFinding,
    YamlSummary,
    YamlScanResponse,
    ClusterFinding,
    ClusterSummary
)

class KubernetesService:
    def __init__(self):
        try:
            config.load_kube_config()
        except Exception:
            try:
                config.load_incluster_config()
            except Exception:
                self.v1 = None
                self.apps_v1 = None
                return
        
        self.v1 = client.CoreV1Api()
        self.apps_v1 = client.AppsV1Api()

    def _get(self, obj, path, default=None):
        """Safe getter for both dictionaries and Kubernetes objects."""
        parts = path.split('.')
        current = obj
        for part in parts:
            if current is None:
                return default
            if isinstance(current, dict):
                current = current.get(part)
            else:
                current = getattr(current, part, None)
        return current if current is not None else default

    def _sanitize(self, obj):
        """Recursively convert K8s objects to clean dictionaries and remove None values."""
        if isinstance(obj, list):
            return [self._sanitize(i) for i in obj if i is not None]
        elif isinstance(obj, dict):
            # Clean dictionary keys and values
            return {
                k.lstrip('_'): self._sanitize(v) 
                for k, v in obj.items() 
                if v is not None and k != 'local_vars_configuration'
            }
        elif hasattr(obj, 'to_dict'):
            # Recursively sanitize the dict from K8s helper
            return self._sanitize(obj.to_dict())
        else:
            return obj

    def get_all_pods(self):
        if not self.v1: return []
        pods = self.v1.list_pod_for_all_namespaces()
        return [
            PodInfo(
                name=self._get(p, 'metadata.name'),
                namespace=self._get(p, 'metadata.namespace'),
                status=self._get(p, 'status.phase'),
                images=[self._get(c, 'image') for c in self._get(p, 'spec.containers', [])]
            ) for p in pods.items
        ]

    def get_all_deployments(self):
        if not self.apps_v1: return []
        deployments = self.apps_v1.list_deployment_for_all_namespaces()
        return [
            DeploymentInfo(
                name=self._get(d, 'metadata.name'),
                namespace=self._get(d, 'metadata.namespace'),
                replicas=self._get(d, 'spec.replicas', 0),
                available_replicas=self._get(d, 'status.available_replicas', 0)
            ) for d in deployments.items
        ]

    def scan_cluster(self):
        """Deprecated: Use scan_live_cluster for background continuous scanning."""
        if not self.v1: return None
        findings = []
        pods = self.v1.list_pod_for_all_namespaces()
        
        for pod in pods.items:
            namespace = self._get(pod, 'metadata.namespace')
            if namespace == "kube-system":
                continue
                
            issues = self._scan_resource_logic(pod, "Pod")
            risk = self._calculate_risk(issues)
                
            findings.append(SecurityIssue(
                name=self._get(pod, 'metadata.name'),
                namespace=namespace,
                risk=risk,
                issues=issues
            ))
        
        return ScanResult(
            timestamp=datetime.datetime.now().isoformat(),
            summary={
                "total_pods_scanned": len(findings),
                "high_risk": len([f for f in findings if f.risk == "HIGH"]),
                "medium_risk": len([f for f in findings if f.risk == "MEDIUM"]),
                "low_risk": len([f for f in findings if f.risk == "LOW"])
            },
            findings=findings
        )

    def scan_live_cluster(self):
        """Real-time cluster scanning logic for background tasks."""
        if not self.v1: return None
        findings = []
        
        # 1. Scan Pods
        try:
            pods = self.v1.list_pod_for_all_namespaces()
            for pod in pods.items:
                namespace = self._get(pod, 'metadata.namespace')
                if namespace == "kube-system":
                    continue
                    
                name = self._get(pod, 'metadata.name')
                issues = self._scan_resource_logic(pod, "Pod")
                risk = self._calculate_risk(issues)
                    
                findings.append(ClusterFinding(
                    name=name,
                    namespace=namespace,
                    kind="Pod",
                    risk=risk,
                    issues=issues
                ))
        except Exception as e:
            print(f"Error scanning pods: {e}")

        # 2. Scan Deployments
        try:
            deploys = self.apps_v1.list_deployment_for_all_namespaces()
            for deploy in deploys.items:
                namespace = self._get(deploy, 'metadata.namespace')
                if namespace == "kube-system":
                    continue
                    
                name = self._get(deploy, 'metadata.name')
                issues = self._scan_resource_logic(deploy, "Deployment")
                risk = self._calculate_risk(issues)
                    
                findings.append(ClusterFinding(
                    name=name,
                    namespace=namespace,
                    kind="Deployment",
                    risk=risk,
                    issues=issues
                ))
        except Exception as e:
            print(f"Error scanning deployments: {e}")
            
        summary = ClusterSummary(
            total_resources=len(findings),
            high=len([f for f in findings if f.risk == "HIGH"]),
            medium=len([f for f in findings if f.risk == "MEDIUM"]),
            low=len([f for f in findings if f.risk == "LOW"])
        )
        
        return {
            "summary": summary,
            "findings": findings,
            "total_pods_scanned": len([f for f in findings if f.kind == "Pod"]) # Rename logic or keep for compatibility
        }

    def scan_yaml(self, yaml_content):
        documents = yaml.safe_load_all(yaml_content)
        findings = []
        
        for doc in documents:
            if not doc or not isinstance(doc, dict):
                continue
                
            kind = doc.get("kind")
            if kind not in ["Pod", "Deployment"]:
                continue
                
            name = self._get(doc, "metadata.name", "unnamed")
            namespace = self._get(doc, "metadata.namespace", "default")
            
            issues = self._scan_resource_logic(doc, kind)
            risk = self._calculate_risk(issues)
            
            findings.append(YamlFinding(
                name=name,
                namespace=namespace,
                kind=kind,
                risk=risk,
                issues=issues
            ))
            
        summary = YamlSummary(
            total_resources=len(findings),
            high=len([f for f in findings if f.risk == "HIGH"]),
            medium=len([f for f in findings if f.risk == "MEDIUM"]),
            low=len([f for f in findings if f.risk == "LOW"])
        )
        
        return YamlScanResponse(
            summary=summary,
            findings=findings
        )

    def get_cluster_yaml(self):
        """Fetches up to 20 active Pod specs and returns them as a multi-document YAML string."""
        if not self.v1: return ""
        
        try:
            pods = self.v1.list_pod_for_all_namespaces()
            yaml_docs = []
            count = 0
            
            for pod in pods.items:
                if count >= 20:
                    break
                    
                namespace = self._get(pod, 'metadata.namespace')
                if namespace == "kube-system":
                    continue
                    
                # Extract clean Pod manifest structure with custom label
                pod_manifest = {
                    "apiVersion": "v1",
                    "kind": "Pod",
                    "metadata": {
                        "name": self._get(pod, 'metadata.name'),
                        "namespace": namespace,
                        "labels": { "source": "cluster" }
                    },
                    "spec": self._sanitize(self._get(pod, 'spec'))
                }
                yaml_docs.append(yaml.dump(pod_manifest, sort_keys=False))
                count += 1
                
            return "---\n".join(yaml_docs)
        except Exception as e:
            print(f"Error fetching cluster YAML: {e}")
            return ""

    def get_single_resource_yaml(self, name: str, namespace: str, kind: str = None):
        """Fetches a specific resource and returns it as a clean YAML manifest."""
        if not self.v1: return None
        if namespace == "kube-system": return None
        
        resource = None
        detected_kind = kind
        
        try:
            if not detected_kind or detected_kind.lower() == "pod":
                try:
                    resource = self.v1.read_namespaced_pod(name, namespace)
                    detected_kind = "Pod"
                except Exception:
                    if not kind: pass # Try deployment
                    else: raise
            
            if not resource and (not detected_kind or detected_kind.lower() == "deployment"):
                resource = self.apps_v1.read_namespaced_deployment(name, namespace)
                detected_kind = "Deployment"
                
            if not resource:
                return None
                
            # Clean and sanitize the manifest
            sanitized_manifest = {
                "apiVersion": "v1" if detected_kind == "Pod" else "apps/v1",
                "kind": detected_kind,
                "metadata": {
                    "name": self._get(resource, 'metadata.name'),
                    "namespace": self._get(resource, 'metadata.namespace'),
                    "labels": self._get(resource, 'metadata.labels', {})
                },
                "spec": self._sanitize(self._get(resource, 'spec'))
            }
            
            # Final cleanup of metadata (managedFields, etc.)
            sanitized_manifest['metadata'] = self._sanitize(sanitized_manifest['metadata'])
            for key in ["managedFields", "ownerReferences", "resourceVersion", "uid", "generation", "creationTimestamp"]:
                if key in sanitized_manifest["metadata"]: 
                    del sanitized_manifest["metadata"][key]
            
            return yaml.dump(sanitized_manifest, sort_keys=False)
            
        except Exception as e:
            print(f"Error fetching resource {kind} {name}/{namespace}: {e}")
            return None

    def _scan_resource_logic(self, resource, kind):
        """Unified scanning logic for both dicts and objects."""
        issues = []
        
        # Determine container path based on Kind
        if kind == "Pod":
            containers = self._get(resource, "spec.containers", [])
            pod_sc = self._get(resource, "spec.security_context")
        elif kind == "Deployment":
            containers = self._get(resource, "spec.template.spec.containers", [])
            pod_sc = self._get(resource, "spec.template.spec.security_context")
        else:
            return []

        for container in containers:
            c_name = self._get(container, "name", "unknown")
            
            # 1. Image Tag Check
            image = self._get(container, "image", "")
            if ":latest" in image or ":" not in image:
                issues.append(f"Container '{c_name}': Image uses 'latest' or no tag ({image})")
            
            # 2. Resource Limits Check
            limits = self._get(container, "resources.limits")
            if not limits:
                issues.append(f"Container '{c_name}': Missing resource limits")
                
            # 3. Root User Check
            cont_sc = self._get(container, "security_context")
            run_as_user = self._get(cont_sc, "run_as_user")
            if run_as_user is None:
                run_as_user = self._get(pod_sc, "run_as_user")
            
            if run_as_user == 0:
                issues.append(f"Container '{c_name}': Running as root (UID 0)")
                
            # 4. Privilege Escalation Check
            if self._get(cont_sc, "allow_privilege_escalation"):
                issues.append(f"Container '{c_name}': Privilege escalation enabled")
                
        return issues

    def _calculate_risk(self, issues):
        if len(issues) >= 2:
            return "HIGH"
        elif len(issues) == 1:
            return "MEDIUM"
        return "LOW"
