import React, { useState } from 'react';
import { Character } from '../../types';
import { RACES, CLASSES, BACKGROUNDS, generateRandomStats } from '../../data/characterData';
import { getModifier } from '../../utils/diceRoller';
import { ArrowLeft, Shuffle } from 'lucide-react';
import LoadingSpinner from '../UI/LoadingSpinner';

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
    abilityScores: existingCharacter?.abilityScores || generateRandomStats()
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    
    if (!formData.name || !formData.race || !formData.class || !formData.background) {
      setError('Please fill in all required fields');
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">
          {existingCharacter ? 'Edit Character' : 'Create New Character'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Character Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field w-full"
                placeholder="Enter character name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Race *
              </label>
              <select
                value={formData.race}
                onChange={(e) => handleInputChange('race', e.target.value)}
                className="select-field w-full"
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
                <p className="text-slate-400 text-sm mt-1">
                  {RACES.find(r => r.name === formData.race)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Class *
              </label>
              <select
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                className="select-field w-full"
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
                <p className="text-slate-400 text-sm mt-1">
                  {CLASSES.find(c => c.name === formData.class)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Background *
              </label>
              <select
                value={formData.background}
                onChange={(e) => handleInputChange('background', e.target.value)}
                className="select-field w-full"
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
                <p className="text-slate-400 text-sm mt-1">
                  {BACKGROUNDS.find(b => b.name === formData.background)?.description}
                </p>
              )}
            </div>
          </div>

          {/* Ability Scores */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Ability Scores</h3>
              <button
                type="button"
                onClick={rollStats}
                className="flex items-center space-x-2 btn-secondary"
              >
                <Shuffle className="w-4 h-4" />
                <span>Roll Stats</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(formData.abilityScores).map(([stat, value]) => (
                <div key={stat} className="text-center">
                  <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                    {stat}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={value}
                    onChange={(e) => handleStatChange(stat, parseInt(e.target.value))}
                    className="input-field w-full text-center mb-2"
                  />
                  <div className="text-slate-400 text-sm">
                    {calculateModifier(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Character Stats Preview */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Character Preview</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-red-400 font-medium">Hit Points</div>
                <div className="text-white text-xl">{calculateHitPoints()}</div>
              </div>
              <div>
                <div className="text-blue-400 font-medium">Armor Class</div>
                <div className="text-white text-xl">{calculateArmorClass()}</div>
              </div>
              <div>
                <div className="text-yellow-400 font-medium">Proficiency</div>
                <div className="text-white text-xl">+2</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
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
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreation;