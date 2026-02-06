import React from "react";
import Navbar from "./Navbar";

function About() {
  const sections = [
    {
      title: "About Kashmir",
      text: `Kashmir is a stunningly beautiful region in the northwestern part of the Indian subcontinent, often called "Paradise on Earth." It is famous for its breathtaking landscapes, which include snow-capped Himalayan mountains, lush green valleys, and pristine lakes such as Dal Lake and Wular Lake. The climate varies greatly, from the temperate valleys to the high-altitude glaciers, which feed the Jhelum River.
      
      The culture of Kashmir is a rich tapestry woven from various influences, including Hindu, Buddhist, and Islamic traditions. This blend is reflected in the region's unique handicrafts,like intricate Pashmina shawls and walnut wood carvings, and its distinct cuisine, most notably the elaborate Wazwan feast. The people are known for their hospitality and artistic skills.Kashmir remains a popular tourist destination, drawing visitors with its serene houseboats, beautiful gardens, and opportunities for trekking and skiing. The region's natural beauty and rich cultural heritage continue to be its defining features.`,
      image: "/fdgdfg.jpg",
    },
    {
      title: "About Central University of Kashmir",
      text: `The Central University of Kashmir (CUK) is a government-funded university established in 2009 by an Act of Parliament. It's located in the Ganderbal district of Jammu and Kashmir.The university was created to provide quality higher education and promote research and extension activities in the region.
      
      CUK offers a wide range of academic programs, including undergraduate, postgraduate, and doctoral degrees across various disciplines. These include arts, commerce, engineering,education, law, and science. The university is in the process of developing a full-fledged campus at Tulmulla, with over 500 acres of land acquired for this purpose. While construction is ongoing,the university currently operates from several temporary campuses in Ganderbal.
      
      The university places a strong emphasis on providing a conducive learning environment, with facilities like a library, hostels, and sports complexes. Admissions to most undergraduate and postgraduate programs are based on the Common University Entrance Test (CUET). The university attracts students from various states across India.`,
      image: "/TULMUULAH CAMPUS.jpg",
    },
    {
      title: "About USD AI Research",
      text: (
        <>
          Based at the University of South Dakota (USD), we push the boundaries of foundational AI and machine learning while embracing sustainable AI solutions. Our research covers green computing, active learning, and scalable, robust AI, delivering efficiency with minimal carbon footprint.
          <br /><br />
          We specialize in pattern recognition, computer vision, image processing, data mining, and big data analytics, with interdisciplinary applications in healthcare informatics, medical imaging, document analysis, biometrics, forensics, speech processing, and the Internet of Things.
          <br /><br />
          Join us as we drive AI innovation with sustainability at its core! More information:{" "}
          <a
            href="https://www.ai-research-lab.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            www.ai-research-lab.org
          </a>{" "}
          (Founding Director, Prof. KC (Casey) Santosh).
        </>
      ),
      image: "/aiconference.jpeg",
    },

    {
      title: "About Conference",
      text: `The 2026 International Conference on Applied Artificial Intelligence (2AI), to be organized by Central University of Kashmir in collaboration with USD AI Research  (formerly 2AI Research Lab), University of South Dakota (USA), is a three-day event, running from June 17 to 19, 2026. The conference aims to facilitate global collaboration and the exchange of ideas among researchers, students, and industry professionals in the fields of computer science, data science, and artificial intelligence.
      The conference will cover various themes, including the application of AI in education, healthcare, agriculture, business and finance, energy, and defense and information security. It will feature plenary talks, workshops, and technical sessions on the latest advancements in data science, machine learning, and real-time computing.
`,
      image: "/KASHMIR1.jpg",
    },
  ];

  return (
    <div className="flex flex-col">
      <Navbar />
      {/* Conference Header */}
      <div className="relative z-10 text-center sm:px-8 w-auto space-y-4 text-[#0a0908] bg-black/50 text-white rounded-xl p-6 mt-25 ">
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
      <main className="flex flex-col bg-gray-50 py-10 px-2 sm:px-12 space-y-16 ">
        {/* Loop through sections */}
        {sections.map((section, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-stretch md:space-x-8 ${!isEven ? "md:flex-row-reverse md:space-x-reverse" : ""
                }`}
            >
              {/* Image */}
              <div className="md:w-1/2 w-full mb-6 md:mb-0 flex-shrink-0 flex">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-auto max-h-[900px] rounded-2xl shadow-lg object-cover"
                  style={{ display: "block" }}
                />
              </div>

              {/* Text */}
              <div className="md:w-1/2 w-full flex flex-col justify-center">
                <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-3 text-center md:text-left">
                  {section.title}
                </h2>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-line font-regular">
                  {section.text}
                </p>
              </div>
            </div>

          );
        })}
        {/* Microsoft CMT Service Note */}
        <div className="max-w-full mx-auto bg-blue-100 border-l-4 border-blue-600 p-6 rounded-lg shadow-sm">
          <p className="text-gray-800 text-base md:text-lg leading-relaxed text-center">
            The Microsoft CMT service was used for managing the peer-reviewing
            process for this conference. This service was provided for free by
            Microsoft and they bore all expenses, including costs for Azure
            cloud services as well as for software development and support.
          </p>
        </div>
      </main>
    </div>
  );
}

export default About;
