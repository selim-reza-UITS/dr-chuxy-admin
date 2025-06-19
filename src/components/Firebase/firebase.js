// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD9mQOt_BmzqF6iMV_cxJTsPltPBE4hxI",
  authDomain: "dr-chuxy.firebaseapp.com",
  projectId: "dr-chuxy",
  storageBucket: "dr-chuxy.firebasestorage.app",
  messagingSenderId: "1059713531493",
  appId: "1:1059713531493:web:288a7ad6e50036a00cd08c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;