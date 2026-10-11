import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBeGs9Za2M34hsrGNCFjj8-0jos4hEWS5I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "whitelablebooking.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://whitelablebooking-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "whitelablebooking",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "whitelablebooking.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "361948078049",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:361948078049:web:54bf5d1aab0cd772c83ca0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2HYRWGXNPT"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'client-marquee-prod'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let rtdb: Database | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    storage = getStorage(app);

    // Initialize analytics in supported browser environments
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch((e) => {
        console.warn('Analytics initialization skipped:', e);
      });
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, auth, db, rtdb, storage, analytics };
