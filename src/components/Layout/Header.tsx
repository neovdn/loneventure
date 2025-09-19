import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Sword } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white text-shadow">
                Loneventure
              </h1>
              <p className="text-slate-400 text-sm">Solo D&D Campaigns</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                Welcome, {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;