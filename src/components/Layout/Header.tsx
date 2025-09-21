import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Sword, Home, Users, Scroll, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView = 'home', onNavigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Scroll },
    { id: 'about', label: 'About', icon: BookOpen }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => onNavigate?.('home')}
        >
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
            <Sword className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide glow-text">
              Loneventure
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">Solo D&D Campaigns</p>
          </div>
        </div>

        {/* Navigation */}
        {user && onNavigate && (
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-purple-600/20 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Mobile Navigation */}
        {user && onNavigate && (
          <nav className="md:hidden flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-purple-600/20 border border-purple-500/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </nav>
        )}

        {/* User Menu */}
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 hidden lg:inline text-sm">
              Welcome, {user.displayName || user.email?.split('@')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-slate-700/50 group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;