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
    },
  ];

  const invitedSpeakers = [
    {
      name: "A K Karunakar",
      role: "Pro President",
      org: "Manipal University Jaipur, India",
      image: "/karunakar.jpg",
    },
    {
      name: "Maheshkumar H. Kolekar",
      role: "Associate Professor, Electrical Engineering Department",
      org: "Indian Institute of Technology Patna, India",
      image: "/mahesh.jpg",
    },
    {
      name: "Dr. Karan Nathwani",
      role: "Associate Professor, Electrical Engineering",
      org: "IIT Jammu, India",
      image: "/karan.jpg",
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
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default KeyNotes;
