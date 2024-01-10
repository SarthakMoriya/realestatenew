// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  apiKey: "AIzaSyBuAlb0G0V3zxpBERGtECUs7mvFFasorC0" ,
  authDomain: "mern-estate-eb7b5.firebaseapp.com",
  projectId: "mern-estate-eb7b5",
  storageBucket: "mern-estate-eb7b5.appspot.com",
  messagingSenderId: "1048501839481",
  appId: "1:1048501839481:web:c0db9701e441c9691f16a8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);