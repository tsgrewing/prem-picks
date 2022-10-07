import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Matches.css";
import { auth, db, getRoundPredictions, getUserPredictions, logout, sendUserPredictions } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import {rapidKey} from "../../config.js"


function Matches() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState([]);
  const [week, setWeek] = useState([]);
  const [predictionsList, setPredictions] = useState({});
  const [submit, setSubmit] = useState({});
  const [showModal, setShowModal] = useState(false);
  
  let predictions =[];
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

  // function setWeek(event) {
  //   this.setState({week: event.target.value})
  // };

  function setMatches(matchArr){
    setMatchList(matchArr);
    console.log(matchList)
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
      let currentWeek = response.data.response[0];
      setWeek(currentWeek);
      getMatches(currentWeek);
      getUserPredictions(currentWeek);
    })
    .catch(err => {
      console.log(err);
    });
  };

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
        const matchArray = (response.data.response);
        setMatches(matchArray);
        for(let i=0; i <matchArray.length; i++){
          if(matchArray[i].fixture.status.short === "NS"){
            console.log(matchArray[i].fixture.status.short)
            setSubmit(true);
            break;
          }
          else {
            setSubmit(false);
          }

        }
        
      })
      .catch((error) => {
        console.log(error);
      });



    setWeek(chosenWeek);
  };

  async function getPredictions(matchWeek) {
    getUserPredictions(id, matchWeek)
    .then(res => {
      if(res.length > 0) {
     setPredictions(res[0].predictions)
     console.log(res)
      }
    })
   
  }

  function updatePrediction (matchId, side, score, teamName) {
    let matchExists = predictions.find((match, i) => {
        if (match.id === matchId && side === "away") {
            predictions[i].away.score = score;
            predictions[i].away.name = teamName;
            return true;
        }
        else if (match.id === matchId && side === 'home') {
            predictions[i].home.score = score;
            predictions[i].home.name = teamName;
            return true;
        }
        else {
            return false;
        };
    });

    if (!matchExists) {
        if (side === 'away') {
            predictions.push({id: matchId, away: { score: score, name: teamName }, home: { score: '', name: ''}})
        }
        else if (side === 'home') {
            predictions.push({id: matchId, home:{ score: score, name: teamName }, away: { score: '', name: '' }})
        }
    }
  }

  // Save predictions and push to database

  function savePredictions(){
    const docId = `${week} - ${id}`;
    // const inputs = document.querySelectorAll("input[type=number]");
    // for (let i = 0; i < inputs.length; i++) {
    //   text += cars[i] + "<br>";
    // }
    document.querySelectorAll("input[type=number]").forEach(i => i.value = null)
    if (predictions === []){
      predictions = predictionsList;
    } 
    const predictionDoc = {
        round: week,
        user: name,
        uid: id,
        predictions: predictions
    };
    setPredictions(predictions);
    sendUserPredictions(docId, predictionDoc);
    setShowModal(true);
    // console.log(predictionsList);
  }
  
  async function updateMatches (matchWeek){
    getMatches(matchWeek);
    getPredictions(matchWeek);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);

  useEffect(() => {
    getCurrentRound();
  }, []);

  // Show the submit button if predictions are possible.
  const Modal = () => {
    return (
      <>
            <div className="flex mt-5 content-center justify-center">
            <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" data-modal-toggle="defaultModal" onClick={savePredictions}>
                Submit
            </button>
            </div>
          {showModal ? (
          <>
            <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                    <h3 className="text-3xl">Great Success!</h3>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                      
                      onClick={() => setShowModal(false)}
                    >
                        <p>X</p>
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <p>Your picks have been submitted!</p>
                  </div>
                  <div className="flex mt-5 content-center justify-center">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-auto py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
    );
  };


    return (
      <>
      <div className="ml-auto mr-auto relative w-64">
        <select defaultValue={"default"} className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange={event => updateMatches(`Regular Season - ${event.target.value}`)}>
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
      {matchList.map(match =>
        <div key={match.fixture.id + "Row"} className='flex justify-content-center flex-wrap h-20'>

          <div className='w-1/3 p-2 flex justify-center items-center' id={match.fixture.id + "-home"} >
            <img className="text-center object-scale-down inline" alt="club crest" src={match.teams.home.logo} />
            <p className="sm:text-2xl text-center">  {match.teams.home.name}</p>
          </div>

         {(match.fixture.status.short === "NS") ?
          <div className='w-1/3 p-2 flex justify-center items-center' id={match.fixture.id}>
            <input data-teamname={match.teams.home.name} name="home" className="inline appearance-none block w-10 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 text-2xl text-center leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id={match.fixture.id + "homeScore"} onChange={event => updatePrediction(match.fixture.id, event.target.name, event.target.value, event.target.getAttribute("data-teamname"))} type="number" />
            <div className="flex w-8 h-px bg-gray-400 mx-5"></div>
            <input data-teamname={match.teams.away.name} name="away" className="inline appearance-none block w-10 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 text-2xl text-center leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id={match.fixture.id + "awayScore"}  onChange={event => updatePrediction(match.fixture.id, event.target.name, event.target.value, event.target.getAttribute("data-teamname"))} type="number" />
          </div>
        
        : match.fixture.status.short ==="PST" ?


          <div className='w-1/3 p-2 flex justify-center items-center'>
            <p className="sm:text-2xl content-center">Postponed</p>
          </div>

        :
          <div className='w-1/3 p-2 flex justify-center items-center'>
            <p className="sm:text-2xl">{match.goals.home} - {match.goals.away}</p>
            {/* {(predictions.length > 0) &&
            
            <div>

            </div>
            } */}
          </div>
        }

        <div className='w-1/3 p-2 flex justify-center items-center' id={match.fixture.id + "-away"}>
          <p className="inline sm:text-2xl">{match.teams.away.name}  </p>
          <img className="object-scale-down inline" alt="club crest" src={match.teams.away.logo} />
        </div>
      </div>
        )
      }
                  
            {/* Button */}
            {submit &&
            <Modal />
            }

      </>
    );
}

export default Matches;