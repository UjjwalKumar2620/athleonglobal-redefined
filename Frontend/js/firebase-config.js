// ═══════════════════════════════════════════
// FIREBASE CONFIG — Athleon Global (Frontend only)
// Fill in your Firebase project config below.
// This file is safe to expose publicly — it only
// contains public identifiers, not secrets.
// ═══════════════════════════════════════════

// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Create a project OR use an existing one
// 3. Go to Project Settings → Your Apps → Add Web App
// 4. Copy the config object and paste it below
// 5. In Firebase Console: Authentication → Sign-in method → Enable Google

const firebaseConfig = {
  apiKey: "AIzaSyAoq1a53wT6qiRphmYwpNTRcAcqJ6PN7f0",
  authDomain: "athleonglobal-redefined.firebaseapp.com",
  projectId: "athleonglobal-redefined",
  storageBucket: "athleonglobal-redefined.firebasestorage.app",
  messagingSenderId: "851353931716",
  appId: "1:851353931716:web:7efecd042d41a69c5fde91",
  measurementId: "G-GPRP44L8Z2"
};

// ─── Initialize Firebase ───
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;
let firebaseReady = false;

function initFirebase() {
  try {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded. Google Sign-In will be unavailable.');
      return false;
    }

    // Only init if config is filled in
    if (firebaseConfig.apiKey === 'REPLACE_WITH_FIREBASE_API_KEY') {
      console.warn('Firebase config not set. Google Sign-In unavailable. See Frontend/js/firebase-config.js');
      return false;
    }

    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.apps[0];
    }

    firebaseAuth = firebase.auth();
    googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    firebaseReady = true;
    console.log('✅ Firebase initialized');
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e.message);
    return false;
  }
}

// ─── Google Sign-In ───
async function signInWithGoogle() {
  if (!firebaseReady) {
    initFirebase();
    if (!firebaseReady) {
      throw new Error('Firebase not configured. Please set up firebase-config.js');
    }
  }

  const result = await firebaseAuth.signInWithPopup(googleProvider);
  const user = result.user;

  return {
    name: user.displayName || 'Athlete',
    email: user.email || '',
    photo: user.photoURL || '',
    uid: user.uid
  };
}

// ─── Sign Out ───
async function signOutGoogle() {
  if (firebaseReady && firebaseAuth) {
    await firebaseAuth.signOut();
  }
}

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => initFirebase());
