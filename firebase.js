import { initializeApp } from 'firebase/app';

import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';

import { getFirestore } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBHsrhP2IZqgb2e1x6UZVZx4JhAqDFWi7k1",
  authDomain: "farward876-app.firebaseapp.com",
  projectId: "farward876-app",
  storageBucket: "farward876.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg1234567"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };