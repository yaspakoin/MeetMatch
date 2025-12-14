import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyARHAo8zGyAo3FenFLJmvYaTX2Ndq5e3IE",
  authDomain: "meetmatch-da5ec.firebaseapp.com",
  projectId: "meetmatch-da5ec",
  storageBucket: "meetmatch-da5ec.firebasestorage.app",
  messagingSenderId: "199993363216",
  appId: "1:199993363216:web:1d965e9cdd5a9468017395",
  measurementId: "G-25QXXRFGPK"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);