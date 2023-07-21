
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCci0UCa9W2Ox_1B8p5TcbwStrEW3bg5Lc",
  authDomain: "chat-97fd8.firebaseapp.com",
  projectId: "chat-97fd8",
  storageBucket: "chat-97fd8.appspot.com",
  messagingSenderId: "391190312398",
  appId: "1:391190312398:web:40434305f3ed87a787279f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();