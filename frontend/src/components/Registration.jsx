import React from "react";

function Registration() {
  return (
    <section
      className="relative bg-gray-50 text-gray-500 flex flex-col min-h-screen md:py-2 mt-8"
      style={{
        backgroundImage: "url('/Sammeer Wani 8768hu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Conference Header */}
      <div className="relative z-10 text-center sm:px-8 w-auto space-y-4 text-[#0a0908] bg-black/20 text-white rounded-xl p-6 mt-12 ">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">
          2026 International Conference on Applied Artificial Intelligence (2AI)
        </h1>

        {/* Dates - Updated with (Hybrid Mode) */}
        <p className="text-lg sm:text-xl lg:text-2xl font-regular drop-shadow-md">
          June 17 - 19, 2026 (Hybrid Mode)
        </p>

        {/* Location - Updated with specific line break */}
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
              {/* This forces the "of South Dakota" to the next line */}
              <br />
              University of South Dakota (USA)
            </a>
          </p>
        </div>
      </div>

      {/* START OF REGISTRATION TABLE SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 py-10 mt-6">
        <div className="bg-white/95 p-5 rounded-xl shadow-lg w-full max-w-3xl text-[#001d3d] animate-fadeIn">
          
          {/* Header matching Excel */}
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center border-b-2 border-gray-200 pb-2">
            Registration fee for the conference (18-19 June 2026)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-[#001d3d] text-white">
                  <th className="p-2 border border-gray-300">Category</th>
                  <th className="p-2 border border-gray-300">Sub-category</th>
                  <th className="p-2 border border-gray-300">South Asian</th>
                  <th className="p-2 border border-gray-300">Others</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 bg-white">
                {/* Authors Section - Merged Cell */}
                <tr>
                  <td rowSpan="2" className="p-2 border border-gray-300 font-bold bg-gray-50 align-middle">
                    Authors
                  </td>
                  <td className="p-2 border border-gray-300">UG/PG/PhD students</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 80 (Rs. 7200)</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 150</td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">Others</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 120 (Rs. 10800)</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 200</td>
                </tr>

                {/* Non-Authors Section - Merged Cell */}
                <tr>
                  <td rowSpan="2" className="p-2 border border-gray-300 font-bold bg-gray-50 align-middle">
                    Non authors
                  </td>
                  <td className="p-2 border border-gray-300">UG/PG/PhD students</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 50 (Rs. 4500)</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 75</td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">Others</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 60 (Rs. 5400)</td>
                  <td className="p-2 border border-gray-300 font-semibold">$ 100</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes - Updated Text */}
          <div className="mt-4 space-y-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 text-sm">
            <p className="text-gray-700">
              <span className="font-bold">Note:</span> All registrations include Lunch, Tea breaks and conference kit for the participants attending physically.
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Workshop:</span> Registration fee for Pre-Conference Workshop (17th June 2026):{" "}
              <span className="font-bold text-red-600">$ 20 (Rs. 1800)</span>
            </p>
          </div>

        </div>
      </section>
    </section>
  );
}

export default Registration;