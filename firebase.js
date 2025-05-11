// ✅ Import Firebase Core SDK
import { initializeApp } from 'firebase/app';

// ✅ Import Auth SDK with React Native Persistence Support
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';

// ✅ Import Firestore Database SDK
import { getFirestore } from 'firebase/firestore';

// ✅ Import AsyncStorage for React Native Persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Your Firebase Configuration (replace with your actual values if needed)
const firebaseConfig = {
  apiKey: "AIzaSyD...YourAPIKey",
  authDomain: "farward876-app.firebaseapp.com",
  projectId: "farward876-app",
  storageBucket: "farward876.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg1234567"
};

// ✅ Initialize Firebase App (Singleton)
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth with AsyncStorage persistence (Required for React Native)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// ✅ Initialize Firestore Database
const db = getFirestore(app);

// ✅ Export instances to use in your app
export { auth, db };