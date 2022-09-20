import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { auth, db, logout } from "../../firebase";
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



  function getUserPicks() {
     getRoundPredictions("Regular Season - 1")
     .then(res => {
      setPredictions(res[0].predictions)
     })
     .then(() =>{
      console.log(predictions)
    });
  };

  return (
    <div className="profile">
        <button onClick={getUserPicks}>Get Predictions</button>
        {(predictions.length > 0) &&
          <div>
            {predictions.map(doc => 
            <p key={doc.id}> {doc.home.name} {doc.home.score} - {doc.away.score} {doc.away.name}</p>
            ) 
          }
          </div>
        }
    </div>
  );
}

export default Profile;