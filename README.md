# KubeShield 🛡️

<div align="center">
  <img src="public/logo.png" alt="KubeShield Logo" width="200"/>
  <p align="center">
    <strong>Real-time Kubernetes Security Intelligence & Threat Monitoring</strong>
  </p>
</div>

---

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](#)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.11.0-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)

**KubeShield** is a comprehensive Kubernetes security platform that provides real-time observability, automated threat detection, and advanced manifest auditing. It enables security teams to visualize their cluster's security posture, identify misconfigurations in live workloads, and perform deep analysis on YAML manifests before they reach production.

## 🚀 Key Features

### 📡 Live Cluster Monitoring
Continuous, real-time security auditing of active Kubernetes workloads.
- **Background Scanning**: Automatically audits Pods and Deployments every 10 seconds for runtime risks.
- **Drill-down Analysis**: Instantly transition from a cluster-wide overview to a focused security audit of any specific resource.
- **High-Fidelity KPI Cards**: Real-time metrics for total resources, high-risk findings, and overall cluster health.

### 🔍 Smart Manifest Scanner
State-of-the-art YAML analyzer for infrastructure-as-code security.
- **Automatic Sanitization**: Seamlessly handles "corrupted" manifests containing Python-specific tags (`!!python/object`) or private fields (`_privileged`), common in raw cluster extracts.
- **Production-Grade Rule Engine**: Detects **Privileged Containers**, **Root Execution**, **Escalation Paths**, **Missing Resource Limits**, and **Sensitive Configuration leakage**.
- **Visual Attack Paths**: Visualizes lateral movement vectors and node breakout risks directly from the manifest metadata.

### 📊 Intelligent Risk Scoring
- **Dynamic Security Grade**: Get a precise 0-100 score for every manifest based on finding severity.
- **Actionable Remediation**: Every vulnerability comes with a clear explanation and a **copy-pasteable CLI fix**.
- **Interactive Infrastructure Map**: Explore a visual topology of your cluster and its internal security relationships.

### 🛡️ Predictive AI Shield (v1.0.4-stable)
Advanced heuristic threat detection powered by a custom-trained **Transformer Model**.
- **Dataset-Driven Insights**: Trained on the **Fire-Dataset (YOLO Format)** and **Historical K8s Analysis (60,000+ Records)** for high-precision anomaly detection.
- **Heuristic Threat Score**: Beyond static rules, the AI engine identifies "Sparse Manifest" anomalies and subtle privilege-escalation patterns.
- **Deep Visibility**: Real-time confidence scoring and inference latency reporting for total transparency.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for global security state.
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with **Glassmorphism** design system.
- **Visualizations**: [React Flow](https://reactflow.dev/) (Infrastructure Mapping) & [Recharts](https://recharts.org/) (Security Analytics).
- **Animations**: [Framer Motion](https://www.framer.com/motion/).

### Backend (FastAPI Core)
- **Engine**: [FastAPI](https://fastapi.tiangolo.com/) (Python) for high-performance async processing.
- **KubeClient**: [Official Kubernetes Python Library](https://github.com/kubernetes-client/python).
- **Security Logic**: Custom recursive sanitization and rule matching engine.
- **Database**: [Supabase](https://supabase.com/) & [Firebase](https://firebase.google.com/) for persistence and authentication.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- `kubectl` configured with access to a cluster or `minikube`.
- Firebase Project for authentication.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DSAI-Society-IIIT-Dharwad/Dominators.git
   cd kubeshield
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   # Configure .env with your Firebase keys
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

## 🏗️ Project Structure

```text
kubeshield/
├── backend/            # FastAPI Security Engine
│   ├── main.py         # API Endpoints & Routes
│   ├── kubernetes_service.py # K8s Client & Security Logic
│   ├── schemas.py      # Pydantic Data Models
│   └── requirements.txt
├── src/                # React Frontend
│   ├── components/     # UI Design System (Glassmorphism)
│   ├── pages/          # Dashboard, Cluster Scan, YAML Analyzer
│   ├── store/          # Zustand Security State
│   ├── lib/            # Scanner rules & Intelligence engine
│   └── hooks/          # useLiveScan & useTheme
└── public/             # Branding & Media
```

---
<p align="center">
  Developed by <strong>Dominators IIIT Dharwad</strong>
</p>
See `LICENSE` for more information.

---
<p align="center">
  Developed with ❤️ by <strong>Dominators IIIT Dharwad</strong>
</p>