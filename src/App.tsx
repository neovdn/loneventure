import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Layout/Header';
import LoadingSpinner from './components/UI/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen fantasy-gradient flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header currentView="home" onNavigate={() => {}} />
      <Dashboard />
    </div>
  );
}

export default App;