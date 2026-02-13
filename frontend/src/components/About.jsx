// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import PageLayout from "./PageLayout";

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
    <PageLayout 
      title="About 2AI Conference 2026"
      subtitle="Learn more about the conference, venue, and organizers"
    >
      {/* Conference Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          2026 International Conference on Applied Artificial Intelligence (2AI)
        </h2>
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Date:</span> June 17 - 19, 2026 (Hybrid Mode)
        </p>
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Venue:</span>{" "}
          <a
            href="https://www.cukashmir.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Central University of Kashmir, India
          </a>
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">In collaboration with:</span>{" "}
          <a
            href="https://www.ai-research-lab.org/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            USD AI Research, University of South Dakota (USA)
          </a>
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className="bg-white rounded shadow-sm p-6"
            >
              <div
                className={`flex flex-col ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } gap-6 items-start`}
              >
                {/* Image */}
                <div className="md:w-1/2 w-full flex-shrink-0">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-64 md:h-80 rounded object-cover"
                  />
                </div>

                {/* Text */}
                <div className="md:w-1/2 w-full">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                    {section.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Microsoft CMT Service Note */}
      <div className="mt-8 bg-blue-100 border-l-4 border-blue-600 p-6 rounded shadow-sm">
        <p className="text-gray-800 text-base leading-relaxed">
          The Microsoft CMT service was used for managing the peer-reviewing
          process for this conference. This service was provided for free by
          Microsoft and they bore all expenses, including costs for Azure
          cloud services as well as for software development and support.
        </p>
      </div>
    </PageLayout>
  );
}

export default About;
