import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyA0M8tuAOFwpt_Sk--p9D-jtbdlEM4isAk",
  authDomain: "formaswebsite.firebaseapp.com",
  projectId: "formaswebsite",
  storageBucket: "formaswebsite.firebasestorage.app",
  messagingSenderId: "699234506659",
  appId: "1:699234506659:web:a13d913e5a3148d93e6c16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app

