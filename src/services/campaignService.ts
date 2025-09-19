import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Campaign, ChatMessage } from '../types';

const CAMPAIGNS_COLLECTION = 'campaigns';

export const campaignService = {
  // Get campaign for a character
  async getCharacterCampaign(characterId: string): Promise<Campaign | null> {
    try {
      const q = query(
        collection(db, CAMPAIGNS_COLLECTION),
        where('characterId', '==', characterId)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Campaign;
      }
      return null;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  },

  // Create a new campaign
  async createCampaign(campaign: Omit<Campaign, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CAMPAIGNS_COLLECTION), {
        ...campaign,
        conversationHistory: campaign.conversationHistory.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Update campaign
  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<void> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  // Add message to campaign
  async addMessage(campaignId: string, message: Omit<ChatMessage, 'id'>): Promise<void> {
    try {
      const campaign = await this.getCampaign(campaignId);
      if (campaign) {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date()
        };
        
        const updatedHistory = [...campaign.conversationHistory, newMessage];
        await this.updateCampaign(campaignId, {
          conversationHistory: updatedHistory
        });
      }
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Get campaign by ID
  async getCampaign(campaignId: string): Promise<Campaign | null> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          conversationHistory: data.conversationHistory?.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp)
          })) || []
        } as Campaign;
      }
      return null;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }
};