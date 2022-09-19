import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Matches.css";
import { auth, db, logout } from "../../firebase";
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
      getMatches(week);
    })
    .catch(err => {
      console.log(err);
    });
  };

  function getMatches(week) {

    const config = {
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures",
      params: {league: 39, season: 2022, round: week}, 
      headers: {
        'x-rapidapi-key': rapidKey, 
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

    axios(config)
      .then(function (response) {
        setMatches(response.data.response);
      })
      .catch(function (error) {
        console.log(error);
      });

    setWeek(`Regular Season - ${week}`);
  }

    useEffect(() => {
      if (loading) return;
      if (!user) return navigate("/");

      fetchUserName();
    }, [user, loading]);

    useEffect(() => {
      getCurrentRound();
    }, []);

    useEffect(() => {
      getMatches();
    }, []);

    return (
      <>
      <div className="ml-auto mr-auto relative w-64">
        <select className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange={event => getMatches(`Regular Season - ${event.target.value}`)}>
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
          <div className='w-1/3 p-2 flex justify-center items-center' >
            <input className="inline appearance-none block w-10 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 text-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id={match.fixture.id + "homeScore"} type="text" />
            <div className="flex w-8 h-px bg-gray-400 mx-5"></div>
            <input className="inline appearance-none block w-10 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 text-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id={match.fixture.id + "awayScore"}  type="text" />
          </div>
        
        : match.fixture.status.short ==="PST" ?


          <div className='w-1/3 p-2 flex justify-center items-center'>
            <p className="sm:text-2xl content-center">Postponed</p>
          </div>

        :
          <div className='w-1/3 p-2 flex justify-center items-center'>
            <p className="sm:text-2xl">{match.goals.home} - {match.goals.away}</p>
          </div>
        }

        <div className='w-1/3 p-2 flex justify-center items-center' id={match.fixture.id + "-away"}>
          <p className="inline sm:text-2xl">{match.teams.away.name}  </p>
          <img className="object-scale-down inline" alt="club crest" src={match.teams.away.logo} />
        </div>
      </div>
        )
      }

      </>
    );
}

export default Matches;