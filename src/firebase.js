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
  addDoc,
  where,
  getDoc,
  updateDoc,
  deleteDoc, 
  doc,
  setDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRkAvicSXN5HDY_RkiHYkcJvOjd4x7avE",
  authDomain: "prem-picks.firebaseapp.com",
  projectId: "prem-picks",
  storageBucket: "prem-picks.appspot.com",
  messagingSenderId: "710111060123",
  appId: "1:710111060123:web:1c09e045112bcbe922263e",
  measurementId: "G-B879WNSY2E",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const predictionCollection = collection(db, "predictions");

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

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

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

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

    
    // const addPredictions = (newPrediction) => {
    //     return addDoc(predictionCollection, newPrediction);
    // };

    // const updatePrediction = (id, updatedPrediction) => {
    //     const predictionRef = doc(db, "predictions", id);
    //     return updateDoc(predictionRef, updatedPrediction);
    // };

    // const getAllPredictions = getDocs(predictionCollection)
    // .then(res => {

    //     res.forEach((doc) => {
    //       // doc.data() is never undefined for query doc snapshots
    //       console.log(doc.id, " => ", doc.data());
    // });
    // });

    async function getUserPredictions(userId)  {
        const queryParams = query((predictionCollection), where("uid", "==", userId));
        let predictionList = [];
        const querySnapshot = await getDocs(queryParams);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          predictionList.push(doc.data());
        })
        return predictionList;
    }

    async function getRoundPredictions(round, userId)  {
        const queryParams = query((predictionCollection), where("uid", "==", userId)).where("round", "==", round);
        let predictionList = [];
        const querySnapshot = await getDocs(queryParams);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          predictionList.push(doc.data());
        })
        return predictionList;
    }

    function sendUserPredictions(docId, predictions) {
        setDoc(doc(db, 'predictions', docId), predictions)
        .then(() => {
            console.log("Predictions updated!")
        })
        .catch(err => {
            console.log(err)
        })
    }


export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  sendUserPredictions,
  getUserPredictions,
  getRoundPredictions
};
