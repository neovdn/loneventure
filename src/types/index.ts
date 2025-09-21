export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  race: string;
  class: string;
  background: string;
  backstory: string;
  imageUrl?: string;
  level: number;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  hitPoints: {
    current: number;
    maximum: number;
  };
  armorClass: number;
  proficiencyBonus: number;
  equipment: string[];
  spells: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  characterId: string;
  userId: string;
  title: string;
  currentScene: string;
  conversationHistory: ChatMessage[];
  gameState: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'dm';
  content: string;
  timestamp: Date | any; // Allow for Firestore Timestamp objects during data loading
  diceRoll?: {
    dice: string;
    result: number;
  };
}

// Type for normalized chat messages with guaranteed Date timestamps
export interface NormalizedChatMessage extends Omit<ChatMessage, 'timestamp'> {
  timestamp: Date;
}

export interface DiceRoll {
  sides: number;
  result: number;
  timestamp: Date;
}