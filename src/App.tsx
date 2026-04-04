import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';

// Landing page components (from Phase 1)
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustStrip from './components/TrustStrip';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import ProductPreview from './components/ProductPreview';
import WhySection from './components/WhySection';
import TechStack from './components/TechStack';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

// Landing page component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-blue-950 to-purple-950 opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1)_0%,transparent_50%)]" />
      
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <FeaturesSection />
        <HowItWorks />
        <ProductPreview />
        <WhySection />
        <TechStack />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

import { MainLayout } from './components/layout/MainLayout';
import { AttackPaths } from './pages/AttackPaths';
import { RiskScore } from './pages/RiskScore';
import { Misconfigurations } from './pages/Misconfigurations';
import { WeakPoints } from './pages/WeakPoints';
import { AttackSimulator } from './pages/AttackSimulator';
import { Recommendations } from './pages/Recommendations';
import { YAMLAnalyzer } from './pages/YAMLAnalyzer';
import { InfrastructureMap } from './pages/InfrastructureMap';

// App content component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
        } 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
        } 
      />
      
      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="attack-paths" element={<AttackPaths />} />
        <Route path="risk-score" element={<RiskScore />} />
        <Route path="misconfigurations" element={<Misconfigurations />} />
        <Route path="weak-points" element={<WeakPoints />} />
        <Route path="attack-simulator" element={<AttackSimulator />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="yaml-analyzer" element={<YAMLAnalyzer />} />
        <Route path="infrastructure-map" element={<InfrastructureMap />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
