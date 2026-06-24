import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDKrJwzlJNZuA_oB-HmzFxhedA-LYZwdmg",
  authDomain:        "avantis-academy.firebaseapp.com",
  projectId:         "avantis-academy",
  storageBucket:     "avantis-academy.firebasestorage.app",
  messagingSenderId: "300238668914",
  appId:             "1:300238668914:web:643299c84ec1500639aeeb",
  measurementId:     "G-WY2WLW3BW3"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { auth, db };
