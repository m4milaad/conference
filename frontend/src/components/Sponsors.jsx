import React from "react";

function Sponsers() {
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
            USD AI Research, University of South Dakota (USA)
          </a>
        </p>
      </div>

      <section className="min-h-[75vh] flex items-center justify-center px-6 py-12 -mt-35">
        <div className="text-center max-w-4xl space-y-4 animate-fadeIn">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#001d3d] drop-shadow-md">
            Sponsorship Opportunities
          </h2>

          {/* Subtitle */}
          <p className="text-[#333d29] sm:text-sm font-regular md:text-lg lg:text-xl text-black">
            We are working on creating exciting sponsorship packages for partners,
            organizations, and companies who want to be part of our conference.
          </p>

          {/* Status */}
          <div className="mt-6">
            <span className="inline-block bg-yellow-100 text-yellow-700 font-medium px-3 py-0 rounded-full shadow-md text-sm sm:text-base md:text-lg">
              📢 Details will be declared soon
            </span>
          </div>

          {/* Call-to-action (optional for future) */}
          {/* <div className="mt-8">
            <a
              href="mailto:info@conference.org"
              className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              Contact Us for Early Inquiries
            </a>
          </div> */}
        </div>
      </section>
    </section>
  );
}

export default Sponsers;
