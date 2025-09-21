import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Character } from '../../types';
import { characterService } from '../../services/characterService';
import CharacterCard from '../Characters/CharacterCard';
import CharacterCreation from '../Characters/CharacterCreation';
import CampaignInterface from '../Campaign/CampaignInterface';
import HomePage from '../Home/HomePage';
import AboutPage from '../Home/AboutPage';
import ErrorBoundary from '../UI/ErrorBoundary';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Plus, Users, Scroll, Sparkles } from 'lucide-react';

interface DashboardProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView = 'home', onNavigate }) => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'characters' | 'campaigns' | 'about' | 'create' | 'edit' | 'play'>('home');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (user) {
      loadCharacters();
    }
  }, [user]);

  const loadCharacters = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userCharacters = await characterService.getUserCharacters(user.uid);
      setCharacters(userCharacters);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (newView: string) => {
    const viewToSet = newView as any;
    setView(viewToSet);
    setSelectedCharacter(null);
    if (onNavigate) {
      onNavigate(newView);
    }
  };

  // Update internal view when external currentView changes
  React.useEffect(() => {
    if (currentView && currentView !== view) {
      setView(currentView as any);
    }
  }, [currentView]);

  const handleStartAdventure = () => {
    if (characters.length === 0) {
      setView('create');
    } else {
      setView('characters');
    }
  };

  const handleCreateCharacter = () => {
    setSelectedCharacter(null);
    setView('create');
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setView('edit');
  };

  const handlePlayCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setView('play');
  };

  const handleDeleteCharacter = async (character: Character) => {
    if (window.confirm(`Are you sure you want to delete ${character.name}?`)) {
      try {
        await characterService.deleteCharacter(character.id);
        await loadCharacters();
      } catch (error) {
        console.error('Error deleting character:', error);
      }
    }
  };

  const handleSaveCharacter = async (characterData: Omit<Character, 'id'>) => {
    if (!user) return;

    try {
      const characterWithUser = {
        ...characterData,
        userId: user.uid
      };

      if (selectedCharacter) {
        // Update existing character
        await characterService.updateCharacter(selectedCharacter.id, characterWithUser);
      } else {
        // Create new character
        await characterService.createCharacter(characterWithUser);
      }
      
      await loadCharacters();
      setView('characters');
    } catch (error) {
      console.error('Error saving character:', error);
      throw error;
    }
  };

  const handleBackToDashboard = () => {
    setView('characters');
    setSelectedCharacter(null);
  };

  // Show home page
  if (view === 'home') {
    return <HomePage onNavigate={handleNavigate} onStartAdventure={handleStartAdventure} />;
  }

  // Show about page
  if (view === 'about') {
    return <AboutPage onBack={() => setView('home')} />;
  }

  // Show character creation/editing
  if (view === 'create' || view === 'edit') {
    return (
      <CharacterCreation
        existingCharacter={selectedCharacter || undefined}
        onSave={handleSaveCharacter}
        onCancel={handleBackToDashboard}
      />
    );
  }

  // Show campaign interface
  if (view === 'play' && selectedCharacter) {
    return (
      <ErrorBoundary>
        <CampaignInterface
          character={selectedCharacter}
          onBack={handleBackToDashboard}
        />
      </ErrorBoundary>
    );
  }

  // Show characters page
  if (view === 'characters') {
    return (
      <div className="min-h-screen fantasy-gradient">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 glow-text">
              Your Characters
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Manage your heroes and embark on epic adventures
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stats-card text-center">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:text-cyan-400 transition-colors duration-300" />
                  <h3 className="text-2xl font-bold text-white glow-text">{characters.length}</h3>
                  <p className="text-slate-400">Characters Created</p>
                </div>
                <div className="stats-card text-center">
                  <Scroll className="w-8 h-8 text-teal-400 mx-auto mb-3 group-hover:text-purple-400 transition-colors duration-300" />
                  <h3 className="text-2xl font-bold text-white glow-text">
                    {characters.filter(c => c.level > 1).length}
                  </h3>
                  <p className="text-slate-400">Active Campaigns</p>
                </div>
                <div className="stats-card text-center">
                  <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3 group-hover:text-cyan-400 transition-colors duration-300" />
                  <h3 className="text-2xl font-bold text-white glow-text">{3 - characters.length}</h3>
                  <p className="text-slate-400">Slots Remaining</p>
                </div>
              </div>

              {/* Characters Section */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white glow-text">Character Roster</h2>
                {characters.length < 3 && (
                  <button
                    onClick={handleCreateCharacter}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Character</span>
                  </button>
                )}
              </div>

              {characters.length === 0 ? (
                <div className="card-hero text-center py-12">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2 glow-text">
                    No Characters Yet
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Create your first character to begin your adventure
                  </p>
                  <button
                    onClick={handleCreateCharacter}
                    className="btn-hero flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Character</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {characters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onPlay={handlePlayCharacter}
                      onEdit={handleEditCharacter}
                      onDelete={handleDeleteCharacter}
                    />
                  ))}
                  
                  {characters.length < 3 && (
                    <div
                      onClick={handleCreateCharacter}
                      className="card border-2 border-dashed border-slate-600 hover:border-purple-500/50 cursor-pointer group transition-all duration-300 flex items-center justify-center min-h-[300px] magical-border"
                    >
                      <div className="text-center">
                        <Plus className="w-12 h-12 text-slate-600 group-hover:text-purple-400 mx-auto mb-3 transition-colors duration-300" />
                        <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                          Create New Character
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Show campaigns page
  return (
    <div className="min-h-screen fantasy-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">
            Active Campaigns
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Continue your ongoing adventures or start new ones
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onPlay={handlePlayCharacter}
                onEdit={handleEditCharacter}
                onDelete={handleDeleteCharacter}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;