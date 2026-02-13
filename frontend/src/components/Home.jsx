// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import NotificationBar from "./NotificationBar";
import useInView from "../hooks/useInView";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Bell, 
  Camera, 
  Presentation, 
  FileText,
  Zap,
  GraduationCap,
  Stethoscope,
  Wheat,
  Briefcase,
  Shield,
  Sparkles
} from "lucide-react";

function Home() {
  const images = [
    "/Sammeer Wani Winter_8.jpg",
    "/KASGMIR8.jpg",
    "/KASGMIR7.jpg",
    "/KASHMIR2.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const [speakersRef, speakersInView] = useInView({ threshold: 0.2 });
  const [sponsorsRef, sponsorsInView] = useInView({ threshold: 0.2 });

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        
        {/* Conference Title Section */}
        <div className="bg-white rounded shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            2026 International Conference on Applied Artificial Intelligence (2AI)
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-700">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">June 17 - 19, 2026</p>
              <p className="text-base">Central University of Kashmir, India</p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={images[currentIndex]} 
                alt="Conference Location" 
                className="w-full md:w-64 h-40 object-cover rounded shadow-md transition-all duration-1000"
              />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Registration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Registration</h2>
              <Link 
                to="/registration"
                className="inline-block bg-[#28a745] hover:bg-[#218838] text-white font-semibold px-6 py-2.5 rounded transition w-full text-center"
              >
                Register
              </Link>
              <Link 
                to="/sessions/workshops"
                className="inline-block bg-[#007bff] hover:bg-[#0056b3] text-white font-semibold px-6 py-2.5 rounded transition w-full text-center mt-3"
              >
                Workshops
              </Link>
            </div>

            {/* Conference Info Card */}
            <div className="bg-white rounded shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Conference Information</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-gray-800">Location:</p>
                  <a
                    href="https://www.cukashmir.ac.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Central University of Kashmir, India
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">In collaboration with:</p>
                  <a
                    href="https://www.ai-research-lab.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    USD AI Research, University of South Dakota (USA)
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Mode:</p>
                  <p>Hybrid (In-person & Virtual)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Announcements</h2>
              </div>
              
              {/* Notification Bar - Constrained Width */}
              <div className="px-6">
                <NotificationBar />
              </div>

              {/* Content with padding */}
              <div className="px-6 pb-6">
                {/* Important Dates */}
                <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700 flex items-center gap-2">
                      <FileText size={16} className="text-blue-600 flex-shrink-0" />
                      Article Submission Deadline
                    </span>
                    <span className="font-semibold text-gray-800">15-Feb-2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700 flex items-center gap-2">
                      <Bell size={16} className="text-green-600 flex-shrink-0" />
                      Notification of Acceptance
                    </span>
                    <span className="font-semibold text-gray-800">15-Mar-2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700 flex items-center gap-2">
                      <Camera size={16} className="text-purple-600 flex-shrink-0" />
                      Camera Ready Submission
                    </span>
                    <span className="font-semibold text-gray-800">20-Mar-2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700 flex items-center gap-2">
                      <Calendar size={16} className="text-orange-600 flex-shrink-0" />
                      Registration (Start)
                    </span>
                    <span className="font-semibold text-gray-800">20-Mar-2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700 flex items-center gap-2">
                      <Presentation size={16} className="text-red-600 flex-shrink-0" />
                      Pre-Conference Workshop
                    </span>
                    <span className="font-semibold text-gray-800">17-June-2026</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700 flex items-center gap-2">
                      <Presentation size={16} className="text-red-600 flex-shrink-0" />
                      Main Conference Date
                    </span>
                    <span className="font-semibold text-gray-800">18,19-June 2026</span>
                  </div>
                </div>
              </div>

              {/* Paper Submission */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Paper Submission</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Authors are invited to submit their original and unpublished research paper.
                </p>
                <a
                  href="https://cmt3.research.microsoft.com/AAI2026"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-[#007bff] hover:bg-[#0056b3] text-white font-semibold px-5 py-2 rounded text-sm transition"
                >
                  Submit Paper →
                </a>
              </div>

              {/* Past Event */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Past Event</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">2024 International Conference on Applied Artificial Intelligence (2AI)</span> (July 2 - 4, 2024)
                  at the Shoolini University of Biotechnology and Management Sciences, Solan, India
                </p>
                <a
                  href="https://applied-ai-conference.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Visit Past Event's Website →
                </a>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conference Themes Section */}
        <div className="mt-6 bg-white rounded shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Conference Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-gray-700 text-sm p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
              <Zap size={20} className="text-yellow-600 flex-shrink-0" />
              <span>AI for Energy</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 text-sm p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
              <GraduationCap size={20} className="text-blue-600 flex-shrink-0" />
              <span>AI for Education</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 text-sm p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
              <Stethoscope size={20} className="text-red-600 flex-shrink-0" />
              <span>AI for Healthcare</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 text-sm p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
              <Wheat size={20} className="text-green-600 flex-shrink-0" />
              <span>AI for Agriculture</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 text-sm p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
              <Briefcase size={20} className="text-purple-600 flex-shrink-0" />
              <span>AI for Business & Finance</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 text-sm p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
              <Shield size={20} className="text-indigo-600 flex-shrink-0" />
              <span>AI for Defense & Security</span>
            </div>
          </div>
        </div>

        {/* Distinguished Speakers Section */}
        <div 
          ref={speakersRef}
          className={`mt-6 bg-white rounded shadow-sm p-6 transition-all duration-700 ${speakersInView ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distinguished Speakers</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded hover:shadow-md transition">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-3">
                <img 
                  src="/nishchal.jpg" 
                  alt="Prof. Nishchal K Verma" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Speaker"}
                />
              </div>
              <h3 className="text-base font-bold text-gray-800">Prof. Nishchal K Verma</h3>
              <p className="text-sm text-blue-600 font-medium">Keynote Speaker</p>
              <p className="text-xs text-gray-600">IIT Kanpur, India</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded hover:shadow-md transition">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-3">
                <img 
                  src="/karunakar.jpg" 
                  alt="A K Karunakar" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Speaker"}
                />
              </div>
              <h3 className="text-base font-bold text-gray-800">A K Karunakar</h3>
              <p className="text-sm text-green-600 font-medium">Invited Speaker</p>
              <p className="text-xs text-gray-600">Manipal University Jaipur, India</p>
            </div>

          </div>

          <div className="mt-6 text-center">
            <Link 
              to="/KeyNotes" 
              className="inline-block bg-[#007bff] hover:bg-[#0056b3] text-white font-semibold px-6 py-2 rounded text-sm transition"
            >
              View All Speakers →
            </Link>
          </div>
        </div>

        {/* Sponsors Section */}
        <div
          ref={sponsorsRef}
          className={`mt-6 bg-white rounded shadow-sm p-6 transition-all duration-700 ${sponsorsInView ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sponsors</h2>
          <div className="flex justify-center py-8">
            <p className="text-center text-gray-600 text-base flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500" />
              Information will be available shortly
              <Sparkles size={20} className="text-yellow-500" />
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
