import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"


// Your Firebase config object (replace with your own credentials)
const firebaseConfig = {
  apiKey: "AIzaSyDJJm4OprEFNNwO0x7FOLC92tBzs8F_Kb0",

  authDomain: "jobmatchwebapp.firebaseapp.com",

  databaseURL: "https://jobmatchwebapp-default-rtdb.firebaseio.com",

  projectId: "jobmatchwebapp",

  storageBucket: "jobmatchwebapp.firebasestorage.app",

  messagingSenderId: "444804733503",

  appId: "1:444804733503:web:f82650eba64d6f0675b68a",

  measurementId: "G-JJJBKLNCP5"

};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export authentication instance
export { db ,auth, GoogleAuthProvider, signInWithPopup };