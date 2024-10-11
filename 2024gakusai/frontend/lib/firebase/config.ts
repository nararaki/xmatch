import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBu2MbvrFfpIuX6HBMKV71U75hoAsVXdF4",
    authDomain: "gakusai-75158.firebaseapp.com",
    projectId: "gakusai-75158",
    storageBucket: "gakusai-75158.appspot.com",
    messagingSenderId: "782513314209",
    appId: "1:782513314209:web:1b91f6c611a116824693e0",
    measurementId: "G-K5MF9M6QRM"
  };
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)