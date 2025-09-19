export const RACES = [
  {
    name: 'Human',
    description: 'Versatile and ambitious, humans adapt quickly to any situation.'
  },
  {
    name: 'Elf',
    description: 'Graceful and long-lived, elves have keen senses and a natural affinity for magic.'
  },
  {
    name: 'Dwarf',
    description: 'Stout and resilient, dwarves are known for their craftsmanship and courage.'
  },
  {
    name: 'Halfling',
    description: 'Small but brave, halflings are naturally lucky and surprisingly resourceful.'
  },
  {
    name: 'Dragonborn',
    description: 'Proud descendants of dragons, they possess draconic heritage and breath weapons.'
  },
  {
    name: 'Gnome',
    description: 'Small and curious, gnomes are natural tinkerers with a love for knowledge.'
  },
  {
    name: 'Half-Elf',
    description: 'Born of two worlds, half-elves combine human versatility with elven grace.'
  },
  {
    name: 'Half-Orc',
    description: 'Caught between worlds, half-orcs possess great strength and fierce determination.'
  },
  {
    name: 'Tiefling',
    description: 'Bearing infernal heritage, tieflings overcome prejudice with charm and cunning.'
  }
];

export const CLASSES = [
  {
    name: 'Fighter',
    description: 'Masters of martial combat, skilled with a variety of weapons and armor.'
  },
  {
    name: 'Wizard',
    description: 'Scholarly magic-users capable of manipulating the forces of the universe.'
  },
  {
    name: 'Cleric',
    description: 'Priestly champions who wield divine magic in service of higher powers.'
  },
  {
    name: 'Rogue',
    description: 'Scoundrels who use stealth and trickery to overcome obstacles.'
  },
  {
    name: 'Ranger',
    description: 'Warriors of the wilderness, skilled in tracking and survival.'
  },
  {
    name: 'Paladin',
    description: 'Holy warriors bound by sacred oaths to fight against darkness.'
  },
  {
    name: 'Barbarian',
    description: 'Fierce warriors who can enter a battle rage to devastating effect.'
  },
  {
    name: 'Bard',
    description: 'Masters of magic through music, stories, and performance.'
  },
  {
    name: 'Druid',
    description: 'Guardians of nature who can shapeshift and cast nature magic.'
  },
  {
    name: 'Monk',
    description: 'Disciplined warriors who harness inner power through martial arts.'
  },
  {
    name: 'Sorcerer',
    description: 'Spellcasters who draw on inherent magical power from within.'
  },
  {
    name: 'Warlock',
    description: 'Wielders of magic derived from a pact with an extraplanar entity.'
  }
];

export const BACKGROUNDS = [
  {
    name: 'Acolyte',
    description: 'You have spent your life in service to a temple or religious order.'
  },
  {
    name: 'Criminal',
    description: 'You are an experienced criminal with a history of breaking the law.'
  },
  {
    name: 'Folk Hero',
    description: 'You come from humble origins, but you are destined for greater things.'
  },
  {
    name: 'Noble',
    description: 'You understand wealth and power, coming from a privileged upbringing.'
  },
  {
    name: 'Sage',
    description: 'You spent years learning the lore of the multiverse.'
  },
  {
    name: 'Soldier',
    description: 'You have a military background and experience with warfare.'
  },
  {
    name: 'Charlatan',
    description: 'You have always had a way with people, using charm and wit to get ahead.'
  },
  {
    name: 'Entertainer',
    description: 'You thrive before an audience, knowing how to entrance them.'
  },
  {
    name: 'Guild Artisan',
    description: 'You are a member of an artisan guild, skilled in a particular craft.'
  },
  {
    name: 'Hermit',
    description: 'You lived in seclusion for years, seeking enlightenment or answers.'
  },
  {
    name: 'Outlander',
    description: 'You grew up in the wilds, far from civilization and comfort.'
  },
  {
    name: 'Sailor',
    description: 'You sailed on a seagoing vessel and know the ways of the sea.'
  }
];

export const generateRandomStats = () => {
  const rollStat = () => {
    // Roll 4d6, drop lowest
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
  };

  return {
    strength: rollStat(),
    dexterity: rollStat(),
    constitution: rollStat(),
    intelligence: rollStat(),
    wisdom: rollStat(),
    charisma: rollStat()
  };
};