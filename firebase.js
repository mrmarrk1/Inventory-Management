// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVE-HI4gJYZybUOSDDpDPK1_5BBBFYrr8",
  authDomain: "inventory-management-8642b.firebaseapp.com",
  projectId: "inventory-management-8642b",
  storageBucket: "inventory-management-8642b.appspot.com",
  messagingSenderId: "851413949668",
  appId: "1:851413949668:web:761d04cf21eac9edc660f1",
  measurementId: "G-M2C07N5J0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
