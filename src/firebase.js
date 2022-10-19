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
const standingsCollection = collection(db, "standings");
// const resultsCollection = collection(db, "results");

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

    async function getRoundPredictions(round)  {
        let queryParams = query((predictionCollection), (where("round", "==", round)));
        let predictionList = [];
        const querySnapshot = await getDocs(queryParams);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
        
          predictionList.push(doc.data());
        })
        console.log(predictionList)
        return predictionList;
    }

    async function getUserPredictions(userId, round)  {
        let queryParams = query((predictionCollection), where("uid", "==", userId), (where("round", "==", round)));
        let predictionList = [];
        const querySnapshot = await getDocs(queryParams);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          predictionList.push(doc.data());
        })
        return predictionList;
    }

    async function getAllUserPredictions(userId) {
      let queryParams = query((predictionCollection), where("uid", "==", userId));
      let predictionList = [];
      const querySnapshot = await getDocs(queryParams);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        predictionList.push(doc.data());
      })
      return predictionList;
    }

    async function getCurrentStats(userId) {
        const standingsSnapshot = await getDoc(doc(db, "standings", userId));
        try {
            // standingsSnapshot.data();
            return standingsSnapshot.data();
        } catch(err) { console.log(err)}
    };

    async function getAllStandings() {
        let standingsArray = [];
        const standingsObj = await getDocs(standingsCollection);
        standingsObj.forEach(doc => {
            standingsArray.push(doc.data())
        })
        console.log(standingsArray)
        return (
            standingsArray.sort((a, b) => (Number(a.score) > Number(b.score) ? -1 : 1))
        )
    };

    async function updateStandings (newStats) {
        const docId = `${newStats.userId} - 2022`
        setDoc(doc(db, 'standings', docId), newStats)
        .then(() => {
            console.log("Stats updated!")
        })
        .catch(err => {
            console.log(err)
        })
    }

    // async function getStandings() {
    //     const querySnapshot = await getDocs((predictionCollection));
        
    //     querySnapshot.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         let resData = doc.data();
    //         if (resData.results) {
    //             getCurrentStats(`${resData.uid} - 2022`)
    //             .then(res => {
    //                 // console.log(res.rounds)
    //                 let updatedStats = {
    //                     rounds: []
    //                 };
    //                 if (res.rounds.indexOf(resData.round) === -1) {
    //                     updatedStats.exactos = resData.results.exactos + res.exactos;
    //                     updatedStats.correct = resData.results.correct + res.correct;
    //                     updatedStats.incorrect = resData.results.incorrect + res.incorrect;
    //                     updatedStats.score = resData.results.roundScore + res.score;
    //                     updatedStats.rounds = (res.rounds);
    //                     updatedStats.rounds.push(resData.round);

    //                     updateStandings(`${resData.uid} - 2022`, updatedStats)
    //                 }
    //             })
         
    //         }
    //       })
    // }


    
    // async function getRoundPredictions(round, userId)  {
    //     const queryParams = query((predictionCollection), where("uid", "==", userId)), where("round", "==", round);
    //     let predictionList = [];
    //     const querySnapshot = await getDocs(queryParams);
    //     querySnapshot.forEach((doc) => {
    //       // doc.data() is never undefined for query doc snapshots
    //       predictionList.push(doc.data());
    //     })
    //     return predictionList;
    // }

    // function getRoundPredictions (round, userId) {
    //     let predictionList = [];
    //     db.collection("predictions")
    //     .where("uid", "==", userId)
    //     .where("round", "==", round)
    //     .get()
    //     .then(querySnapshot => {
    //         querySnapshot.forEach((doc) => {
    //             predictionList.push(doc.data())
    //         })
    //         console.log(predictionList);
    //     })
    // }

    function sendUserPredictions(docId, predictions) {
        updateDoc(doc(db, 'predictions', docId), predictions)
        .then(() => {
            console.log("Predictions updated!")
        })
        .catch(err => {
            console.log(err)
        })
    };

    function updatePredictionResults(docId, obj) {
        updateDoc(doc(db, 'predictions', docId), obj)
        .then(() => {
            console.log("Predictions updated!")
        })
        .catch(err => {
            console.log(err)
        })
    }

    async function getAllPredictions() {
      const querySnapshot = await getDocs(predictionCollection);
      let predictionList = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        predictionList.push(doc.data());
      })
      // console.log(predictionList)
      return predictionList;
    }



    async function getStandings() {
      const querySnapshot = await getDocs((standingsCollection));
      let standingsArray = [];
      querySnapshot.forEach(doc => {
        let resData = doc.data();
        standingsArray.push(resData)
        });
        return standingsArray;

    }



    // const getResults = async (round) => {
    //     const queryParams = query((predictionCollection), (where("round", "==", round)));
    //     let predictionList = [];
    //     const querySnapshot = await getDocs(queryParams);
    //     querySnapshot.forEach((doc) => {
    //       // doc.data() is never undefined for query doc snapshots
    //       predictionList.push(doc.data());
    //     })
    //     return predictionList;
    // }


export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  sendUserPredictions,
  getRoundPredictions,
  getUserPredictions,
  updatePredictionResults,
  getStandings,
  getAllStandings,
  getAllUserPredictions,
  getAllPredictions,
  updateStandings
};
