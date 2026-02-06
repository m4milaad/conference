import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import NotificationBar from "./NotificationBar"; // <--- Correctly Imported
import useInView from "../hooks/useInView";
import { Link } from "react-router-dom"; 

function Home() {
  // Array of hero images
  const images = [
    "/Sammeer Wani Winter_8.jpg",
    "/KASGMIR8.jpg",
    "/KASGMIR7.jpg",
    "/KASHMIR2.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 2.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Add refs and inView states for each section
  const [themesRef, themesInView] = useInView({ threshold: 0.2 });
  const [speakersRef, speakersInView] = useInView({ threshold: 0.2 });
  const [sponsorsRef, sponsorsInView] = useInView({ threshold: 0.2 });

  return (
    <div className="flex flex-col">
      {/* Navbar sits on top of Hero */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[85vh] bg-cover bg-center flex flex-col justify-center items-center text-white transition-all duration-1000"
        style={{ backgroundImage: `url('${images[currentIndex]}')` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Hero text */}
        <div className="relative z-10 text-center sm:px-8 w-auto space-y-4 text-[#0a0908] bg-black/50 text-white rounded-xl p-6 ">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold drop-shadow-lg">
            2026 International Conference on Applied Artificial Intelligence (2AI)
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl font-regular drop-shadow-md">
            June 17 - 19, 2026 (Hybrid Mode)
          </p>

          <div className="text-sm sm:text-lg lg:text-xl leading-relaxed drop-shadow-md flex flex-col gap-1">
            <p>
              at {"  "}
              <a
                href="https://www.cukashmir.ac.in/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 underline hover:text-blue-400"
              >
                Central University of Kashmir, India
              </a>
            </p>
            
            <p>
              in collaboration with{"  "}
              <a
                href="https://www.ai-research-lab.org/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 underline hover:text-blue-400"
              >
                USD AI Research,
                <br/>
                 University of South Dakota (USA)
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* --- NOTIFICATION BAR (Showing Trip + Springer) --- */}
      <NotificationBar />
      {/* ---------------------------------- */}

      {/* Conference Timeline Section */}
      <section className="py-16 px-6 sm:px-12 bg-gradient-to-b from-[#778da9] to-[#fdf0d5] ">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#001d3d] mb-12">
          Key Features
        </h2>

        {/* Grid with 3 Cards */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-9xl mx-auto">

          {/* Important Dates Card */}
          <div className="bg-white p-4 rounded-2xl shadow-md transition-all duration-700 hover:scale-105 hover:-translate-y-3 hover:shadow-xl">
            <h3 className="text-3xl font-medium text-center text-[#001d3d] mb-6">
              📅 Important Dates
            </h3>
            <ul className="mt-10 space-y-6 text-lg sm:text-xl text-[#49111c] font-regular">
              {[
                { icon: "📝", label: "Article Submission Deadline", date: "15-feb-2026" },
                { icon: "📩", label: "Notification of Acceptance", date: "15-Mar-2026" },
                { icon: "📷", label: "Camera Ready Submission", date: "20-Mar-2026" },
                { icon: "🗓️", label: "Registration (Start)", date: "20-Mar-2026" },
                { icon: "🎤", label: "Pre-Conference Workshop", date: "17-June-2026" },
                { icon: "🎤", label: "Main Conference Date", date: "18,19-June 2026" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left"
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span> {item.label}
                  </span>
                  <span className="text-[#d90429] font-bold">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Paper Submission & Past Event Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-700 hover:scale-105 hover:-translate-y-3 hover:shadow-xl flex flex-col">
            <h3 className="text-3xl font-medium text-center text-[#001d3d] mb-6">
              📝 Paper Submission
            </h3>
            <p className="text-center text-gray-700 text-lg leading-relaxed mb-6 font-regular ">
              Authors are invited to submit their original and unpublished research
              paper here
              <br />
              🔗{" "}
              <a
                href="https://cmt3.research.microsoft.com/AAI2026"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                SUBMIT 
              </a>
            </p>

            {/* Divider */}
            <div className="my-8 relative w-[90%] mx-auto">
              <div className="h-1 bg-gradient-to-r from-[#b5e48c] to-[#34a0a4] rounded-full"></div>
              <div className="absolute inset-0 blur-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
            </div>

            {/* past event */}
            <h3 className="text-3xl font-bold text-center text-[#001d3d] mb-4">
              🎯 Past Event
            </h3>
            <p className="text-center text-gray-700 text-lg leading-relaxed ">
              <span className="font-regular">2024 International Conference on Applied Artificial Intelligence (2AI)</span> (July 2 - 4, 2024)
              at the Shoolini University of Biotechnology and Management Sciences, Solan, India

              <br />
              🔗{" "}
              <a
                href="https://applied-ai-conference.org/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Visit Past Event’s Website
              </a>
            </p>
          </div>

          {/* Conference Themes Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-700 hover:scale-105 hover:-translate-y-3 hover:shadow-xl flex flex-col items-center">
            <h3 className="text-3xl font-bold text-center text-[#001d3d] mb-6">
              🎯 Conference Themes
            </h3>
            <div className="flex flex-col justify-center space-y-6 text-center font-medium text-lg sm:text-xl text-[#49111c] text-left">
              <div>⚡ AI for Energy</div>
              <div>🎓 AI for Education</div>
              <div>🩺 AI for Healthcare</div>
              <div>🌾 AI for Agriculture</div>
              <div>💼 AI for Business & Finance</div>
              <div>🛡️ AI for Defense & Security</div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SPEAKERS HIGHLIGHT SECTION --- */}
      <section 
        ref={speakersRef}
        className={`py-16 bg-white transition-all duration-700 ${speakersInView ? "animate-fadeIn" : "opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#001d3d] mb-12">
            Distinguished Speakers
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
            
            {/* Speaker 1 */}
            <div className="group bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 group-hover:scale-105 transition">
                <img 
                  src="/nishchal.jpg" 
                  alt="Prof. Nishchal K Verma" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Speaker"}
                />
              </div>
              <h3 className="text-xl font-bold text-[#001d3d] mb-1">Prof. Nishchal K Verma</h3>
              <p className="text-blue-600 font-medium text-sm mb-2">Keynote Speaker</p>
              <p className="text-gray-600 text-sm">IIT Kanpur, India</p>
            </div>

            {/* Speaker 2 */}
            <div className="group bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 group-hover:scale-105 transition">
                <img 
                  src="/karunakar.jpg" 
                  alt="A K Karunakar" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Speaker"}
                />
              </div>
              <h3 className="text-xl font-bold text-[#001d3d] mb-1">A K Karunakar</h3>
              <p className="text-green-600 font-medium text-sm mb-2">Invited Speaker</p>
              <p className="text-gray-600 text-sm">Manipal University Jaipur, India</p>
            </div>

          </div>

          <div className="mt-10">
            <Link 
              to="/KeyNotes" 
              className="inline-block bg-blue-600 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition"
            >
              View All Speakers →
            </Link>
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="my-12 relative w-[85vw] mx-auto">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        <div className="absolute inset-0 blur-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
      </div>

      {/* Sponsors */}
      <section
        ref={sponsorsRef}
        className={`py-16 px-6 sm:px-12 bg-gray-50 transition-all duration-700 ${sponsorsInView ? "animate-fadeInDown" : "opacity-0"
          }`}
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-blue-900 mb-12">
          Sponsors
        </h2>
        <div className="flex justify-center py-12">
          <p className="text-center text-red-700 text-lg sm:text-xl font-medium">
            ✨ Information will be available shortly ✨
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;