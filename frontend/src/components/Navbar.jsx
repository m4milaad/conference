import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [committeeOpen, setCommitteeOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);

  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Call For Papers", path: "/call-for-papers" },
    { name: "Committee", path: "/committee" },
    { name: "Schedule", path: "/schedule" },
    { name: "Sessions", path: "/sessions" },
    { name: "Speakers", path: "/KeyNotes" }, // Changed from "KeyNotes" to "Speakers"
    { name: "Sponsors", path: "/sponsors" },
    { name: "Registration", path: "/registration" },
    { name: "Contact", path: "/contact" },
    // { name: "Login", path: "/login" },
  ];

  const committeeItems = [
    { name: "Steering Committee", path: "/committee/SteeringCommitte" },
    { name: "Organizing Committee", path: "/committee/organizingCommitte" },
    // { name: "Technical Committee", path: "/committee/technicalCommitte" },
  ];

  const sessionsItems = [
    { name: "Special Sessions", path: "/sessions/specialSessions" },
    { name: "Workshops", path: "/sessions/workshops" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setCommitteeOpen(false);
        setSessionsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-14xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex justify-center md:justify-start items-center gap-4">
          <img
            src="/CUKLogo.png"
            alt="Conference Logo"
            className="h-16 w-12 object-contain"
          />
          <img
            src="/logo.png"
            alt="Conference Logo"
            className="h-16 w-16 object-contain"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-wrap gap-6 font-bold text-black text-base lg:gap-8 lg:text-lg">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            if (item.name === "Committee") {
              return (
                <div key={index} className="relative dropdown">
                  <button
                    onClick={() => {
                      setCommitteeOpen(!committeeOpen);
                      setSessionsOpen(false);
                    }}
                    className={`flex items-center gap-1 transition ${location.pathname.startsWith("/committee")
                      ? "text-[#d81159]"
                      : "hover:text-[#d81159]"
                      }`}
                  >
                    {item.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${committeeOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {committeeOpen && (
                    <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-56 z-50">
                      <ul className="flex flex-col py-2">
                        {committeeItems.map((sub, subIndex) => {
                          const subActive = location.pathname === sub.path;
                          return (
                            <li key={subIndex}>
                              <Link
                                to={sub.path}
                                onClick={() => setCommitteeOpen(false)}
                                className={`block px-4 py-2 transition ${subActive
                                  ? "text-[#d81159] font-medium"
                                  : "text-gray-700 hover:bg-blue-100 hover:text-[#d81159]"
                                  }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            } else if (item.name === "Sessions") {
              return (
                <div key={index} className="relative dropdown">
                  <button
                    onClick={() => {
                      setSessionsOpen(!sessionsOpen);
                      setCommitteeOpen(false);
                    }}
                    className={`flex items-center gap-1 transition ${location.pathname.startsWith("/sessions")
                      ? "text-[#d81159]"
                      : "hover:text-[#d81159]"
                      }`}
                  >
                    {item.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${sessionsOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {sessionsOpen && (
                    <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-56 z-50">
                      <ul className="flex flex-col py-2">
                        {sessionsItems.map((sub, subIndex) => {
                          const subActive = location.pathname === sub.path;
                          return (
                            <li key={subIndex}>
                              <Link
                                to={sub.path}
                                onClick={() => setSessionsOpen(false)}
                                className={`block px-4 py-2 transition ${subActive
                                  ? "text-[#d81159] font-medium"
                                  : "text-gray-700 hover:bg-blue-100 hover:text-[#d81159]"
                                  }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                className={`relative group transition-all duration-300 ${isActive ? "text-[#d81159]" : "hover:text-[#d81159]"
                  }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-blue-500 transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-800 hover:text-[#d81159] transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-40 max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col font-bold text-gray-900 text-lg">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              if (item.name === "Committee") {
                return (
                  <div key={index} className="dropdown">
                    <button
                      onClick={() => {
                        setCommitteeOpen(!committeeOpen);
                        setSessionsOpen(false);
                      }}
                      className={`flex items-center gap-1 px-4 py-2 transition ${location.pathname.startsWith("/committee")
                        ? "text-[#d81159]"
                        : "hover:text-[#d81159]"
                        }`}
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${committeeOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {committeeOpen && (
                      <ul className="flex flex-col bg-gray-50">
                        {committeeItems.map((sub, subIndex) => {
                          const subActive = location.pathname === sub.path;
                          return (
                            <li key={subIndex}>
                              <Link
                                to={sub.path}
                                onClick={() => {
                                  setCommitteeOpen(false);
                                  setIsOpen(false);
                                }}
                                className={`block px-8 py-2 transition ${subActive
                                  ? "text-[#d81159] font-medium"
                                  : "text-gray-700 hover:bg-blue-100 hover:text-[#d81159]"
                                  }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              } else if (item.name === "Sessions") {
                return (
                  <div key={index} className="dropdown">
                    <button
                      onClick={() => {
                        setSessionsOpen(!sessionsOpen);
                        setCommitteeOpen(false);
                      }}
                      className={`flex items-center gap-1 px-4 py-2 transition ${location.pathname.startsWith("/sessions")
                        ? "text-[#d81159]"
                        : "hover:text-[#d81159]"
                        }`}
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${sessionsOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {sessionsOpen && (
                      <ul className="flex flex-col bg-gray-50">
                        {sessionsItems.map((sub, subIndex) => {
                          const subActive = location.pathname === sub.path;
                          return (
                            <li key={subIndex}>
                              <Link
                                to={sub.path}
                                onClick={() => {
                                  setSessionsOpen(false);
                                  setIsOpen(false);
                                }}
                                className={`block px-8 py-2 transition ${subActive
                                  ? "text-[#d81159] font-medium"
                                  : "text-gray-700 hover:bg-blue-100 hover:text-[#d81159]"
                                  }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              }

              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 transition ${isActive ? "text-[#d81159]" : "hover:text-[#d81159]"
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;