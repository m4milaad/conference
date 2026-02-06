import React from "react";
import Navbar from "./Navbar";
import { FileText, Shield, SearchCheck, Presentation, FileDown } from "lucide-react"; // icons

function CallForPapers() {
  const sections = [
    {
      id: 1,
      title: "Paper Submission Instructions",
      icon: <FileText className="w-8 h-8 text-blue-700" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
          <li>All authors must comply with guidelines while preparing their manuscripts</li>
          <li>The images and tables must be self-drawn or must be used with proper permissions and copyrights</li>
          <li>All the equations used in the manuscript must be written using equation editor.</li>
          <li>The similarity index/plagiarism should not be more than <strong>5% </strong>from a single source and must be less than <strong>15%</strong> (including self-plagiarism) .</li>
          <li>It is mandatory to use Mendeley software for referencing in the manuscript.</li>
          <li>Submit the papers by clicking the below link</li>
          <a
            href="https://cmt3.research.microsoft.com/AAI2026"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline hover:text-blue-800 font-bold"
          >
            Microsoft-CMT Link for Paper Submission
          </a>{" "}
        </ul>
      ),
    },
    {
      id: 2,
      title: "Copyright Form",
      icon: <Shield className="w-8 h-8 text-green-700" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
          <li>You will have to send us the signed copy of Copyright form as a scanned PDF, after the acceptance of your manuscript.</li>
          <li>The corresponding author should be available to check the paper before it is published.</li>
          <li>Please note that once a paper has been delivered to Springer, changes relating to the authorship of the paper cannot be made.</li>
          <li>Once paper is delivered to Springer Author's names cannot be added or deleted, their order cannot be changed, and the corresponding author cannot be altered.</li>
          <li>The corresponding author signing the copyright form should match the corresponding author marked on the paper.</li>

        </ul>
      ),
    },
    // {
    //   id: 3,
    //   title: "Evaluation Process",
    //   icon: <SearchCheck className="w-8 h-8 text-purple-700" />,
    //   content: (
    //     <>
    //       <p className="text-gray-700 mb-4">
    //         All submissions will go through a rigorous double-blind peer review
    //         by at least two independent reviewers. Papers will be evaluated based on:
    //       </p>
    //       <ul className="list-disc list-inside text-gray-700 space-y-2">
    //         <li>Novelty and originality of the work</li>
    //         <li>Technical quality and depth</li>
    //         <li>Clarity of presentation</li>
    //         <li>Significance of results and contributions</li>
    //       </ul>
    //     </>
    //   ),
    // },
    {
      id: 4,
      title: "Presentation Guidelines",
      icon: <Presentation className="w-8 h-8 text-red-700" />,
      content: (
        <p>Oral presentations should strictly comply with the content of the corresponding paper. The duration of the presentation will be determined before the event, authors will be informed with sufficient time.
          Speakers must be registered in the conference, just like any other attendee.</p>
      ),
    },
    {
      id: 5,
      title: "Paper Template",
      icon: <FileDown className="w-8 h-8 text-indigo-700" />,
      content: (
        <div>
          <p className="text-gray-700 mb-4">
            Those who are interested in submitting their papers to the conference should use the{" "}
            <a
              href="https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 font-bold"
            >
              CCIS
            </a>
            ,{" "}
            <a
              href="https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 font-bold"
            >
              SpringerNature
            </a>{"  "}
            Template. You can also use{" "}
            <a
              href=" https://www.overleaf.com/latex/templates/springer-conference-proceedings-template-updated-2022-01-12/wcvbtmwtykqj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 font-bold"
            >
              Overleaf
            </a>{" "}
            for editing your article. The Full-Length Paper should not exceed 15 pages and the file size should not exceed 10 MB. Any submissions below 12 pages will be considered a Short Paper.
          </p>
        </div>
      ),
    }

  ];

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: "url('/Sammeer Wani 8768hu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/30"></div>

      <Navbar />

      {/* Conference Header */}
      <div className="relative z-10 text-center sm:px-8 w-auto space-y-4 text-[#0a0908] bg-black/40 text-white rounded-xl p-6 mt-25 ">
        {/* Title */}
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">
          2026 International Conference on Applied Artificial Intelligence (2AI)
        </h1>

        {/* Dates */}
        <p className="text-lg sm:text-xl lg:text-2xl font-regular drop-shadow-md">
          June 17 - 19, 2026 (Hybirid Mode)
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
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Page Header */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#001d3d] mb-3">
            📑 Paper Submission Guidelines
          </h1>
          <p className="text-[#333d29] text-lg max-w-2xl mx-auto">
            Authors are invited to contribute original research papers to the
            conference. Please carefully read the instructions below.
          </p>
        </header>

        {/* Sections */}
        <div className="grid gap-8 sm:grid-cols-2">
          {sections.map((sec) => (
            <section
              key={sec.id}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-4">
                {sec.icon}
                <h2 className="text-xl font-medium text-blue-800">
                  {sec.title}
                </h2>
              </div>
              {sec.content}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default CallForPapers;
