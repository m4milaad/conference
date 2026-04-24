// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import PageLayout from "./PageLayout";

function KeyNotes() {
  const keynoteSpeakers = [
    {
      name: "Prof. Nishchal K Verma",
      role: "Professor, Dept of Electrical Engineering",
      org: "Indian Institute of Technology Kanpur, India",
      image: "/nishchal.jpg",
      bio: "Dr. Nishchal Kumar Verma is Professor in Electrical Engineering at IIT Kanpur, with more than 20 years of contributions to artificial intelligence and machine learning research. His work spans large language models, intelligent instrumentation, control and automation, computer vision, prognosis and health management, bioinformatics, and cyber-physical systems. He has received major honors including the Smt. Lata and K.G. Karandikar Faculty Chair Professorship and Teaching Excellence Award (2024), alongside international research fellowships from UNEC Azerbaijan and the University of Tennessee. He has published over 270 papers, edited six books, led multiple funded projects including collaborations with The BOEING Company, and served as Associate Editor for leading IEEE journals in AI and neural learning systems.",
    },
  ];

  const invitedSpeakers = [
    {
      name: "A K Karunakar",
      role: "Pro President",
      org: "Manipal University Jaipur, India",
      image: "/karunakar.jpg",
      talkTitle: "Applied AI: Insights from Computer Vision, Biomedical Intelligence, and Media Forensics",
      bio: "Prof. Dr. Karunakar A. Kotegar is a distinguished academic leader and Professor in Data Science and Computer Applications at MAHE, bringing more than 25 years of impact across teaching, research, and university leadership. His expertise spans image and video processing, scalable multimedia systems, and data science, with AI-driven applications in healthcare, digital forensics, and secure intelligence platforms. He has led funded research projects, published extensively in reputed international venues, and built major interdisciplinary initiatives. Through leadership roles including Director of International Relations and President of IAESTE India, he has expanded global partnerships and strengthened high-value academic exchange networks.",
    },
    {
      name: "Maheshkumar H. Kolekar",
      role: "Associate Professor, Electrical Engineering Department",
      org: "Indian Institute of Technology Patna, India",
      image: "/mahesh.jpg",
      talkTitle: "AI-driven Biomedical Signal and Image Processing",
      bio: "Dr. Maheshkumar H. Kolekar, Head and Associate Professor in Electrical Engineering at IIT Patna, is a leading researcher in artificial intelligence, computer vision, and signal processing. After earning his Ph.D. from IIT Kharagpur, he advanced international research through fellowships at the University of Missouri and TU Berlin, focusing on intelligent surveillance and EEG analytics. He has authored and edited influential books, led funded projects on abnormal human activity recognition, and continues to shape the field as Associate Editor of IEEE Transactions on Multimedia. His scientific contributions have earned global recognition, including listing among Stanford University's top 2% scientists and the IETE Dr. K. D. Pavate Memorial Award 2025.",
    },
    {
      name: "Dr. Karan Nathwani",
      role: "Associate Professor, Electrical Engineering",
      org: "IIT Jammu, India",
      image: "/karan.jpg",
      talkTitle: "AI is ubiquitous",
      bio: "Dr. Karan Nathwani is Associate Professor in Electrical Engineering at IIT Jammu, known for his work at the intersection of advanced signal processing, speech technologies, and practical AI. His research covers speech enhancement, speech recognition, and audio intelligence, with strong applications in intelligibility optimization and underwater acoustics. He earned his Ph.D. from IIT Kanpur and completed postdoctoral research at Telecom ParisTech, Inria Nancy, and the University of Oxford. With high-impact publications and funded projects in underwater signal processing, drone detection, and AI-enabled speech systems, he brings both deep technical rigor and real-world innovation to challenging acoustic environments.",
    },
  ];

  return (
    <PageLayout 
      title="Distinguished Speakers"
      subtitle="Keynote and invited speakers for the 2026 International Conference on Applied Artificial Intelligence"
    >
      {/* Keynote Speakers */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
          Keynote Speakers
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {keynoteSpeakers.map((speaker, idx) => (
            <div key={idx} className="bg-white rounded shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-600 mb-4">
                <img 
                  src={speaker.image} 
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Speaker"}
                />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">{speaker.name}</h4>
              <p className="text-sm text-blue-600 font-medium mb-2">{speaker.role}</p>
              <p className="text-xs text-gray-600">{speaker.org}</p>
              {speaker.bio && (
                <p className="mt-3 text-xs text-gray-700 leading-relaxed text-left">
                  {speaker.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invited Speakers */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-4">
          Invited Speakers
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitedSpeakers.map((speaker, idx) => (
            <div key={idx} className="bg-white rounded shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-600 mb-4">
                <img 
                  src={speaker.image} 
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Speaker"}
                />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">{speaker.name}</h4>
              <p className="text-sm text-green-600 font-medium mb-2">{speaker.role}</p>
              <p className="text-xs text-gray-600">{speaker.org}</p>
              {speaker.talkTitle && (
                <div className="mt-3 text-left rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 via-green-50 to-lime-50 px-3 py-2 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Talk Spotlight
                  </p>
                  <p className="mt-1 text-xs font-semibold text-gray-800 leading-relaxed">
                    {speaker.talkTitle}
                  </p>
                </div>
              )}
              {speaker.bio && (
                <p className="mt-3 text-xs text-gray-700 leading-relaxed text-left">
                  {speaker.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default KeyNotes;
