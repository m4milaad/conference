import React from "react";

function Workshops() {
  return (
    <section className="relative bg-gray-50 text-gray-500 flex flex-col min-h-screen md:py-2 mt-8"
      style={{
        backgroundImage: "url('/Sammeer Wani 8768hu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay (for better readability) */}
      {/* <div className="absolute inset-0 bg-white/10"></div> */}

      {/* Conference Header */}
      <div className="relative z-10 text-center sm:px-8 w-auto space-y-4 text-[#0a0908] bg-black/20 text-white rounded-xl p-6 mt-12 ">
        {/* Title */}
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">
          2026 International Conference on Applied Artificial Intelligence (2AI)
        </h1>

        {/* Dates */}
        <p className="text-lg sm:text-xl lg:text-2xl font-regular drop-shadow-md">
          June 17 - 19, 2026 (Hybrid Mode)
        </p>

        {/* Location */}
        <p className="text-sm sm:text-lg lg:text-xl leading-relaxed drop-shadow-md ">
          at {"  "}
          <a
            href="https://www.cukashmir.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-300 underline hover:text-blue-400"
          >
            Central University of Kashmir, India
          </a>{" "}
          in collaboration with{"   "}
          <a
            href="https://www.ai-research-lab.org/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-300 underline hover:text-blue-400"
          >
            USD AI Research University of South Dakota (USA)
          </a>
        </p>
      </div>

      <section className="min-h-[80vh] flex items-center justify-center font-bold text-[#001d3d] px-6 -mt-35">
        <div className="text-center space-y-6 animate-fadeIn">
          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Workshops
          </h2>

          {/* Coming Soon */}
          <p className="text-lg md:text-2xl text-[#333d29]] tracking-wide">
            🚀 Exciting workshops are on the way!
          </p>

          {/* Badge */}
          <span className="inline-block bg-red-600 text-blue-900 font-medium text-sm md:text-base px-4 py-2 rounded-full shadow-md animate-pulse">
            Coming Soon
          </span>
        </div>
      </section>
    </section>
  );
}

export default Workshops;
