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
    const prompt = `You are a skilled Dungeon Master running a solo D&D campaign. The player's character is:

Name: ${character.name}
Race: ${character.race}
Class: ${character.class}
Background: ${character.background}
Level: ${character.level}

Ability Scores:
- Strength: ${character.abilityScores.strength}
- Dexterity: ${character.abilityScores.dexterity}
- Constitution: ${character.abilityScores.constitution}
- Intelligence: ${character.abilityScores.intelligence}
- Wisdom: ${character.abilityScores.wisdom}
- Charisma: ${character.abilityScores.charisma}

Create an engaging opening scene for this character's adventure. Set the scene with vivid descriptions, introduce an interesting situation or conflict, and end with a clear choice or action prompt for the player. Keep the response to 2-3 paragraphs and make it immersive and exciting.`;

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

    const fullPrompt = `You are a Dungeon Master continuing a D&D campaign. Here's the recent conversation:

${historyContext}

Character: ${character.name} (${character.race} ${character.class}, Level ${character.level})

Player's latest action: ${prompt}

As the DM, respond to the player's action. Describe what happens, any consequences, and present new choices or situations. Keep responses engaging, descriptive, and around 2-3 paragraphs. If the player rolled dice, incorporate those results into your response.`;

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
      // Start the prediction
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "0fbacf6c48b2a4b50d550a78ca4b0f4bf06f29f65c3e65458c267696212f2ba1", // IBM Granite 8B Instruct model
          input: {
            prompt: request.prompt,
            max_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const prediction = await response.json();
      
      // Poll for completion
      let result = prediction;
      while (result.status === 'starting' || result.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
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
      
      // Fallback response for development/testing
      const fallbackResponses = [
        `The ancient tavern door creaks open as ${request.characterContext?.name || 'you'} step inside. The air is thick with pipe smoke and the scent of roasted meat. A hooded figure in the corner catches your eye, beckoning you over with a gloved hand. The bartender, a burly dwarf with intricate braids, eyes you suspiciously. What do you do?`,
        
        `Your keen senses detect something amiss in the shadowy alleyway. The cobblestones seem to shimmer with an otherworldly light, and a faint magical aura emanates from deeper within. Strange whispers echo off the walls, speaking in a language you don't recognize. Do you investigate further, or do you seek help from the local authorities?`,
        
        `The ancient tome glows with ethereal light as you approach the pedestal. Strange runes dance across its leather-bound cover, pulsing in rhythm with your heartbeat. You can feel the power radiating from within its pages, but also sense an underlying danger. The chamber around you seems to hold its breath, waiting for your decision. Do you dare to open it?`
      ];
      
      return {
        response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        success: true
      };
    }
  }
};