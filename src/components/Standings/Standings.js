import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Standings.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import {rapidKey} from "../../config.js"

function Standings() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState([]);
  const [week, setWeek] = useState([]);

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

  const getCurrentRound = async () => {
    const config ={
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures/rounds?season=2022&league=39",
      params: {league: "39", season:"2022", current: "true"},
      headers: {
        'x-rapidapi-key': rapidKey, 
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };
      axios(config)
    .then(response => {
      let week = response.data.response[0];
      setWeek(week);
      console.log(week);
    })
    .catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    getCurrentRound();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);

  return (
    <div className="dashboard">
      <button onClick={getCurrentRound}>Get Round</button>

    </div>
  );
}

export default Standings;