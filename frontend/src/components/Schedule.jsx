import React from "react";

function Schedule() {
  return (
    <section
      className="relative bg-gray-50 text-gray-500 flex flex-col min-h-screen md:py-2 mt-10"
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
            USD AI Research, University of South Dakota (USA)
          </a>
        </p>
      </div>

      {/* main section */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-2 py-0 -mt-15">
        <div className="max-w-3xl text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            📅 Conference Schedule
          </h2>

          {/* Subheading */}
          <p className="border border-white rounded-xl text-lg md:text-2xl text-red-700 tracking-wide p-4 bg-white/60 shadow-sm font-regular">
            Stay up to date with our sessions, workshops, and keynotes.
          </p>
        </div>
      </section>
    </section>
  );

}

export default Schedule;
