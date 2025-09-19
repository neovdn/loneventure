import React, { useState } from 'react';
import { Dice6 } from 'lucide-react';
import { rollDice, DICE_TYPES } from '../../utils/diceRoller';

interface DiceRollerProps {
  onRoll?: (dice: string, result: number) => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll }) => {
  const [lastRoll, setLastRoll] = useState<{ dice: string; result: number } | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = async (sides: number, diceName: string) => {
    setIsRolling(true);
    
    // Add a small delay for animation effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = rollDice(sides);
    const rollData = { dice: diceName, result };
    
    setLastRoll(rollData);
    setIsRolling(false);
    
    if (onRoll) {
      onRoll(diceName, result);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Dice6 className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold">Dice Roller</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {DICE_TYPES.map((dice) => (
          <button
            key={dice.name}
            onClick={() => handleRoll(dice.sides, dice.name)}
            disabled={isRolling}
            className="dice-btn"
          >
            {dice.name}
          </button>
        ))}
      </div>
      
      {lastRoll && (
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-400 mb-1">
            {isRolling ? '...' : lastRoll.result}
          </div>
          <div className="text-slate-400 text-sm">
            {lastRoll.dice} roll
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;