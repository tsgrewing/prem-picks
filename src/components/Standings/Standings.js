import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Standings.css";
import { auth, db, getRoundPredictions, logout, updatePredictionResults } from "../../firebase";
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
  const [predictions, setPredictions] = useState([]);

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
      console.log(week)
      resultTable(week)
    })
    .catch(err => {
      console.log(err);
    });
  };

  let predictionArray =[];

  async function scorePredictions() {
  
    predictions.forEach(person => {
      let userPrediction = person;
      userPrediction.results = {
      exactos: 0,
      correct: 0,
      incorrect: 0,
      roundScore: 0
      };
      userPrediction.bgColor ="";
       
      userPrediction.predictions.forEach(game => {      
        const matchObj = matchList.find(obj => {
                    return obj.fixture.id === game.id
                  })
        
        if (matchObj.goals.home == game.home.score && matchObj.goals.away == game.away.score) {
            userPrediction.results.exactos ++;
            userPrediction.results.roundScore = +3;
            game.result = "exacto";
            game.colors = "bg-green-200"
        }
        else if ((matchObj.goals.home > matchObj.goals.away && game.home.score > game.away.score) || (matchObj.goals.home < matchObj.goals.away && game.home.score < game.away.score) || (matchObj.goals.home === matchObj.goals.away && game.home.score === game.away.score)) {
          userPrediction.results.correct ++;
          userPrediction.results.roundScore ++;
          game.result = "correct";
          game.colors = "bg-lime-100"

        }
        else {
          game.result = "incorrect";
          userPrediction.results.incorrect ++;
          game.colors = "bg-red-200"
        }
        
      })
      predictionArray.push(userPrediction) 
      // setPredictions(predictionArray)
    })
  
    predictionArray.forEach(doc => {
      const docId = `${doc.round} - ${doc.uid}`
      updatePredictionResults(docId, doc)
    })

      console.log(predictionArray)
      // predictionArray.sort((a,b) => (a.results.roundScore > b.results.roundScore ? 1:-1))

  };
  

  // const compileStandings = async (currentWeek) => {
  //   let weekNum = currentWeek.slice(-2).trim();

  function getMatches(chosenWeek) {

    const config = {
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures",
      params: {league: 39, season: 2022, round: chosenWeek}, 
      headers: {
        'x-rapidapi-key': rapidKey, 
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

    axios(config)
      .then((response) => {
        setMatches(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });

    setWeek(chosenWeek);
  };

  function setMatches(matchArr){
    setMatchList(matchArr);
  };

  async function resultTable(round) {
    getMatches(round);
    await getRoundPredictions(round)
    .then(res => {
      setPredictions(res)
      scorePredictions()

    });

  };

  const isReady  = () => {
    if (predictions.length > 0 && matchList.length > 0) {
      scorePredictions();
      return true;
    }
    else {
      return false;
    }
  }

  useEffect(() => {
    getCurrentRound();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);

  return (
    <>
    <div className="ml-auto mr-auto relative w-64">
      <select defaultValue={"default"} className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange={event => resultTable(`Regular Season - ${event.target.value}`)}>
        <option value={"default"} disabled>Current Match Week</option>
        <option value="1">Match Week 1</option>
        <option value="2">Match Week 2</option>
        <option value="3">Match Week 3</option>
        <option value="4">Match Week 4</option>
        <option value="5">Match Week 5</option>
        <option value="6">Match Week 6</option>
        <option value="7">Match Week 7</option>
        <option value="8">Match Week 8</option>
        <option value="9">Match Week 9</option>
        <option value="10">Match Week 10</option>
        <option value="11">Match Week 11</option>
        <option value="12">Match Week 12</option>
        <option value="13">Match Week 13</option>
        <option value="14">Match Week 14</option>
        <option value="15">Match Week 15</option>
        <option value="16">Match Week 16</option>
        <option value="17">Match Week 17</option>
        <option value="18">Match Week 18</option>
        <option value="19">Match Week 19</option>
        <option value="20">Match Week 20</option>
        <option value="21">Match Week 21</option>
        <option value="22">Match Week 22</option>
        <option value="23">Match Week 23</option>
        <option value="24">Match Week 24</option>
        <option value="25">Match Week 25</option>
        <option value="26">Match Week 26</option>
        <option value="27">Match Week 27</option>
        <option value="28">Match Week 28</option>
        <option value="29">Match Week 29</option>
        <option value="30">Match Week 30</option>
        <option value="31">Match Week 31</option>
        <option value="32">Match Week 32</option>
        <option value="33">Match Week 33</option>
        <option value="34">Match Week 34</option>
        <option value="35">Match Week 35</option>
        <option value="36">Match Week 36</option>
        <option value="37">Match Week 37</option>
        <option value="38">Match Week 38</option>
      </select>
    </div>
      {isReady() &&
      <div className="px-2.5 w-full">
      <table className="text-sm w-full border-separate border border-slate-500 text-left text-gray-500 " id="resultTable">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr className=" ">
            <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500">Match</th>
            <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500 text-center">Result</th>
            {predictions.map(doc => 
              <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500">{doc.user}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {matchList.map(match =>
            <tr className="">
              <td className="border-collapse border border-slate-500">
              <img className="text-center object-scale-down inline px-2" alt="club crest" src={match.teams.home.logo} />
              {match.teams.home.name} - {match.teams.away.name}
              <img className="object-scale-down inline px-2" alt="club crest" src={match.teams.away.logo} />

              </td>
              <td className="border-collapse border border-slate-500 text-center">{match.goals.home} - {match.goals.away}</td>
              {predictionArray.map(doc => {
                const matchObj = doc.predictions.find(obj => {
                  return obj.id === match.fixture.id
                })
                return (
                  <td className={"border-collapse border border-slate-500 text-center " + matchObj.colors}>{matchObj.home.score} - {matchObj.away.score}</td>
                )} 
              )}
            </tr>

            )}
        </tbody>
      </table>
      </div> 
      }
    </>
  );
}

export default Standings;