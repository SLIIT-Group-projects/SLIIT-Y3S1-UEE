// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth  } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, collection} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMod_jl72WxrFa2oRLY1rFBLZtx2hMO7I",
  authDomain: "natura-firebase-chat.firebaseapp.com",
  projectId: "natura-firebase-chat",
  storageBucket: "natura-firebase-chat.appspot.com",
  messagingSenderId: "538740401248",
  appId: "1:538740401248:web:42c3f81f634c21347bcf05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export const db = getFirestore(app);

export const userRef = collection(db, 'users');

export const roomRef = collection(db, 'rooms');