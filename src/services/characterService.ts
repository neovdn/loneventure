import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Character } from '../types';

const CHARACTERS_COLLECTION = 'characters';

export const characterService = {
  // Get all characters for a user
  async getUserCharacters(userId: string): Promise<Character[]> {
    try {
      const q = query(
        collection(db, CHARACTERS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Character[];
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  },

  // Get a specific character
  async getCharacter(characterId: string): Promise<Character | null> {
    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, characterId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Character;
      }
      return null;
    } catch (error) {
      console.error('Error fetching character:', error);
      throw error;
    }
  },

  // Create a new character
  async createCharacter(character: Omit<Character, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), {
        ...character,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  },

  // Update a character
  async updateCharacter(characterId: string, updates: Partial<Character>): Promise<void> {
    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, characterId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  },

  // Delete a character
  async deleteCharacter(characterId: string): Promise<void> {
    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, characterId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  }
};