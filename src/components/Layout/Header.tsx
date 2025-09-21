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
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-md border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg">
            <Sword className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Loneventure
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">Solo D&D Campaigns</p>
          </div>
        </div>

        {/* Nav */}
        {user && onNavigate && (
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 transition ${
                    currentView === item.id
                      ? 'text-purple-400 border-b-2 border-purple-500'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* User */}
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 hidden sm:inline">
              Welcome, {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-slate-700/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;