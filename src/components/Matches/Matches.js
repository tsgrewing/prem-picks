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

  function getMatches(week) {

    const config = {
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures",
      params: {league: 39, season: 2022, round: `Regular Season - ${week}`}, 
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

    return (
      <>
      <div className="ml-auto mr-auto relative w-64">
        <select className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange={event => getMatches(event.target.value)}>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          <option value="4">Week 4</option>
          <option value="5">Week 5</option>
          <option value="6">Week 6</option>
          <option value="7">Week 7</option>
          <option value="8">Week 8</option>
          <option value="9">Week 9</option>
          <option value="10">Week 10</option>
          <option value="11">Week 11</option>
          <option value="12">Week 12</option>
          <option value="13">Week 13</option>
          <option value="14">Week 14</option>
          <option value="15">Week 15</option>
          <option value="16">Week 16</option>
          <option value="17">Week 17</option>
          <option value="18">Week 18</option>
          <option value="19">Week 19</option>
          <option value="20">Week 20</option>
          <option value="21">Week 21</option>
          <option value="22">Week 22</option>
          <option value="23">Week 23</option>
          <option value="24">Week 24</option>
          <option value="25">Week 25</option>
          <option value="26">Week 26</option>
          <option value="27">Week 27</option>
          <option value="28">Week 28</option>
          <option value="29">Week 29</option>
          <option value="30">Week 30</option>
          <option value="31">Week 31</option>
          <option value="32">Week 32</option>
          <option value="33">Week 33</option>
          <option value="34">Week 34</option>
          <option value="35">Week 35</option>
          <option value="36">Week 36</option>
          <option value="37">Week 37</option>
          <option value="38">Week 38</option>
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