import React, { useState, useEffect, useRef } from 'react';
import { Character, Campaign, ChatMessage, NormalizedChatMessage } from '../../types';
import { campaignService } from '../../services/campaignService';
import { graniteService } from '../../services/graniteService';
import { formatTimestamp, normalizeTimestamp } from '../../utils/dateHelpers';
import { ArrowLeft, Send, Loader } from 'lucide-react';
import DiceRoller from '../UI/DiceRoller';
import LoadingSpinner from '../UI/LoadingSpinner';

interface CampaignInterfaceProps {
  character: Character;
  onBack: () => void;
}

const CampaignInterface: React.FC<CampaignInterfaceProps> = ({ character, onBack }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [normalizedMessages, setNormalizedMessages] = useState<NormalizedChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCampaign();
  }, [character.id]);

  useEffect(() => {
    // Normalize message timestamps whenever campaign changes
    if (campaign?.conversationHistory) {
      const normalized = campaign.conversationHistory.map(message => ({
        ...message,
        timestamp: normalizeTimestamp(message.timestamp)
      }));
      setNormalizedMessages(normalized);
    }
  }, [campaign?.conversationHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [normalizedMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadCampaign = async () => {
    try {
      setLoading(true);
      let existingCampaign = await campaignService.getCharacterCampaign(character.id);
      
      if (!existingCampaign) {
        // Create new campaign
        const response = await graniteService.initializeCampaign(character);
        
        if (response.success) {
          const newCampaignData = {
            characterId: character.id,
            userId: character.userId,
            title: `${character.name}'s Adventure`,
            currentScene: response.response,
            conversationHistory: [{
              id: '1',
              sender: 'dm' as const,
              content: response.response,
              timestamp: new Date()
            }],
            gameState: {},
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const campaignId = await campaignService.createCampaign(newCampaignData);
          existingCampaign = await campaignService.getCampaign(campaignId);
        }
      }
      
      setCampaign(existingCampaign);
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !campaign || sending) return;

    setSending(true);
    const userMessage: Omit<ChatMessage, 'id'> = {
      sender: 'player',
      content: messageInput.trim(),
      timestamp: new Date()
    };

    try {
      // Add user message
      await campaignService.addMessage(campaign.id, userMessage);
      
      // Get AI response
      const response = await graniteService.continueStory(
        messageInput.trim(),
        character,
        campaign.conversationHistory
      );

      if (response.success) {
        const dmMessage: Omit<ChatMessage, 'id'> = {
          sender: 'dm',
          content: response.response,
          timestamp: new Date()
        };
        
        await campaignService.addMessage(campaign.id, dmMessage);
        
        // Reload campaign to get updated messages
        const updatedCampaign = await campaignService.getCampaign(campaign.id);
        setCampaign(updatedCampaign);
      }
      
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDiceRoll = async (dice: string, result: number) => {
    if (!campaign) return;

    const rollMessage: Omit<ChatMessage, 'id'> = {
      sender: 'player',
      content: `🎲 Rolled ${dice}: ${result}`,
      timestamp: new Date(),
      diceRoll: { dice, result }
    };

    await campaignService.addMessage(campaign.id, rollMessage);
    const updatedCampaign = await campaignService.getCampaign(campaign.id);
    setCampaign(updatedCampaign);
  };

  if (loading) {
    return (
      <div className="min-h-screen fantasy-gradient flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-300">Preparing your adventure...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen fantasy-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load campaign</p>
          <button onClick={onBack} className="btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fantasy-gradient">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{campaign.title}</h1>
              <p className="text-slate-400">Playing as {character.name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="card h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {normalizedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'player' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg p-4 rounded-lg ${
                        message.sender === 'player'
                          ? 'bg-purple-600 text-white ml-8'
                          : 'bg-slate-700 text-slate-100 mr-8'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-sm">
                          {message.sender === 'player' ? character.name : 'Dungeon Master'}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.diceRoll && (
                        <div className="mt-2 text-xs bg-black/20 rounded px-2 py-1">
                          🎲 {message.diceRoll.dice}: {message.diceRoll.result}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your action..."
                    className="input-field flex-1 resize-none"
                    rows={2}
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || sending}
                    className="btn-primary px-4 flex items-center justify-center"
                  >
                    {sending ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Character Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">{character.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Race:</span>
                  <span>{character.race}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Class:</span>
                  <span>{character.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Level:</span>
                  <span>{character.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HP:</span>
                  <span>{character.hitPoints.current}/{character.hitPoints.maximum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AC:</span>
                  <span>{character.armorClass}</span>
                </div>
              </div>
            </div>

            {/* Dice Roller */}
            <DiceRoller onRoll={handleDiceRoll} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignInterface;