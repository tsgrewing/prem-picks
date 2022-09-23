import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Reset from "./components/Reset/Reset";
import Dashboard from "./components/Dashboard/Dashboard";
import Nav from "./components/Nav/Nav";
import Results from "./components/Results/Results";
import Profile from "./components/Profile/Profile";
import Admin from "./components/Admin/Admin";
import Matches from "./components/Matches/Matches";
import Standings from "./components/Standings/Standings"


function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
    {user && <Nav /> }
    <Router>
      <main className="app">
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/standings" element={<Standings />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/results" element={<Results />} />
          <Route exact path="/matches" element={<Matches />} />
          <Route exact path="/admin" element={<Admin />} />

        </Routes>
      </main>
    </Router>
    </>
  );
}

export default App;