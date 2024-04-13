import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkK854_AgN6tUdL2IXY4bViQqmzwEC6d8",
  authDomain: "tncpl-newsapi.firebaseapp.com",
  projectId: "tncpl-newsapi",
  storageBucket: "tncpl-newsapi.appspot.com",
  messagingSenderId: "163633604250",
  appId: "1:163633604250:web:0d648da22474bb1d616123",
  measurementId: "G-XLZJZBRG5H",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export default db = getFirestore(app);

// Initialize Auth
export const firebase_auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
