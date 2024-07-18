import RNAsyncStorage from "@react-native-async-storage/async-storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsg1BTkc_nZ5EjMi4eGUZHzCt-qhqJA9g",
  authDomain: "carbon-app-6efd9.firebaseapp.com",
  projectId: "carbon-app-6efd9",
  storageBucket: "carbon-app-6efd9.appspot.com",
  messagingSenderId: "172579995311",
  appId: "1:172579995311:web:eeb0e700c2b9f579ca9e5a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(RNAsyncStorage),
});

const firestore = getFirestore(app);
const functions = getFunctions(app);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export { firebaseAuth, firestore };
