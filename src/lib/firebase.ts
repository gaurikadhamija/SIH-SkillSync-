import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DashboardRole } from '../types';

export class FirestorePermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirestorePermissionError';
  }
}

export function handleFirestoreError(error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  console.warn('[Firestore Service Notice]:', msg);
}

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned named database
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on boot per Skill Guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Offline or network restricted. Local cache active.');
    }
  }
}

testConnection();

// Demo preset credentials for easy role-switching & testing
export const DEMO_USERS: Record<DashboardRole, { email: string; name: string; title: string; defaultOrg: string }> = {
  student: {
    email: 'alex.student@skillsync.edu',
    name: 'Alex Sharma',
    title: 'Pre-Final CSE & Data Scholar',
    defaultOrg: 'Delhi Technological University'
  },
  employer: {
    email: 'priya.talent@techcorp.in',
    name: 'Priya Nair',
    title: 'VP of Engineering & Talent Audit',
    defaultOrg: 'Tata Consultancy & Automotive Hub'
  },
  government: {
    email: 'menon.director@nsdc.gov.in',
    name: 'Dr. V. Menon',
    title: 'Director of Workforce Telemetry',
    defaultOrg: 'National Skill Development Council (NSDC)'
  }
};
