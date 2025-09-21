import React from 'react';
import { Character } from '../../types';
import { User, Shield, Heart, Swords } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onPlay: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  onPlay, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="card group magical-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white glow-text">{character.name}</h3>
            <p className="text-slate-400">
              Level {character.level} {character.race} {character.class}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-red-400 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">HP</span>
          </div>
          <div className="text-white font-bold glow-text">
            {character.hitPoints.current}/{character.hitPoints.maximum}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-blue-400 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">AC</span>
          </div>
          <div className="text-white font-bold glow-text">{character.armorClass}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-yellow-400 mb-1">
            <Swords className="w-4 h-4" />
            <span className="text-sm font-medium">Prof</span>
          </div>
          <div className="text-white font-bold glow-text">+{character.proficiencyBonus}</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-2">Background:</p>
        <p className="text-slate-300">{character.background}</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onPlay(character)}
          className="btn-primary flex-1 group-hover:shadow-purple-500/30"
        >
          Play
        </button>
        <button
          onClick={() => onEdit(character)}
          className="btn-secondary"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(character)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded transition-all duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;