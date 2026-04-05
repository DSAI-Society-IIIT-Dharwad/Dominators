from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from kubernetes_service import KubernetesService
from schemas import (
    PodInfo, 
    DeploymentInfo, 
    ScanResult, 
    YamlScanRequest, 
    YamlScanResponse,
    ClusterScanResponse
)
from typing import List
import yaml
import asyncio
from datetime import datetime
from ai_engine import ai_engine

app = FastAPI(title="KubeShield API", description="Live & YAML Kubernetes Security Monitoring")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Kubernetes Service
try:
    k8s_service = KubernetesService()
except Exception as e:
    print(f"Error connecting to Kubernetes: {e}")
    k8s_service = None

# Global In-Memory Cache for live scans
latest_cluster_scan = {
    "mode": "CLUSTER_SCAN",
    "timestamp": datetime.now().isoformat(),
    "last_scan_time": "Scanning initialization...",
    "total_pods_scanned": 0,
    "summary": {"total_resources": 0, "high": 0, "medium": 0, "low": 0},
    "findings": []
}

async def cluster_scan_task():
    """Background task to scan the cluster every 10 seconds."""
    global latest_cluster_scan
    while True:
        if k8s_service:
            try:
                # Reuse existing scanning logic
                result = k8s_service.scan_live_cluster()
                if result:
                    latest_cluster_scan = {
                        "mode": "CLUSTER_SCAN",
                        "timestamp": datetime.now().isoformat(),
                        "last_scan_time": datetime.now().isoformat(),
                        "total_pods_scanned": result["total_pods_scanned"],
                        "summary": result["summary"],
                        "findings": result["findings"]
                    }
            except Exception as e:
                print(f"Background Scan Error: {e}")
        await asyncio.sleep(10)

@app.on_event("startup")
async def startup_event():
    # Load AI model weights in background
    asyncio.create_task(ai_engine.load_weights())
    # Start the background cluster scanner
    asyncio.create_task(cluster_scan_task())

@app.get("/")
async def root():
    return {"message": "KubeShield Backend is running"}

@app.get("/pods", response_model=List[PodInfo])
async def list_pods():
    if not k8s_service:
        raise HTTPException(status_code=503, detail="Kubernetes connection not available")
    try:
        return k8s_service.get_all_pods()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/deployments", response_model=List[DeploymentInfo])
async def list_deployments():
    if not k8s_service:
        raise HTTPException(status_code=503, detail="Kubernetes connection not available")
    try:
        return k8s_service.get_all_deployments()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scan", response_model=ScanResult)
async def scan_cluster_legacy():
    """Legacy manual scan endpoint."""
    if not k8s_service:
        raise HTTPException(status_code=503, detail="Kubernetes connection not available")
    try:
        result = k8s_service.scan_cluster()
        if not result:
            raise HTTPException(status_code=503, detail="Cluster scan unavailable")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scan/live", response_model=ClusterScanResponse)
async def get_live_scan():
    """Returns the latest cached cluster scan results instantly."""
    return latest_cluster_scan

@app.post("/scan/yaml", response_model=YamlScanResponse)
async def scan_yaml(request: YamlScanRequest):
    try:
        # Run standard deterministic scanner
        result = k8s_service.scan_yaml(request.yaml_content)
        
        # Run AI/ML heuristic analysis 
        ai_analysis = await ai_engine.analyze_manifest(request.yaml_content)
        
        # Merge results
        result_dict = result.dict()
        result_dict["ai_analysis"] = ai_analysis
        
        return result_dict
    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail=f"Invalid YAML manifest: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#this is new feature
@app.get("/cluster/yaml")
async def get_cluster_yaml():
    """Returns all non-system pod manifests from the cluster in YAML format."""
    if not k8s_service:
        raise HTTPException(status_code=503, detail="Kubernetes connection not available")
    try:
        yaml_content = k8s_service.get_cluster_yaml()
        return {
            "yaml": yaml_content,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cluster/resource-yaml")
async def get_resource_yaml(name: str, namespace: str, kind: str = None):
    """Returns a specific resource manifest in YAML format."""
    if not k8s_service:
        raise HTTPException(status_code=503, detail="Kubernetes connection not available")
    try:
        yaml_content = k8s_service.get_single_resource_yaml(name, namespace, kind)
        if not yaml_content:
            return None
        return {
            "yaml": yaml_content,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
