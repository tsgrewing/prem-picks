import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { getAllPredictions, getUserPredictions } from "../../firebase";

function Standings() {
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
     getUserPredictions(id)
     .then(res => {
      setPredictions(res)
        console.log(predictions)
     });
  };

  return (
    <div className="profile">
        <button onClick={getUserPicks}>Get Predictions</button>
        {(predictions.length > 0) &&
          <div>
            <p> {predictions.home} - {predictions.away}</p>
          </div>
        }
    </div>
  );
}

export default Standings;