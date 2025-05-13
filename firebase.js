import { getApps, getApp, initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Initialize Firebase App only if not already initialized
const app = getApps().length ? getApp() : initializeApp();

// Firestore instance
const db = firestore();

// Export Auth and Firestore
export { auth, db };
