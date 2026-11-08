// 1. Create a Firebase project and register a Web App.
// 2. Paste the configuration values from Firebase Console below.
// 3. Set FIREBASE_ENABLED to true only after configuring Firebase.
//
// Never put private service-account keys in frontend JavaScript.
// Firebase web config is designed to be public; protect data with Security Rules.

window.FIREBASE_ENABLED = false;

window.firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
