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

// Attempt login with google authentication provider

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

// Login with email and password

const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// Register user with email and password
const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// Password reset functionality
const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// Logout
const logout = () => {
    signOut(auth);
};

// Exports
export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
  };