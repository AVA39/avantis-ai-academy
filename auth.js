import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureProfile(cred.user);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
  window.location.href = 'index.html';
}

export function requireAuth(redirectTo = 'index.html') {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async user => {
      unsub();
      if (!user) {
        window.location.href = redirectTo;
        reject(new Error('Not authenticated'));
      } else {
        const profile = await getProfile(user.uid);
        resolve({ user, profile });
      }
    });
  });
}

export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

async function ensureProfile(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      role: 'employee',
      createdAt: serverTimestamp()
    });
  }
}

export function currentUser() {
  return auth.currentUser;
}
