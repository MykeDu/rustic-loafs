import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBX4cIOABEndVmXGQj8yQKMeHOB29ylkEw",
  authDomain: "rusticloafs.firebaseapp.com",
  projectId: "rusticloafs",
  storageBucket: "rusticloafs.firebasestorage.app",
  messagingSenderId: "7021305131",
  appId: "1:7021305131:web:db012f2e9709070baef96e"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
