import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD...YourAPIKey",
  authDomain: "farward876-app.firebaseapp.com",
  projectId: "farward876-app",
  storageBucket: "farward876.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg1234567"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);