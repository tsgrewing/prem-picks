import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Results.css";
import { auth, db, getRoundPredictions, logout, updatePredictionResults } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import {rapidKey} from "../../config.js"

function Results() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState([]);
  const [week, setWeek] = useState([]);
  const [predictions, setPredictions] = useState([]);

//   let matchList = [
//     {
//         "fixture": {
//             "id": 867946,
//             "referee": "A. Taylor",
//             "timezone": "UTC",
//             "date": "2022-08-05T19:00:00+00:00",
//             "timestamp": 1659726000,
//             "periods": {
//                 "first": 1659726000,
//                 "second": 1659729600
//             },
//             "venue": {
//                 "id": 525,
//                 "name": "Selhurst Park",
//                 "city": "London"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 52,
//                 "name": "Crystal Palace",
//                 "logo": "https://media.api-sports.io/football/teams/52.png",
//                 "winner": false
//             },
//             "away": {
//                 "id": 42,
//                 "name": "Arsenal",
//                 "logo": "https://media.api-sports.io/football/teams/42.png",
//                 "winner": true
//             }
//         },
//         "goals": {
//             "home": 0,
//             "away": 2
//         },
//         "score": {
//             "halftime": {
//                 "home": 0,
//                 "away": 1
//             },
//             "fulltime": {
//                 "home": 0,
//                 "away": 2
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867947,
//             "referee": "A. Madley",
//             "timezone": "UTC",
//             "date": "2022-08-06T11:30:00+00:00",
//             "timestamp": 1659785400,
//             "periods": {
//                 "first": 1659785400,
//                 "second": 1659789000
//             },
//             "venue": {
//                 "id": 535,
//                 "name": "Craven Cottage",
//                 "city": "London"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 36,
//                 "name": "Fulham",
//                 "logo": "https://media.api-sports.io/football/teams/36.png",
//                 "winner": null
//             },
//             "away": {
//                 "id": 40,
//                 "name": "Liverpool",
//                 "logo": "https://media.api-sports.io/football/teams/40.png",
//                 "winner": null
//             }
//         },
//         "goals": {
//             "home": 2,
//             "away": 2
//         },
//         "score": {
//             "halftime": {
//                 "home": 1,
//                 "away": 0
//             },
//             "fulltime": {
//                 "home": 2,
//                 "away": 2
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867948,
//             "referee": "P. Bankes",
//             "timezone": "UTC",
//             "date": "2022-08-06T14:00:00+00:00",
//             "timestamp": 1659794400,
//             "periods": {
//                 "first": 1659794400,
//                 "second": 1659798000
//             },
//             "venue": {
//                 "id": 504,
//                 "name": "Vitality Stadium",
//                 "city": "Bournemouth, Dorset"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 35,
//                 "name": "Bournemouth",
//                 "logo": "https://media.api-sports.io/football/teams/35.png",
//                 "winner": true
//             },
//             "away": {
//                 "id": 66,
//                 "name": "Aston Villa",
//                 "logo": "https://media.api-sports.io/football/teams/66.png",
//                 "winner": false
//             }
//         },
//         "goals": {
//             "home": 2,
//             "away": 0
//         },
//         "score": {
//             "halftime": {
//                 "home": 1,
//                 "away": 0
//             },
//             "fulltime": {
//                 "home": 2,
//                 "away": 0
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867949,
//             "referee": "R. Jones",
//             "timezone": "UTC",
//             "date": "2022-08-06T14:00:00+00:00",
//             "timestamp": 1659794400,
//             "periods": {
//                 "first": 1659794400,
//                 "second": 1659798000
//             },
//             "venue": {
//                 "id": 546,
//                 "name": "Elland Road",
//                 "city": "Leeds, West Yorkshire"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 63,
//                 "name": "Leeds",
//                 "logo": "https://media.api-sports.io/football/teams/63.png",
//                 "winner": true
//             },
//             "away": {
//                 "id": 39,
//                 "name": "Wolves",
//                 "logo": "https://media.api-sports.io/football/teams/39.png",
//                 "winner": false
//             }
//         },
//         "goals": {
//             "home": 2,
//             "away": 1
//         },
//         "score": {
//             "halftime": {
//                 "home": 1,
//                 "away": 1
//             },
//             "fulltime": {
//                 "home": 2,
//                 "away": 1
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867950,
//             "referee": "J. Gillett",
//             "timezone": "UTC",
//             "date": "2022-08-07T13:00:00+00:00",
//             "timestamp": 1659877200,
//             "periods": {
//                 "first": 1659877200,
//                 "second": 1659880800
//             },
//             "venue": {
//                 "id": 547,
//                 "name": "King Power Stadium",
//                 "city": "Leicester, Leicestershire"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 46,
//                 "name": "Leicester",
//                 "logo": "https://media.api-sports.io/football/teams/46.png",
//                 "winner": null
//             },
//             "away": {
//                 "id": 55,
//                 "name": "Brentford",
//                 "logo": "https://media.api-sports.io/football/teams/55.png",
//                 "winner": null
//             }
//         },
//         "goals": {
//             "home": 2,
//             "away": 2
//         },
//         "score": {
//             "halftime": {
//                 "home": 1,
//                 "away": 0
//             },
//             "fulltime": {
//                 "home": 2,
//                 "away": 2
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867951,
//             "referee": "S. Hooper",
//             "timezone": "UTC",
//             "date": "2022-08-06T14:00:00+00:00",
//             "timestamp": 1659794400,
//             "periods": {
//                 "first": 1659794400,
//                 "second": 1659798000
//             },
//             "venue": {
//                 "id": 562,
//                 "name": "St. James' Park",
//                 "city": "Newcastle upon Tyne"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 34,
//                 "name": "Newcastle",
//                 "logo": "https://media.api-sports.io/football/teams/34.png",
//                 "winner": true
//             },
//             "away": {
//                 "id": 65,
//                 "name": "Nottingham Forest",
//                 "logo": "https://media.api-sports.io/football/teams/65.png",
//                 "winner": false
//             }
//         },
//         "goals": {
//             "home": 2,
//             "away": 0
//         },
//         "score": {
//             "halftime": {
//                 "home": 0,
//                 "away": 0
//             },
//             "fulltime": {
//                 "home": 2,
//                 "away": 0
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867952,
//             "referee": "A. Marriner",
//             "timezone": "UTC",
//             "date": "2022-08-06T14:00:00+00:00",
//             "timestamp": 1659794400,
//             "periods": {
//                 "first": 1659794400,
//                 "second": 1659798000
//             },
//             "venue": {
//                 "id": 593,
//                 "name": "Tottenham Hotspur Stadium",
//                 "city": "London"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 47,
//                 "name": "Tottenham",
//                 "logo": "https://media.api-sports.io/football/teams/47.png",
//                 "winner": true
//             },
//             "away": {
//                 "id": 41,
//                 "name": "Southampton",
//                 "logo": "https://media.api-sports.io/football/teams/41.png",
//                 "winner": false
//             }
//         },
//         "goals": {
//             "home": 4,
//             "away": 1
//         },
//         "score": {
//             "halftime": {
//                 "home": 2,
//                 "away": 1
//             },
//             "fulltime": {
//                 "home": 4,
//                 "away": 1
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867953,
//             "referee": "C. Pawson",
//             "timezone": "UTC",
//             "date": "2022-08-06T16:30:00+00:00",
//             "timestamp": 1659803400,
//             "periods": {
//                 "first": 1659803400,
//                 "second": 1659807000
//             },
//             "venue": {
//                 "id": 8560,
//                 "name": "Goodison Park",
//                 "city": "Liverpool"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 45,
//                 "name": "Everton",
//                 "logo": "https://media.api-sports.io/football/teams/45.png",
//                 "winner": false
//             },
//             "away": {
//                 "id": 49,
//                 "name": "Chelsea",
//                 "logo": "https://media.api-sports.io/football/teams/49.png",
//                 "winner": true
//             }
//         },
//         "goals": {
//             "home": 0,
//             "away": 1
//         },
//         "score": {
//             "halftime": {
//                 "home": 0,
//                 "away": 1
//             },
//             "fulltime": {
//                 "home": 0,
//                 "away": 1
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867954,
//             "referee": "P. Tierney",
//             "timezone": "UTC",
//             "date": "2022-08-07T13:00:00+00:00",
//             "timestamp": 1659877200,
//             "periods": {
//                 "first": 1659877200,
//                 "second": 1659880800
//             },
//             "venue": {
//                 "id": 556,
//                 "name": "Old Trafford",
//                 "city": "Manchester"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 33,
//                 "name": "Manchester United",
//                 "logo": "https://media.api-sports.io/football/teams/33.png",
//                 "winner": false
//             },
//             "away": {
//                 "id": 51,
//                 "name": "Brighton",
//                 "logo": "https://media.api-sports.io/football/teams/51.png",
//                 "winner": true
//             }
//         },
//         "goals": {
//             "home": 1,
//             "away": 2
//         },
//         "score": {
//             "halftime": {
//                 "home": 0,
//                 "away": 2
//             },
//             "fulltime": {
//                 "home": 1,
//                 "away": 2
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     },
//     {
//         "fixture": {
//             "id": 867955,
//             "referee": "M. Oliver",
//             "timezone": "UTC",
//             "date": "2022-08-07T15:30:00+00:00",
//             "timestamp": 1659886200,
//             "periods": {
//                 "first": 1659886200,
//                 "second": 1659889800
//             },
//             "venue": {
//                 "id": 598,
//                 "name": "London Stadium",
//                 "city": "London"
//             },
//             "status": {
//                 "long": "Match Finished",
//                 "short": "FT",
//                 "elapsed": 90
//             }
//         },
//         "league": {
//             "id": 39,
//             "name": "Premier League",
//             "country": "England",
//             "logo": "https://media.api-sports.io/football/leagues/39.png",
//             "flag": "https://media.api-sports.io/flags/gb.svg",
//             "season": 2022,
//             "round": "Regular Season - 1"
//         },
//         "teams": {
//             "home": {
//                 "id": 48,
//                 "name": "West Ham",
//                 "logo": "https://media.api-sports.io/football/teams/48.png",
//                 "winner": false
//             },
//             "away": {
//                 "id": 50,
//                 "name": "Manchester City",
//                 "logo": "https://media.api-sports.io/football/teams/50.png",
//                 "winner": true
//             }
//         },
//         "goals": {
//             "home": 0,
//             "away": 2
//         },
//         "score": {
//             "halftime": {
//                 "home": 0,
//                 "away": 1
//             },
//             "fulltime": {
//                 "home": 0,
//                 "away": 2
//             },
//             "extratime": {
//                 "home": null,
//                 "away": null
//             },
//             "penalty": {
//                 "home": null,
//                 "away": null
//             }
//         }
//     }
// ];
  
  let resultArray = [];
  let predictionArray = [];

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
    console.log("getting round");
    const config ={
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures/rounds?season=2023&league=39",
      params: {league: "39", season:"2023", current: "true"},
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

  async function scorePredictions() {
  
    predictions.forEach(person => {
      let userPrediction = person;
      userPrediction.results = {
      uid: person.uid,
      name: person.user,
      exactos: 0,
      correct: 0,
      incorrect: 0,
      roundScore: 0,
      round: userPrediction.round
      };
      userPrediction.bgColor ="";
       
      userPrediction.predictions.forEach(game => {      
        const matchObj = matchList.find(obj => {
                    return obj.fixture.id === game.id
                  })
        
        // console.log(matchObj.fixture.status.short)

        if (matchObj.fixture.status.short !== "NS") {
        console.log("Not Started")
          if (matchObj.goals.home == game.home.score && matchObj.goals.away == game.away.score) {
              userPrediction.results.exactos ++;
              userPrediction.results.roundScore = userPrediction.results.roundScore+3;
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

        } 
        
      })

      predictionArray.push(userPrediction) 
      // setPredictions(predictionArray)
    
    })
  
    predictionArray.forEach(doc => {
      const docId = `${doc.round} - ${doc.uid}`
      updatePredictionResults(docId, doc);
      // updatePredictionResults(doc.round, doc.results);
    })
      // updateStandings();
      // console.log(predictionArray)
      // predictionArray.sort((a,b) => (a.results.roundScore > b.results.roundScore ? 1:-1))

  };
  

  // const compileStandings = async (currentWeek) => {
  //   let weekNum = currentWeek.slice(-2).trim();

  function getMatches(chosenWeek) {

    const config = {
      method: 'get',
      url: "https://v3.football.api-sports.io/fixtures",
      params: {league: 39, season: 2023, round: chosenWeek}, 
      headers: {
        'x-rapidapi-key': rapidKey, 
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

    axios(config)
      .then((response) => {
        let matchArray = ((response.data.response).sort(function(a,b){
          // Turn date strings into dates, and then sort on them
          return new Date(a.fixture.date) - new Date(b.fixture.date);
        }));
        setMatches(matchArray);
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


  function isReady() {
    if (predictions.length > 0 && matchList.length > 0) {
      if(predictions.length === predictionArray.length){
        return true;
      }
      else {
        // console.log(predictionArray.length);
        // console.log(predictions)
      scorePredictions();
      return true;
      }
    }
    else {
      return false;
    }
  }


  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    
    fetchUserName();
  }, [user, loading]);
  
  useEffect(() => {
    getCurrentRound();
  }, []);
  
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
      <div className="px-2.5 w-full overflow-x-scroll">
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
                if (matchObj) {
                return (
                  <td className={"border-collapse border border-slate-500 text-center " + matchObj.colors}>{matchObj.home.score} - {matchObj.away.score}</td>
                )}
                else {
                  return (
                    <td className={"border-collapse border border-slate-500 text-black text-center bg-gray-400"}>PP</td>
                  )
                }
              } 
              )}
            </tr>
            )}
            <tr>
              <td className="border-collapse border border-slate-500">Round Scores</td>
              <td className="border-collapse border border-slate-500"></td>
                  {predictionArray.map(player => 
                    <td className="border-collapse border border-slate-500 text-center ">{player.results.roundScore}</td>)}
            </tr>
        </tbody>
      </table>
      </div> 
      }
    </>
  );
}

export default Results;