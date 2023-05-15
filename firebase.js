// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfK46wmFPHC1lhSRzn6AN7GMtk5zwPjH4",
  authDomain: "instagram-clone-56958.firebaseapp.com",
  projectId: "instagram-clone-56958",
  storageBucket: "instagram-clone-56958.appspot.com",
  messagingSenderId: "551023437847",
  appId: "1:551023437847:web:c69940ce0a0cf64e535452"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };