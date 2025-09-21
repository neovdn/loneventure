import React, { useState } from 'react';
import { Character } from '../../types';
import { RACES, CLASSES, BACKGROUNDS, generateRandomStats } from '../../data/characterData';
import { getModifier } from '../../utils/diceRoller';
import { ArrowLeft, Shuffle, User, Dice6, BookOpen, Image } from 'lucide-react';
import LoadingSpinner from '../UI/LoadingSpinner';
import ImageUpload from './ImageUpload';
import BackstoryEditor from './BackstoryEditor';

interface CharacterCreationProps {
  onSave: (character: Omit<Character, 'id'>) => Promise<void>;
  onCancel: () => void;
  existingCharacter?: Character;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ 
  onSave, 
  onCancel, 
  existingCharacter 
}) => {
  const [formData, setFormData] = useState({
    name: existingCharacter?.name || '',
    race: existingCharacter?.race || '',
    class: existingCharacter?.class || '',
    background: existingCharacter?.background || '',
    backstory: existingCharacter?.backstory || '',
    // Perbaikan: Ubah null menjadi undefined
    imageUrl: existingCharacter?.imageUrl || undefined, 
    abilityScores: existingCharacter?.abilityScores || generateRandomStats()
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Perbaikan: Ubah null menjadi undefined
  const handleImageChange = (imageUrl: string | null) => {
    setFormData(prev => ({ ...prev, imageUrl: imageUrl || undefined }));
  };

  const handleBackstoryChange = (backstory: string) => {
    setFormData(prev => ({ ...prev, backstory }));
  };

  const handleStatChange = (stat: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [stat]: Math.max(1, Math.min(20, value))
      }
    }));
  };

  const rollStats = () => {
    setFormData(prev => ({
      ...prev,
      abilityScores: generateRandomStats()
    }));
  };

  const calculateModifier = (score: number) => {
    const modifier = getModifier(score);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const calculateHitPoints = () => {
    const conModifier = getModifier(formData.abilityScores.constitution);
    return 10 + conModifier; // Base HP for level 1
  };

  const calculateArmorClass = () => {
    const dexModifier = getModifier(formData.abilityScores.dexterity);
    return 10 + dexModifier; // Base AC without armor
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.race || !formData.class || !formData.background || !formData.backstory.trim()) {
      setError('Please fill in all required fields including backstory');
      return;
    }

    if (formData.backstory.length < 50) {
      setError('Please provide a more detailed backstory (at least 50 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const hitPoints = calculateHitPoints();
      const character: Omit<Character, 'id'> = {
        ...formData,
        userId: '', // This will be set by the parent component
        level: 1,
        hitPoints: {
          current: hitPoints,
          maximum: hitPoints
        },
        armorClass: calculateArmorClass(),
        proficiencyBonus: 2, // Level 1 proficiency bonus
        equipment: [], // Basic equipment based on class
        spells: [], // Basic spells based on class
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await onSave(character);
    } catch (err) {
      setError('Failed to save character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen fantasy-gradient pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="card-hero">
          <h2 className="text-3xl font-bold text-white mb-6 glow-text text-center">
          {existingCharacter ? 'Edit Character' : 'Create New Character'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Character Image Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white glow-text">Character Avatar</h3>
              </div>
              <ImageUpload
                currentImage={formData.imageUrl}
                onImageChange={handleImageChange}
                disabled={loading}
              />
            </div>

            {/* Basic Info Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white glow-text">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                Character Name *
                </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field w-full focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter character name"
                required
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                Race *
                </label>
              <select
                value={formData.race}
                onChange={(e) => handleInputChange('race', e.target.value)}
                  className="select-field w-full focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Race</option>
                {RACES.map((race) => (
                  <option key={race.name} value={race.name}>
                    {race.name}
                  </option>
                ))}
              </select>
              {formData.race && (
                  <p className="text-slate-400 text-sm mt-2 italic">
                  {RACES.find(r => r.name === formData.race)?.description}
                </p>
              )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                Class *
                </label>
              <select
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                  className="select-field w-full focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Class</option>
                {CLASSES.map((cls) => (
                  <option key={cls.name} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
              {formData.class && (
                  <p className="text-slate-400 text-sm mt-2 italic">
                  {CLASSES.find(c => c.name === formData.class)?.description}
                </p>
              )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                Background *
                </label>
              <select
                value={formData.background}
                onChange={(e) => handleInputChange('background', e.target.value)}
                  className="select-field w-full focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Background</option>
                {BACKGROUNDS.map((bg) => (
                  <option key={bg.name} value={bg.name}>
                    {bg.name}
                  </option>
                ))}
              </select>
              {formData.background && (
                  <p className="text-slate-400 text-sm mt-2 italic">
                  {BACKGROUNDS.find(b => b.name === formData.background)?.description}
                </p>
              )}
            </div>
            </div>
            </div>

            {/* Backstory Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white glow-text">Character Backstory *</h3>
              </div>
              <BackstoryEditor
                value={formData.backstory}
                onChange={handleBackstoryChange}
                disabled={loading}
              />
            </div>

            {/* Ability Scores Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Dice6 className="w-4 h-4 text-white" />
                  </div>
                <h3 className="text-xl font-semibold text-white glow-text">Ability Scores</h3>
                </div>
              <button
                type="button"
                onClick={rollStats}
                  className="flex items-center space-x-2 btn-secondary hover:scale-105 transition-transform duration-300"
              >
                <Shuffle className="w-4 h-4" />
                <span>Roll Stats</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(formData.abilityScores).map(([stat, value]) => (
                  <div key={stat} className="text-center bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300">
                    <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                    {stat}
                    </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={value}
                    onChange={(e) => handleStatChange(stat, parseInt(e.target.value))}
                      className="input-field w-full text-center mb-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                    <div className="text-purple-400 text-sm font-semibold">
                    {calculateModifier(value)}
                  </div>
                </div>
              ))}
            </div>
            </div>

            {/* Character Stats Preview */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 glow-text text-center">Character Preview</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                  <div className="text-red-400 font-medium mb-2">Hit Points</div>
                  <div className="text-white text-2xl font-bold glow-text">{calculateHitPoints()}</div>
              </div>
              <div>
                  <div className="text-blue-400 font-medium mb-2">Armor Class</div>
                  <div className="text-white text-2xl font-bold glow-text">{calculateArmorClass()}</div>
              </div>
              <div>
                  <div className="text-yellow-400 font-medium mb-2">Proficiency</div>
                  <div className="text-white text-2xl font-bold glow-text">+2</div>
              </div>
            </div>
            </div>

          {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-red-300 text-center font-medium">{error}</p>
            </div>
          )}

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 text-lg py-4"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{existingCharacter ? 'Update Character' : 'Create Character'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
                className="btn-secondary sm:w-auto w-full text-lg py-4"
            >
              Cancel
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;