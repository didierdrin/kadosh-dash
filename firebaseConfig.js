// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0C_97SgClB8eBnFd58YYqVhaJpiHDBNI",
  authDomain: "kadosh-2a834.firebaseapp.com",
  projectId: "kadosh-2a834",
  storageBucket: "kadosh-2a834.appspot.com",
  messagingSenderId: "891689285695",
  appId: "1:891689285695:web:81c030dca0122f7731e08a",
  measurementId: "G-6TNPVH2J09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db };