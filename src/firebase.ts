import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx8sH2-jKHYL3uVp8D7P-JxuWyhgmF9rc",
  authDomain: "song-bd986.firebaseapp.com",
  projectId: "song-bd986",
  storageBucket: "song-bd986.firebasestorage.app",
  messagingSenderId: "851286985046",
  appId: "1:851286985046:web:df68385843fa47c468eef7",
  measurementId: "G-519XJMWV63"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Export semua variable & fungsi agar bisa di-import di file lain
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};