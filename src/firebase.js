import { initializeApp } from "firebase/app";
import {
GoogleAuthProvider,
getAuth,
signInWithPopup,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendPasswordResetEmail,
signOut,
} from "firebase/auth";
import {
getFirestore,
query,
getDocs,
collection,
where,
addDoc,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDRkAvicSXN5HDY_RkiHYkcJvOjd4x7avE",
    authDomain: "prem-picks.firebaseapp.com",
    projectId: "prem-picks",
    storageBucket: "prem-picks.appspot.com",
    messagingSenderId: "710111060123",
    appId: "1:710111060123:web:1c09e045112bcbe922263e",
    measurementId: "G-B879WNSY2E"
  };

const app = ​​initializeApp(firebaseConfig);
​​const auth = getAuth(app);
​const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};