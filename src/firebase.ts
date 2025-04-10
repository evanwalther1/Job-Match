import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import {getStorage}from "firebase/storage";

import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";


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
const auth = getAuth();


// Set persistence when your app initializes
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // This persistence setting will keep users logged in until they explicitly sign out
    console.log("Persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });


const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app);
// Export authentication instance
export { storage, db ,auth, GoogleAuthProvider, signInWithPopup };
