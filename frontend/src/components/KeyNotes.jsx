import React from "react";
import Navbar from "./Navbar";

function KeyNotes() {
  const keynoteSpeakers = [
    {
      name: "Prof. Nishchal K Verma",
      role: "Professor, Dept of Electrical Engineering",
      org: "Indian Institute of Technology Kanpur, India",
      image: "/nishchal.jpg", // Make sure this image is in the public folder
    },
  ];

  const invitedSpeakers = [
    {
      name: "A K Karunakar",
      role: "Pro President",
      org: "Manipal University Jaipur, India",
      image: "/karunakar.jpg", // Make sure this image is in the public folder
    },
    
    {
      name: "Maheshkumar H. Kolekar",
      role: "Associate Professor, Electrical Engineering Department",
      org: "Indian Institute of Technology Patna, India",
      image: "/mahesh.jpg", // Make sure to add this image to your public folder
    },
    {
      name: "Dr. Karan Nathwani",
      role: "Associate Professor, Electrical Engineering",
      org: "IIT Jammu, India",
      image: "/karan.jpg", // Make sure to rename his photo to 'karan.jpg' and put it in your public folder
    },
  ];

  return (
    <div
      className="relative bg-gray-50 text-gray-500 flex flex-col min-h-screen md:py-2 mt-8"
      style={{
        backgroundImage: "url('/Sammeer Wani 8768hu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/10"></div>

      <Navbar />

      {/* Conference Header */}
      <div className="relative z-10 text-center sm:px-8 w-auto space-y-4 text-[#0a0908] bg-black/20 text-white rounded-xl p-6 mt-12 ">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">
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
            in collaboration with{"   "}
            <a
              href="https://www.ai-research-lab.org/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-300 underline hover:text-blue-400"
            >
              USD AI Research,
              <br />
              University of South Dakota (USA)
            </a>
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="min-h-[60vh] flex flex-col items-center justify-start px-4 py-10 -mt-6 space-y-12">
        {/* Page Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#001d3d] drop-shadow-lg text-center bg-white/60 px-8 py-2 rounded-xl backdrop-blur-sm">
          Speakers
        </h2>

        {/* --- KEYNOTE SPEAKERS SECTION --- */}
        <div className="w-full max-w-5xl animate-fadeIn space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white bg-blue-900/80 inline-block px-6 py-2 rounded-r-full shadow-md">
            Keynote Speakers
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {keynoteSpeakers.map((speaker, idx) => (
              <div
                key={idx}
                className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 border-t-4 border-blue-600 hover:transform hover:-translate-y-1 transition duration-300"
              >
                {/* Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=Image"; // Fallback if image missing
                    }}
                  />
                </div>
                {/* Details */}
                <div className="text-center md:text-left space-y-2">
                  <h4 className="text-xl md:text-2xl font-bold text-[#001d3d]">
                    {speaker.name}
                  </h4>
                  <p className="text-md text-blue-700 font-semibold">
                    {speaker.role}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {speaker.org}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- INVITED SPEAKERS SECTION --- */}
        <div className="w-full max-w-5xl animate-fadeIn space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white bg-green-800/80 inline-block px-6 py-2 rounded-r-full shadow-md">
            Invited Speakers
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {invitedSpeakers.map((speaker, idx) => (
              <div
                key={idx}
                className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 border-t-4 border-green-600 hover:transform hover:-translate-y-1 transition duration-300"
              >
                {/* Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=Image"; // Fallback
                    }}
                  />
                </div>
                {/* Details */}
                <div className="text-center md:text-left space-y-2">
                  <h4 className="text-xl md:text-2xl font-bold text-[#001d3d]">
                    {speaker.name}
                  </h4>
                  <p className="text-md text-green-700 font-semibold">
                    {speaker.role}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {speaker.org}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4">
          <p className="text-gray-900 bg-white/80 px-6 py-2 rounded-full font-medium shadow-sm border border-white">
          
          </p>
        </div>
      </section>
    </div>
  );
}

export default KeyNotes;