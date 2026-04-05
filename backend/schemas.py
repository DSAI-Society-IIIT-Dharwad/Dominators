from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PodInfo(BaseModel):
    name: str
    namespace: str
    status: str
    images: List[str]

class DeploymentInfo(BaseModel):
    name: str
    namespace: str
    replicas: int
    available_replicas: int

class SecurityIssue(BaseModel):
    name: str
    namespace: str
    risk: str
    issues: List[str]

class ScanResult(BaseModel):
    timestamp: str
    summary: dict
    findings: List[SecurityIssue]

# YAML Scanner Models
class YamlScanRequest(BaseModel):
    yaml_content: str

class AIResult(BaseModel):
    model_version: str
    confidence_score: float
    inference_latency: str
    risk_assessment: str
    risk_level: str
    analyzed_at: str

class YamlFinding(BaseModel):
    name: str
    namespace: str
    kind: str
    risk: str
    issues: List[str]

class YamlSummary(BaseModel):
    total_resources: int
    high: int
    medium: int
    low: int

class YamlScanResponse(BaseModel):
    mode: str = "YAML_SCAN"
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    summary: YamlSummary
    findings: List[YamlFinding]
    ai_analysis: Optional[AIResult] = None

# Real-Time Cluster Scanner Models
class ClusterFinding(BaseModel):
    name: str
    namespace: str
    kind: str
    risk: str
    issues: List[str]

class ClusterSummary(BaseModel):
    total_resources: int
    high: int
    medium: int
    low: int

class ClusterScanResponse(BaseModel):
    mode: str = "CLUSTER_SCAN"
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    last_scan_time: str
    total_pods_scanned: int
    summary: ClusterSummary
    findings: List[ClusterFinding]
