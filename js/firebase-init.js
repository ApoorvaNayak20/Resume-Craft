import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

if (window.FIREBASE_ENABLED && window.firebaseConfig?.apiKey && !window.firebaseConfig.apiKey.startsWith("PASTE_")) {
  const app = initializeApp(window.firebaseConfig);
  window.firebaseModules = {
    auth: getAuth(app), db: getFirestore(app),
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    setPersistence, browserLocalPersistence, browserSessionPersistence,
    GoogleAuthProvider, signInWithPopup, doc, setDoc, getDoc, serverTimestamp
  };
}
