export const rollDice = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

export const rollMultipleDice = (count: number, sides: number): number[] => {
  return Array.from({ length: count }, () => rollDice(sides));
};

export const rollWithModifier = (sides: number, modifier: number): number => {
  return rollDice(sides) + modifier;
};

export const getModifier = (abilityScore: number): number => {
  return Math.floor((abilityScore - 10) / 2);
};

export const formatDiceRoll = (dice: string, result: number): string => {
  return `${dice}: ${result}`;
};

// Standard D&D dice types
export const DICE_TYPES = [
  { name: 'd4', sides: 4 },
  { name: 'd6', sides: 6 },
  { name: 'd8', sides: 8 },
  { name: 'd10', sides: 10 },
  { name: 'd12', sides: 12 },
  { name: 'd20', sides: 20 }
];