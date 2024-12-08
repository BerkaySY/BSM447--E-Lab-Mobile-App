import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyA4CoHWBlxfGgEhotacJTvRXJdOVexYFyQ",
    authDomain: "mobilproje-6b8f3.firebaseapp.com",
    projectId: "mobilproje-6b8f3",
    storageBucket: "mobilproje-6b8f3.firebasestorage.app",
    messagingSenderId: "182436840586",
    appId: "1:182436840586:web:8789cc85f2c821302f9973"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
