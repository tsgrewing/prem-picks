import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { auth, db, getAllPredictions, getStandings, logout, sendUserPredictions, updateStandings } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import {rapidKey} from "../../config.js"


function Admin() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [predictionsList, setPredictions] = useState([]);
  const [week, setWeek] = useState([]);
//   const [matchList, setMatchList] = useState([]);

  
    let predictions = [];

    const matchList = [
        {
            "fixture": {
                "id": 867986,
                "referee": "A. Taylor",
                "timezone": "UTC",
                "date": "2022-08-31T18:30:00+00:00",
                "timestamp": 1661970600,
                "periods": {
                    "first": 1661970600,
                    "second": 1661974200
                },
                "venue": {
                    "id": 504,
                    "name": "Vitality Stadium",
                    "city": "Bournemouth, Dorset"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 35,
                    "name": "Bournemouth",
                    "logo": "https://media.api-sports.io/football/teams/35.png",
                    "winner": null
                },
                "away": {
                    "id": 39,
                    "name": "Wolves",
                    "logo": "https://media.api-sports.io/football/teams/39.png",
                    "winner": null
                }
            },
            "goals": {
                "home": 0,
                "away": 0
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 0
                },
                "fulltime": {
                    "home": 0,
                    "away": 0
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867987,
                "referee": "R. Jones",
                "timezone": "UTC",
                "date": "2022-08-31T18:30:00+00:00",
                "timestamp": 1661970600,
                "periods": {
                    "first": 1661970600,
                    "second": 1661974200
                },
                "venue": {
                    "id": 494,
                    "name": "Emirates Stadium",
                    "city": "London"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 42,
                    "name": "Arsenal",
                    "logo": "https://media.api-sports.io/football/teams/42.png",
                    "winner": true
                },
                "away": {
                    "id": 66,
                    "name": "Aston Villa",
                    "logo": "https://media.api-sports.io/football/teams/66.png",
                    "winner": false
                }
            },
            "goals": {
                "home": 2,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 1,
                    "away": 0
                },
                "fulltime": {
                    "home": 2,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867988,
                "referee": "T. Bramall",
                "timezone": "UTC",
                "date": "2022-08-30T18:30:00+00:00",
                "timestamp": 1661884200,
                "periods": {
                    "first": 1661884200,
                    "second": 1661887800
                },
                "venue": {
                    "id": 535,
                    "name": "Craven Cottage",
                    "city": "London"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 36,
                    "name": "Fulham",
                    "logo": "https://media.api-sports.io/football/teams/36.png",
                    "winner": true
                },
                "away": {
                    "id": 51,
                    "name": "Brighton",
                    "logo": "https://media.api-sports.io/football/teams/51.png",
                    "winner": false
                }
            },
            "goals": {
                "home": 2,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 0
                },
                "fulltime": {
                    "home": 2,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867989,
                "referee": "D. England",
                "timezone": "UTC",
                "date": "2022-08-30T19:00:00+00:00",
                "timestamp": 1661886000,
                "periods": {
                    "first": 1661886000,
                    "second": 1661889600
                },
                "venue": {
                    "id": 546,
                    "name": "Elland Road",
                    "city": "Leeds, West Yorkshire"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 63,
                    "name": "Leeds",
                    "logo": "https://media.api-sports.io/football/teams/63.png",
                    "winner": null
                },
                "away": {
                    "id": 45,
                    "name": "Everton",
                    "logo": "https://media.api-sports.io/football/teams/45.png",
                    "winner": null
                }
            },
            "goals": {
                "home": 1,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 1
                },
                "fulltime": {
                    "home": 1,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867990,
                "referee": "C. Pawson",
                "timezone": "UTC",
                "date": "2022-09-01T19:00:00+00:00",
                "timestamp": 1662058800,
                "periods": {
                    "first": 1662058800,
                    "second": 1662062400
                },
                "venue": {
                    "id": 547,
                    "name": "King Power Stadium",
                    "city": "Leicester, Leicestershire"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 46,
                    "name": "Leicester",
                    "logo": "https://media.api-sports.io/football/teams/46.png",
                    "winner": false
                },
                "away": {
                    "id": 33,
                    "name": "Manchester United",
                    "logo": "https://media.api-sports.io/football/teams/33.png",
                    "winner": true
                }
            },
            "goals": {
                "home": 0,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 1
                },
                "fulltime": {
                    "home": 0,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867991,
                "referee": "P. Bankes",
                "timezone": "UTC",
                "date": "2022-08-31T18:45:00+00:00",
                "timestamp": 1661971500,
                "periods": {
                    "first": 1661971500,
                    "second": 1661975100
                },
                "venue": {
                    "id": 598,
                    "name": "London Stadium",
                    "city": "London"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 48,
                    "name": "West Ham",
                    "logo": "https://media.api-sports.io/football/teams/48.png",
                    "winner": null
                },
                "away": {
                    "id": 47,
                    "name": "Tottenham",
                    "logo": "https://media.api-sports.io/football/teams/47.png",
                    "winner": null
                }
            },
            "goals": {
                "home": 1,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 1
                },
                "fulltime": {
                    "home": 1,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867992,
                "referee": "S. Hooper",
                "timezone": "UTC",
                "date": "2022-08-30T18:30:00+00:00",
                "timestamp": 1661884200,
                "periods": {
                    "first": 1661884200,
                    "second": 1661887800
                },
                "venue": {
                    "id": 525,
                    "name": "Selhurst Park",
                    "city": "London"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 52,
                    "name": "Crystal Palace",
                    "logo": "https://media.api-sports.io/football/teams/52.png",
                    "winner": null
                },
                "away": {
                    "id": 55,
                    "name": "Brentford",
                    "logo": "https://media.api-sports.io/football/teams/55.png",
                    "winner": null
                }
            },
            "goals": {
                "home": 1,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 0
                },
                "fulltime": {
                    "home": 1,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867993,
                "referee": "M. Oliver",
                "timezone": "UTC",
                "date": "2022-08-30T18:45:00+00:00",
                "timestamp": 1661885100,
                "periods": {
                    "first": 1661885100,
                    "second": 1661888700
                },
                "venue": {
                    "id": 585,
                    "name": "St. Mary's Stadium",
                    "city": "Southampton, Hampshire"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 41,
                    "name": "Southampton",
                    "logo": "https://media.api-sports.io/football/teams/41.png",
                    "winner": true
                },
                "away": {
                    "id": 49,
                    "name": "Chelsea",
                    "logo": "https://media.api-sports.io/football/teams/49.png",
                    "winner": false
                }
            },
            "goals": {
                "home": 2,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 2,
                    "away": 1
                },
                "fulltime": {
                    "home": 2,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867994,
                "referee": "A. Marriner",
                "timezone": "UTC",
                "date": "2022-08-31T19:00:00+00:00",
                "timestamp": 1661972400,
                "periods": {
                    "first": 1661972400,
                    "second": 1661976000
                },
                "venue": {
                    "id": 550,
                    "name": "Anfield",
                    "city": "Liverpool"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 40,
                    "name": "Liverpool",
                    "logo": "https://media.api-sports.io/football/teams/40.png",
                    "winner": true
                },
                "away": {
                    "id": 34,
                    "name": "Newcastle",
                    "logo": "https://media.api-sports.io/football/teams/34.png",
                    "winner": false
                }
            },
            "goals": {
                "home": 2,
                "away": 1
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 1
                },
                "fulltime": {
                    "home": 2,
                    "away": 1
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 867995,
                "referee": "P. Tierney",
                "timezone": "UTC",
                "date": "2022-08-31T18:30:00+00:00",
                "timestamp": 1661970600,
                "periods": {
                    "first": 1661970600,
                    "second": 1661974200
                },
                "venue": {
                    "id": 555,
                    "name": "Etihad Stadium",
                    "city": "Manchester"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 39,
                "name": "Premier League",
                "country": "England",
                "logo": "https://media.api-sports.io/football/leagues/39.png",
                "flag": "https://media.api-sports.io/flags/gb.svg",
                "season": 2022,
                "round": "Regular Season - 5"
            },
            "teams": {
                "home": {
                    "id": 50,
                    "name": "Manchester City",
                    "logo": "https://media.api-sports.io/football/teams/50.png",
                    "winner": true
                },
                "away": {
                    "id": 65,
                    "name": "Nottingham Forest",
                    "logo": "https://media.api-sports.io/football/teams/65.png",
                    "winner": false
                }
            },
            "goals": {
                "home": 6,
                "away": 0
            },
            "score": {
                "halftime": {
                    "home": 3,
                    "away": 0
                },
                "fulltime": {
                    "home": 6,
                    "away": 0
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        }
    ]

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
    if (predictionsList.length > 1) { console.log(predictionsList)};
  })
 
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);

  function setMatches(matchArr){
    // setMatchList(matchArr);
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


//   Update prediction on input change

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
    const round = "Regular Season - 5";

    const docId = `${round} - ${id}` 
    const predictionDoc = {
        round: round,
        user: name,
        uid: id,
        predictions: predictions
    };
    setPredictions(predictions);
    sendUserPredictions(docId, predictionDoc)
    
    // console.log(predictionsList);
  }

  async function compileScores() {
    const predictionArray = await getAllPredictions();
    const standingsArray = await getStandings();
    standingsArray.forEach(player => {
        let updatedStats = player;
        let userPredictions = predictionArray.filter(obj => {
            return obj.uid === player.userId
        })
        userPredictions.forEach(pred => {
            if ((!player.rounds || player.rounds.indexOf(pred.round) === -1) && pred.results) {
                updatedStats.exactos = pred.results.exactos + updatedStats.exactos;
                updatedStats.correct = pred.results.correct + updatedStats.correct;
                updatedStats.incorrect = pred.results.incorrect + updatedStats.incorrect;
                updatedStats.score = pred.results.roundScore + updatedStats.score;
                updatedStats.rounds.push(pred.round);
                // updateStandings(`${resData.uid} - 2022`, updatedStats)
            }

        })
        console.log (updatedStats)
        updateStandings(updatedStats)

    })
    // console.log(standingsArray)
  }

  return (
    <>
    <div className="w-full inline-flex items-center">
    <button type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-auto" onClick={compileScores}>Compile Scores</button>
</div>

    <div>
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
{/* 
         {(match.fixture.status.short === "NS") ? */}
          <div className='w-1/3 p-2 flex justify-center items-center' id={match.fixture.id}>
            <input data-teamname={match.teams.home.name} name="home" className="inline appearance-none block w-10 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 text-2xl text-center leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id={match.fixture.id + "homeScore"} onChange={event => updatePrediction(match.fixture.id, event.target.name, event.target.value, event.target.getAttribute("data-teamname"))} type="number" />
            <div className="flex w-8 h-px bg-gray-400 mx-5"></div>
            <input data-teamname={match.teams.away.name} name="away" className="inline appearance-none block w-10 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 text-2xl text-center leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id={match.fixture.id + "awayScore"}  onChange={event => updatePrediction(match.fixture.id, event.target.name, event.target.value, event.target.getAttribute("data-teamname"))} type="number" />
          </div>
        
      {  // : match.fixture.status.short ==="PST" ?


        //   <div className='w-1/3 p-2 flex justify-center items-center'>
        //     <p className="sm:text-2xl content-center">Postponed</p>
        //   </div>

        // :
        //   <div className='w-1/3 p-2 flex justify-center items-center'>
        //     <p className="sm:text-2xl">{match.goals.home} - {match.goals.away}</p>
        //   </div>
        // }
      }
        <div className='w-1/3 p-2 flex justify-center items-center' id={match.fixture.id + "-away"}>
          <p className="inline sm:text-2xl">{match.teams.away.name}  </p>
          <img className="object-scale-down inline" alt="club crest" src={match.teams.away.logo} />
        </div>
      </div>
        )
      }

            
            {/* Button */}
            <div className="flex mt-5 content-center justify-center">
            <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={savePredictions}>
                Submit
            </button>
            </div>
    </div>
    </>
    
  );
}

export default Admin;