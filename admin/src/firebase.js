import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQvuynWqC871n7Vnezyo78OFYAQKbZrMw",
  authDomain: "shreeji-vastraalay.firebaseapp.com",
  projectId: "shreeji-vastraalay",
  storageBucket: "shreeji-vastraalay.firebasestorage.app",
  messagingSenderId: "31299324907",
  appId: "1:31299324907:web:76999b5154faaa736a27ae"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

