import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyC2HJRhYR2dSyKbb8iSU8wZcQTgm4IfnYg",
    authDomain: "compoundfinanceclone.firebaseapp.com",
    projectId: "compoundfinanceclone",
    storageBucket: "compoundfinanceclone.appspot.com",
    messagingSenderId: "812742349989",
    appId: "1:812742349989:web:f0fba1903045d13251294c"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default db;