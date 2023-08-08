import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../../firebase";
import {rapidKey} from "../../config.js"
import axios from "axios";

import { query, collection, getDocs, setDoc, addDoc, where, doc } from "firebase/firestore";

const userCollection = collection(db, "users");
const standingsCollection = collection(db, "standings2023");

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();

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

  async function startSeason (){
    const querySnapshot = await getDocs(userCollection);
    // const standingsSnapshot = await getDocs(standingsCollection);
    // standingsSnapshot.forEach(doc => {
    //   console.log(doc.data());

    // })
    // let predictionList = [];
    querySnapshot.forEach((user) => {
      console.log(user.data())
      const docId = `${user.data().uid} - 2023`;
      const docData = {
        rounds: [],
        score: 0,
        name: user.data().name,
        userId: user.data().uid,
        correct: 0, 
        incorrect: 0,
        exactos: 0
      };
      setDoc(doc(db, 'standings2023', docId), docData) 
    // console.log(predictionList)
    // return predictionList;
    });
  };

  async function getRounds (comp) {
    const config = {
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures/rounds",
      params: {league: comp, season: 2023}, 
      headers: {
        'x-rapidapi-key': rapidKey, 
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

      axios(config)
      .then((response) => {
        let res = ((response.data));
         console.log(res)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        {/* Logged in as
        <div>{name}</div>
        <div>{user?.email}</div> */}
        <button className="dashboard__btn" onClick={startSeason}>
          Start New Season
        </button>
        <select className="dashboard__btn" defaultValue={"default"} onChange={event => getRounds(event.target.value)}>
          <option value={"default"} disabled>Get Round List</option>
          <option value="39">English Premier League</option>
          <option value="2">UEFA Champions League</option>
          <option value="3">UEFA Europa League</option>
        </select>

      </div>
    </div>
  );
}

export default Dashboard;