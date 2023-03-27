// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "@firebase/database";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbIZ_dvBQqN304ge5852rk9t-LAHmDg00",
  authDomain: "label-checks.firebaseapp.com",
  projectId: "label-checks",
  storageBucket: "label-checks.appspot.com",
  messagingSenderId: "67435865610",
  appId: "1:67435865610:web:5b97dd950fdb269acc61f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app)

const firestore = getFirestore(app)

export { app, db, firestore }