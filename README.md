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
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.11.0-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**KubeShield** is a powerful security platform designed to provide deep observability and threat detection for Kubernetes environments. It empowers DevOps and Security teams to visualize their cluster's security posture, simulate attacks, and analyze manifest files for potential vulnerabilities before deployment.

## 🚀 Key Features

### 🔍 Universal Manifest Scanner
Analyze your Kubernetes YAML files for security misconfigurations using a **production-grade rule engine**.
- **Structural Analysis**: No more brittle regex; the scanner performs deep object-level inspection of parsed manifests.
- **10+ Strict Rules**: Automatically detects **Privileged Containers**, **Root User Execution**, **Host Network Access**, **Missing Resource Limits**, **Dangerous Capabilities**, and more.
- **Universal Support**: Handles Pods, Deployments, StatefulSets, Jobs, CronJobs, and Services.

### 📊 Real-time Risk Intelligence
- **Quantitative Scoring**: Get a precise security grade (0-100) based on weighted findings.
- **Dynamic Dashboard**: Visualize your security posture with real-time charts and KPI metrics.
- **Smart Remediation**: Actionable, prioritized recommendations with clear "Quick Fix" guidance.

### 🗺️ Infrastructure & Attack Surface
- **Topology Mapping**: Visual representation of your cluster resources and their relationships.
- **Weak Point Detection**: Automatically identifies "Hotspot" resources with multiple critical vulnerabilities.
- **Attack Path Preview**: Visualize potential lateral movement and node escape vectors.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visualizations**: [React Flow](https://reactflow.dev/) (Infrastructure Map) & [Recharts](https://recharts.org/) (Security Metrics)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Auth**: [Firebase Authentication](https://firebase.google.com/)

### Backend
- **Server**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Kubernetes Integration**: [@kubernetes/client-node](https://github.com/kubernetes-client/javascript)
- **Monitoring**: Real-time resource fetching from connected clusters.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- `kubectl` configured with access to a cluster (for real-time monitoring features)
- Firebase Project (for Auth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Laxmikant3132/Dominators_IIIT_Dharwad.git
   cd kubeshield
   ```

2. **Setup Frontend:**
   ```bash
   # Install dependencies
   npm install
   
   # Create .env and add Firebase configuration
   cp .env.example .env # If available, or manually create
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   # Install dependencies
   npm install
   
   # Start the backend server
   npm run dev
   ```

4. **Run Frontend:**
   ```bash
   # Back in the root directory
   npm run dev
   ```

## 🏗️ Project Structure

```text
kubeshield/
├── backend/            # Express server & Kubernetes client
│   ├── src/
│   │   ├── config/     # Server configuration
│   │   ├── routes/     # API endpoints (Pods, Services, etc.)
│   │   └── kubernetes/ # K8s client logic
├── src/                # Frontend React application
│   ├── components/     # UI components (Shared & Page-specific)
│   ├── pages/          # Dashboard, YAML Analyzer, Infrastructure Map
│   ├── lib/            # Firebase & logic utilities
│   └── hooks/          # Custom security & data hooks
└── public/             # Static assets (Logo, etc.)
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
  Developed with ❤️ by <strong>Dominators IIIT Dharwad</strong>
</p>