
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBnIiRN0Vvkq6zV8pm-d34LRAJJ16sdTjA",
  authDomain: "videocall-72680.firebaseapp.com",
  projectId: "videocall-72680",
  storageBucket: "videocall-72680.firebasestorage.app",
  messagingSenderId: "444710395417",
  appId: "1:444710395417:web:8192595be88497d57ed488",
  measurementId: "G-50FV5FJG6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
