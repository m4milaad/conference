import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Footer from "./components/Footer";
import Committee from "./components/Committe";
import Schedule from "./components/Schedule";
import Workshops from "./components/Workshops";
import KeyNotes from "./components/KeyNotes";
import Registration from "./components/Registration";
import Contact from "./components/Contact";
import CallForPapers from "./components/CallForPapers";
import SteeringCommitte from "./components/SteeringCommitte";
import OrganizingCommitte from "./components/OrganizingCommitte";
// import TechnicalCommitte from "./components/TechnicalCommitte";
import SpecialSessions from "./components/SpecialSessions"
import Sponsors from "./components/Sponsors";
{/*import Login from "./components/Login";*/} 
{/*import AdminUpload from "./components/AdminUpload"; */}
import { useState } from "react";
import { Navigate } from "react-router-dom";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <Navbar isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/call-for-papers" element={<CallForPapers />} />
        <Route path="/committee/SteeringCommitte" element={<SteeringCommitte />} />
        <Route path="/committee/OrganizingCommitte" element={<OrganizingCommitte />} />
        {/* <Route path="/committee/TechnicalCommitte" element={<TechnicalCommitte />} /> */}
        <Route path="/sessions/workshops" element={<Workshops />} />
        <Route path="/sessions/specialSessions" element={<SpecialSessions />} />
        <Route path="/KeyNotes" element={<KeyNotes />} />
        {/* <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} /> */}
        
        {/* <Route
          path="/admin"
          element={isAdmin ? <AdminUpload /> : <Navigate to="/login" />}
        /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;