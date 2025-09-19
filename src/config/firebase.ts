import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUOB6OouaoEsPTg1CXfd0NToLyeWQziSY",
  authDomain: "loneventure.firebaseapp.com",
  projectId: "loneventure",
  storageBucket: "loneventure.firebasestorage.app",
  messagingSenderId: "819399765530",
  appId: "1:819399765530:web:058c7eb7fdc7e8d0eb2ba3",
  measurementId: "G-RH6X2V7HNC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;