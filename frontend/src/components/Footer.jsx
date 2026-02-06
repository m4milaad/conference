import React from "react";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-950 via-purple-900 to-blue-950 text-white w-auto">
      {/* Wrapper */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 font-medium">
        {/* Logo + About */}
        <div className="text-center md:text-left space-y-4">
          {/* Logos side by side */}
          <div className="flex justify-center md:justify-start items-center gap-4">
            <img
              src="/CUKLogo.png"
              alt="Conference Logo"
              className="h-16 "
            />
            <img
              src="/logo.png"
              alt="Conference Logo"
              className="h-16 object-contain"
            />
          </div>

          {/* Text below */}
          <p className="text-gray-300 text-sm leading-relaxed">
            <br />
            2026 International Conference on Applied Artificial Intelligence (2AI) <br />
          </p>
        </div>


        {/* Social Media */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-yellow-400">Follow Us</h3>
          <div className="flex justify-center space-x-6 text-2xl">
            <a
              href="#"
              className="hover:text-pink-400 active:text-pink-400 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 active:text-blue-400 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="hover:text-blue-500 active:text-blue-500 transition"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

        {/* Webmaster*/}
        <div className="text-center space-y-3">
          <h3 className="text-xl font-medium text-yellow-400">Webmaster</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Swathi and Central University of Karnataka Team
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} International Conference. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
