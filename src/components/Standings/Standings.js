import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Standings.css";
import { auth, db, logout, getStandings, getAllStandings, updateStandings, getAllPredictions } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [standings, setStandings] = useState([]);

// async function updateStandingsTable () {
//   getStandings()
//   .then(() => {
//     getAllStandings()
//     .then(res => {
//       setStandings(res);
//     })
//   })
// }

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

  async function compileScores() {
    let currentStandings = [];
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
        currentStandings.push(updatedStats)
    })
    setStandings(currentStandings.sort((a, b) => (Number(a.score) > Number(b.score) ? -1 : 1)));
    // console.log(standingsArray)
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    compileScores()
    fetchUserName();
  }, [user, loading]);

  return (
    <>

      {(standings.length) &&
      <div className="px-2.5 w-full">
      <table className="text-sm w-full border-separate border border-slate-500 text-left text-gray-500 " id="standingsTable">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr className=" ">
            <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500 text-center">Name</th>
            <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500 text-center">Points</th>
            <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500 text-center">Exactos</th>
            <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500 text-center">Correct Results</th>
            <th scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500 text-center">Incorrect Results</th>
          </tr>
        </thead>
        <tbody>
                      
        {standings.map(doc => 
          <tr>
            <td scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500">{doc.name}</td>
            <td scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500">{doc.score}</td>
            <td scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500">{doc.exactos}</td>
            <td scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500">{doc.correct}</td>
            <td scope="col" className="py-3 px-6 bg-gray-50 border-collapse border border-slate-500">{doc.incorrect}</td>
          </tr>
        )}
        </tbody>
      </table>
      </div> 
      }
    </>

  );
}

export default Dashboard;