// Granite AI service for IBM Granite integration via Replicate API
export interface GraniteRequest {
  prompt: string;
  characterContext?: any;
  conversationHistory?: any[];
}

export interface GraniteResponse {
  response: string;
  success: boolean;
  error?: string;
}

export const graniteService = {
  // Initialize a new campaign with character context
  async initializeCampaign(character: any): Promise<GraniteResponse> {
    const backstoryContext = character.backstory 
      ? `\n\nCharacter Backstory: ${character.backstory}`
      : '';

    const prompt = `You are a skilled Dungeon Master running a solo D&D campaign. The player's character is:

Name: ${character.name}
Race: ${character.race}
Class: ${character.class}
Background: ${character.background}
Level: ${character.level}${backstoryContext}

Ability Scores:
- Strength: ${character.abilityScores.strength}
- Dexterity: ${character.abilityScores.dexterity}
- Constitution: ${character.abilityScores.constitution}
- Intelligence: ${character.abilityScores.intelligence}
- Wisdom: ${character.abilityScores.wisdom}
- Charisma: ${character.abilityScores.charisma}

Create an engaging opening scene for this character's adventure that incorporates their backstory and personality. Keep the description to two concise paragraphs. Conclude by offering the player a clear choice of 2-3 actions, formatted as a numbered list.`;

    try {
      const response = await this.callGraniteAPI({
        prompt,
        characterContext: character
      });
      
      return response;
    } catch (error) {
      console.error('Error initializing campaign:', error);
      return {
        response: '',
        success: false,
        error: 'Failed to initialize campaign'
      };
    }
  },

  // Continue campaign conversation
  async continueStory(
    prompt: string, 
    character: any, 
    conversationHistory: any[]
  ): Promise<GraniteResponse> {
    // Build context from conversation history
    const historyContext = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.sender === 'player' ? character.name : 'DM'}: ${msg.content}`)
      .join('\n');

    const backstoryContext = character.backstory 
      ? `\nCharacter Backstory: ${character.backstory}`
      : '';

    const fullPrompt = `You are a Dungeon Master continuing a D&D campaign. Here's the recent conversation:

${historyContext}

Character: ${character.name} (${character.race} ${character.class}, Level ${character.level})${backstoryContext}

Player's latest action: ${prompt}

As the DM, respond to the player's action. Follow these rules:
1. Provide a brief narrative of the outcome in one to two sentences.
2. If the player's action has an uncertain outcome (e.g., attacking, persuading, searching for something hidden, or performing an athletic feat), you must ask them to make a dice roll.
3. The format for asking for a dice roll must be clear. Example: "Roll a d20 for your Dexterity saving throw." or "Roll a d20 for an attack on the goblin."
4. If the action is straightforward and doesn't require a dice roll, simply describe the outcome and present the next choices.
5. If the player rolled dice in their action, use the result to describe the outcome.
6. Present the player's next choices as a numbered list.`;

    try {
      const response = await this.callGraniteAPI({
        prompt: fullPrompt,
        characterContext: character,
        conversationHistory
      });
      
      return response;
    } catch (error) {
      console.error('Error continuing story:', error);
      return {
        response: '',
        success: false,
        error: 'Failed to continue story'
      };
    }
  },

  // Call Replicate API with Granite model
  async callGraniteAPI(request: GraniteRequest): Promise<GraniteResponse> {
    const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;
    
    if (!REPLICATE_API_TOKEN) {
      console.error('Replicate API token not found. Please add VITE_REPLICATE_API_TOKEN to your .env file');
      return {
        response: 'Please configure your Replicate API token to use the AI Dungeon Master.',
        success: false,
        error: 'API token not configured'
      };
    }

    try {
      const response = await fetch('/api/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "ibm-granite/granite-3.3-8b-instruct",
          input: {
            prompt: request.prompt,
            max_tokens: 350,
            temperature: 0.7,
            top_p: 0.9,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const prediction = await response.json();
      
      let result = prediction;
      while (result.status === 'starting' || result.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pollResponse = await fetch(`/api/v1/predictions/${result.id}`, {
          headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          }
        });
        
        result = await pollResponse.json();
      }

      if (result.status === 'succeeded') {
        return {
          response: result.output.join(''),
          success: true
        };
      } else {
        throw new Error(`Prediction failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Replicate API error:', error);
      
      return {
        response: 'AI Dungeon Master saat ini tidak tersedia. Silakan coba lagi nanti.',
        success: false,
        error: 'Replicate API error'
      };
    }
  }
};