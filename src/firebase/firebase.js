import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDV6D_x3xn_a4WuZGyGDO-TcRc6tTAdYQ4",
  authDomain: "booklovers-467e1.firebaseapp.com",
  projectId: "booklovers-467e1",
  storageBucket: "booklovers-467e1.appspot.com",
  messagingSenderId: "248435170769",
  appId: "1:248435170769:web:f5468e6635143809fb14f0",
  measurementId: "G-HQSSDLH93T",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
