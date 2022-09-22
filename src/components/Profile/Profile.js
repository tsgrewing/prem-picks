import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { auth, db, logout, updatePredictionResults } from "../../firebase";
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



  async function getUserPicks() {
     await getRoundPredictions("Regular Season - 1")
     .then(res => {
      setPredictions(res)
     })
     .then(() =>{

      scorePredictions()
    });
  };

let matchList = [
    {
        "fixture": {
            "id": 867946,
            "referee": "A. Taylor",
            "timezone": "UTC",
            "date": "2022-08-05T19:00:00+00:00",
            "timestamp": 1659726000,
            "periods": {
                "first": 1659726000,
                "second": 1659729600
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 52,
                "name": "Crystal Palace",
                "logo": "https://media.api-sports.io/football/teams/52.png",
                "winner": false
            },
            "away": {
                "id": 42,
                "name": "Arsenal",
                "logo": "https://media.api-sports.io/football/teams/42.png",
                "winner": true
            }
        },
        "goals": {
            "home": 1,
            "away": 3
        },
        "score": {
            "halftime": {
                "home": 0,
                "away": 1
            },
            "fulltime": {
                "home": 0,
                "away": 2
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
            "id": 867947,
            "referee": "A. Madley",
            "timezone": "UTC",
            "date": "2022-08-06T11:30:00+00:00",
            "timestamp": 1659785400,
            "periods": {
                "first": 1659785400,
                "second": 1659789000
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 36,
                "name": "Fulham",
                "logo": "https://media.api-sports.io/football/teams/36.png",
                "winner": null
            },
            "away": {
                "id": 40,
                "name": "Liverpool",
                "logo": "https://media.api-sports.io/football/teams/40.png",
                "winner": null
            }
        },
        "goals": {
            "home": 2,
            "away": 2
        },
        "score": {
            "halftime": {
                "home": 1,
                "away": 0
            },
            "fulltime": {
                "home": 2,
                "away": 2
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
            "id": 867948,
            "referee": "P. Bankes",
            "timezone": "UTC",
            "date": "2022-08-06T14:00:00+00:00",
            "timestamp": 1659794400,
            "periods": {
                "first": 1659794400,
                "second": 1659798000
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 35,
                "name": "Bournemouth",
                "logo": "https://media.api-sports.io/football/teams/35.png",
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
            "away": 0
        },
        "score": {
            "halftime": {
                "home": 1,
                "away": 0
            },
            "fulltime": {
                "home": 2,
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
            "id": 867949,
            "referee": "R. Jones",
            "timezone": "UTC",
            "date": "2022-08-06T14:00:00+00:00",
            "timestamp": 1659794400,
            "periods": {
                "first": 1659794400,
                "second": 1659798000
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 63,
                "name": "Leeds",
                "logo": "https://media.api-sports.io/football/teams/63.png",
                "winner": true
            },
            "away": {
                "id": 39,
                "name": "Wolves",
                "logo": "https://media.api-sports.io/football/teams/39.png",
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
            "id": 867950,
            "referee": "J. Gillett",
            "timezone": "UTC",
            "date": "2022-08-07T13:00:00+00:00",
            "timestamp": 1659877200,
            "periods": {
                "first": 1659877200,
                "second": 1659880800
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 46,
                "name": "Leicester",
                "logo": "https://media.api-sports.io/football/teams/46.png",
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
            "home": 2,
            "away": 2
        },
        "score": {
            "halftime": {
                "home": 1,
                "away": 0
            },
            "fulltime": {
                "home": 2,
                "away": 2
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
            "id": 867951,
            "referee": "S. Hooper",
            "timezone": "UTC",
            "date": "2022-08-06T14:00:00+00:00",
            "timestamp": 1659794400,
            "periods": {
                "first": 1659794400,
                "second": 1659798000
            },
            "venue": {
                "id": 562,
                "name": "St. James' Park",
                "city": "Newcastle upon Tyne"
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 34,
                "name": "Newcastle",
                "logo": "https://media.api-sports.io/football/teams/34.png",
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
            "home": 2,
            "away": 0
        },
        "score": {
            "halftime": {
                "home": 0,
                "away": 0
            },
            "fulltime": {
                "home": 2,
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
            "id": 867952,
            "referee": "A. Marriner",
            "timezone": "UTC",
            "date": "2022-08-06T14:00:00+00:00",
            "timestamp": 1659794400,
            "periods": {
                "first": 1659794400,
                "second": 1659798000
            },
            "venue": {
                "id": 593,
                "name": "Tottenham Hotspur Stadium",
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 47,
                "name": "Tottenham",
                "logo": "https://media.api-sports.io/football/teams/47.png",
                "winner": true
            },
            "away": {
                "id": 41,
                "name": "Southampton",
                "logo": "https://media.api-sports.io/football/teams/41.png",
                "winner": false
            }
        },
        "goals": {
            "home": 4,
            "away": 1
        },
        "score": {
            "halftime": {
                "home": 2,
                "away": 1
            },
            "fulltime": {
                "home": 4,
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
            "id": 867953,
            "referee": "C. Pawson",
            "timezone": "UTC",
            "date": "2022-08-06T16:30:00+00:00",
            "timestamp": 1659803400,
            "periods": {
                "first": 1659803400,
                "second": 1659807000
            },
            "venue": {
                "id": 8560,
                "name": "Goodison Park",
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 45,
                "name": "Everton",
                "logo": "https://media.api-sports.io/football/teams/45.png",
                "winner": false
            },
            "away": {
                "id": 49,
                "name": "Chelsea",
                "logo": "https://media.api-sports.io/football/teams/49.png",
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
            "id": 867954,
            "referee": "P. Tierney",
            "timezone": "UTC",
            "date": "2022-08-07T13:00:00+00:00",
            "timestamp": 1659877200,
            "periods": {
                "first": 1659877200,
                "second": 1659880800
            },
            "venue": {
                "id": 556,
                "name": "Old Trafford",
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 33,
                "name": "Manchester United",
                "logo": "https://media.api-sports.io/football/teams/33.png",
                "winner": false
            },
            "away": {
                "id": 51,
                "name": "Brighton",
                "logo": "https://media.api-sports.io/football/teams/51.png",
                "winner": true
            }
        },
        "goals": {
            "home": 1,
            "away": 2
        },
        "score": {
            "halftime": {
                "home": 0,
                "away": 2
            },
            "fulltime": {
                "home": 1,
                "away": 2
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
            "id": 867955,
            "referee": "M. Oliver",
            "timezone": "UTC",
            "date": "2022-08-07T15:30:00+00:00",
            "timestamp": 1659886200,
            "periods": {
                "first": 1659886200,
                "second": 1659889800
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
            "round": "Regular Season - 1"
        },
        "teams": {
            "home": {
                "id": 48,
                "name": "West Ham",
                "logo": "https://media.api-sports.io/football/teams/48.png",
                "winner": false
            },
            "away": {
                "id": 50,
                "name": "Manchester City",
                "logo": "https://media.api-sports.io/football/teams/50.png",
                "winner": true
            }
        },
        "goals": {
            "home": 0,
            "away": 2
        },
        "score": {
            "halftime": {
                "home": 0,
                "away": 1
            },
            "fulltime": {
                "home": 0,
                "away": 2
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
];
// let predictions = [
//     {
//         "uid": "987654",
//         "predictions": [
//             {
//                 "user": "Andrew Olson",
//                 "id": 867946,
//                 "away": {
//                     "score": "2",
//                     "name": "Arsenal"
//                 },
//                 "home": {
//                     "score": "1",
//                     "name": "Crystal Palace"
//                 }
//             },
//             {
//                 "home": {
//                     "score": "0",
//                     "name": "Fulham"
//                 },
//                 "away": {
//                     "name": "Liverpool",
//                     "score": "4"
//                 },
//                 "id": 867947,
//                 "user": "Andrew Olson"
//             },
//             {
//                 "id": 867948,
//                 "home": {
//                     "score": "1",
//                     "name": "Bournemouth"
//                 },
//                 "user": "Andrew Olson",
//                 "away": {
//                     "score": "2",
//                     "name": "Aston Villa"
//                 }
//             },
//             {
//                 "away": {
//                     "name": "Wolves",
//                     "score": "1"
//                 },
//                 "id": 867949,
//                 "user": "Andrew Olson",
//                 "home": {
//                     "name": "Leeds",
//                     "score": "1"
//                 }
//             },
//             {
//                 "user": "Andrew Olson",
//                 "id": 867950,
//                 "away": {
//                     "score": "1",
//                     "name": "Brentford"
//                 },
//                 "home": {
//                     "name": "Leicester",
//                     "score": "2"
//                 }
//             },
//             {
//                 "id": 867951,
//                 "away": {
//                     "name": "Nottingham Forest",
//                     "score": "0"
//                 },
//                 "user": "Andrew Olson",
//                 "home": {
//                     "score": "3",
//                     "name": "Newcastle"
//                 }
//             },
//             {
//                 "user": "Andrew Olson",
//                 "id": 867952,
//                 "away": {
//                     "score": "3",
//                     "name": "Southampton"
//                 },
//                 "home": {
//                     "name": "Tottenham",
//                     "score": "0"
//                 }
//             },
//             {
//                 "away": {
//                     "score": "0",
//                     "name": "Chelsea"
//                 },
//                 "home": {
//                     "score": "2",
//                     "name": "Everton"
//                 },
//                 "id": 867953,
//                 "user": "Andrew Olson"
//             },
//             {
//                 "away": {
//                     "score": "1",
//                     "name": "Brighton"
//                 },
//                 "id": 867954,
//                 "user": "Andrew Olson",
//                 "home": {
//                     "name": "Manchester United",
//                     "score": "2"
//                 }
//             },
//             {
//                 "user": "Andrew Olson",
//                 "away": {
//                     "score": "4",
//                     "name": "Manchester City"
//                 },
//                 "home": {
//                     "score": "0",
//                     "name": "West Ham"
//                 },
//                 "id": 867955
//             }
//         ],
//         "user": "Andrew Olson",
//         "round": "Regular Season - 1"
//     },
//     {
//         "user": "Tony Grewing",
//         "uid": "baZgOwQCgsT8fdJDcU72ntmIahv2",
//         "round": "Regular Season - 1",
//         "predictions": [
//             {
//                 "user": "Tony Grewing",
//                 "home": {
//                     "name": "Crystal Palace",
//                     "score": "1"
//                 },
//                 "away": {
//                     "name": "Arsenal",
//                     "score": "3"
//                 },
//                 "id": 867946
//             },
//             {
//                 "user": "Tony Grewing",
//                 "id": 867947,
//                 "home": {
//                     "name": "Fulham",
//                     "score": "0"
//                 },
//                 "away": {
//                     "name": "Liverpool",
//                     "score": "3"
//                 }
//             },
//             {
//                 "user": "Tony Grewing",
//                 "away": {
//                     "name": "Aston Villa",
//                     "score": "2"
//                 },
//                 "id": 867948,
//                 "home": {
//                     "score": "1",
//                     "name": "Bournemouth"
//                 }
//             },
//             {
//                 "user": "Tony Grewing",
//                 "home": {
//                     "name": "Leeds",
//                     "score": "1"
//                 },
//                 "away": {
//                     "name": "Wolves",
//                     "score": "1"
//                 },
//                 "id": 867949
//             },
//             {
//                 "user": "Tony Grewing",
//                 "id": 867950,
//                 "home": {
//                     "name": "Leicester",
//                     "score": "2"
//                 },
//                 "away": {
//                     "score": "1",
//                     "name": "Brentford"
//                 }
//             },
//             {
//                 "id": 867951,
//                 "home": {
//                     "name": "Newcastle",
//                     "score": "3"
//                 },
//                 "away": {
//                     "name": "Nottingham Forest",
//                     "score": "2"
//                 },
//                 "user": "Tony Grewing"
//             },
//             {
//                 "away": {
//                     "score": "3",
//                     "name": "Southampton"
//                 },
//                 "id": 867952,
//                 "home": {
//                     "name": "Tottenham",
//                     "score": "0"
//                 },
//                 "user": "Tony Grewing"
//             },
//             {
//                 "home": {
//                     "score": "2",
//                     "name": "Everton"
//                 },
//                 "away": {
//                     "name": "Chelsea",
//                     "score": "1"
//                 },
//                 "id": 867953,
//                 "user": "Tony Grewing"
//             },
//             {
//                 "user": "Tony Grewing",
//                 "id": 867954,
//                 "away": {
//                     "name": "Brighton",
//                     "score": "1"
//                 },
//                 "home": {
//                     "name": "Manchester United",
//                     "score": "1"
//                 }
//             },
//             {
//                 "user": "Tony Grewing",
//                 "away": {
//                     "name": "Manchester City",
//                     "score": "3"
//                 },
//                 "home": {
//                     "name": "West Ham",
//                     "score": "0"
//                 },
//                 "id": 867955
//             }
//         ]
//     }
// ];

function scorePredictions() {
  let predictionArray =[];

  predictions.forEach(person => {
    let userPrediction = person;
    userPrediction.results = {
    exactos: 0,
    correct: 0,
    incorrect: 0,
    roundScore: 0
    };
     
    userPrediction.predictions.forEach(game => {      
      const matchObj = matchList.find(obj => {
                  return obj.fixture.id === game.id
                })
      
      if (matchObj.goals.home == game.home.score && matchObj.goals.away == game.away.score) {
          userPrediction.results.exactos ++;
          userPrediction.results.roundScore = +3;
          game.result = "exacto";

      }
      else if ((matchObj.goals.home >= matchObj.goals.away && game.home.score >= game.away.score) || (matchObj.goals.home < matchObj.goals.away && game.home.score < game.away.score)) {
        userPrediction.results.correct ++;
        userPrediction.results.roundScore ++;
        game.result = "correct";

      }
      else {
        game.result = "incorrect";
        userPrediction.results.incorrect ++;

      }
      
    })
    predictionArray.push(userPrediction) 
    // console.log(predictionArray)
    setPredictions(predictionArray)
  })

  // predictionArray.forEach(doc => {
  //   const docId = `${doc.round} - ${doc.uid}`
  //   updatePredictionResults(docId, doc)
  // })
};


  return (
    <div className="profile">
        <button onClick={getUserPicks}>Score Predictions</button>
        {/* {(predictions.length > 0) &&
          <div>
            {predictions.map(doc => 
            <p key={doc.id}> {doc.home.name} {doc.home.score} - {doc.away.score} {doc.away.name}</p>
            ) 
          }
          </div>
        } */}
    </div>
  );
}

export default Profile;