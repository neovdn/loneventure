import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Character } from '../../types';
import { characterService } from '../../services/characterService';
import CharacterCard from '../Characters/CharacterCard';
import CharacterCreation from '../Characters/CharacterCreation';
import CampaignInterface from '../Campaign/CampaignInterface';
import ErrorBoundary from '../UI/ErrorBoundary';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Plus, Users, Scroll } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'create' | 'edit' | 'play'>('dashboard');
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
      setView('dashboard');
    } catch (error) {
      console.error('Error saving character:', error);
      throw error;
    }
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setSelectedCharacter(null);
  };

  if (view === 'create' || view === 'edit') {
    return (
      <CharacterCreation
        existingCharacter={selectedCharacter || undefined}
        onSave={handleSaveCharacter}
        onCancel={handleBackToDashboard}
      />
    );
  }

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

  return (
    <div className="min-h-screen fantasy-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-shadow">
            Welcome to your Adventure Hall
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Create up to 3 characters and embark on epic solo campaigns with your AI Dungeon Master
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
              <div className="card text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white">{characters.length}</h3>
                <p className="text-slate-400">Characters Created</p>
              </div>
              <div className="card text-center">
                <Scroll className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white">
                  {characters.filter(c => c.level > 1).length}
                </h3>
                <p className="text-slate-400">Active Campaigns</p>
              </div>
              <div className="card text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{3 - characters.length}</h3>
                <p className="text-slate-400">Slots Remaining</p>
              </div>
            </div>

            {/* Characters Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Characters</h2>
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
              <div className="card text-center py-12">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Characters Yet
                </h3>
                <p className="text-slate-400 mb-6">
                  Create your first character to begin your adventure
                </p>
                <button
                  onClick={handleCreateCharacter}
                  className="btn-primary flex items-center space-x-2 mx-auto"
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
                    className="card border-2 border-dashed border-slate-600 hover:border-slate-500 cursor-pointer group transition-all duration-200 flex items-center justify-center min-h-[300px]"
                  >
                    <div className="text-center">
                      <Plus className="w-12 h-12 text-slate-600 group-hover:text-slate-400 mx-auto mb-3 transition-colors" />
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
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
};

export default Dashboard;