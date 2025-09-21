import React from 'react';
import { Character } from '../../types';
import { User, Shield, Heart, Swords, BookOpen } from 'lucide-react';

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
        <div className="flex items-center space-x-4">
          <div className="relative">
            {character.imageUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-purple-500/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 w-16 h-16 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
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

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <p className="text-slate-400 text-sm">Background:</p>
        </div>
        <p className="text-slate-300 mb-3">{character.background}</p>
        
        {character.backstory && (
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
            <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
              {character.backstory.length > 120 
                ? `${character.backstory.substring(0, 120)}...` 
                : character.backstory
              }
            </p>
          </div>
        )}
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