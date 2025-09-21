import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Layout/Header';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { useState } from 'react';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

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
    <div className="min-h-screen bg-slate-950">
      <Header currentView={currentView} onNavigate={handleNavigate} />
      <div className="pt-20">
        <Dashboard currentView={currentView} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default App;