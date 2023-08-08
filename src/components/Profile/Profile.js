import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { auth, db, logout, updatePredictionResults } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { getRoundPredictions } from "../../firebase";

function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState({});

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setId(data.uid);

      setName(data.name);
      
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);



//   async function getUserPicks() {
//      await getRoundPredictions("Regular Season - 1")
//      .then(res => {
//       setPredictions(res)
//      })
//      .then(() =>{

//       scorePredictions()
//     });
//   };



// function scorePredictions() {
//   let predictionArray =[];

//   predictions.forEach(person => {
//     let userPrediction = person;
//     userPrediction.results = {
//     exactos: 0,
//     correct: 0,
//     incorrect: 0,
//     roundScore: 0
//     };
     
//     userPrediction.predictions.forEach(game => {      
//       const matchObj = matchList.find(obj => {
//                   return obj.fixture.id === game.id
//                 })
      
//       if (matchObj.goals.home == game.home.score && matchObj.goals.away == game.away.score) {
//           userPrediction.results.exactos ++;
//           userPrediction.results.roundScore = +3;
//           game.result = "exacto";

//       }
//       else if ((matchObj.goals.home >= matchObj.goals.away && game.home.score >= game.away.score) || (matchObj.goals.home < matchObj.goals.away && game.home.score < game.away.score)) {
//         userPrediction.results.correct ++;
//         userPrediction.results.roundScore ++;
//         game.result = "correct";

//       }
//       else {
//         game.result = "incorrect";
//         userPrediction.results.incorrect ++;

//       }
      
//     })
//     predictionArray.push(userPrediction) 
//     // console.log(predictionArray)
//     setPredictions(predictionArray)
//   })

//   // predictionArray.forEach(doc => {
//   //   const docId = `${doc.round} - ${doc.uid}`
//   //   updatePredictionResults(docId, doc)
//   // })
// };


  return (
    <div className="profile">
        
    </div>
  );
}

export default Profile;