import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Committee() {
  return (
    <>
      <Navbar />
      <section className="mt-4 py-16 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Committees
        </h2>
        <div className="max-w-3xl mx-auto grid gap-8 sm:grid-cols-2">
          <Link to="/committee/SteeringCommitte" className="block bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-50 transition">
            <h3 className="text-xl font-medium mb-2">Steering Committee</h3>
            <p className="text-gray-600">Guides the overall direction of the conference.</p>
          </Link>
          <Link to="/committee/organizingCommitte" className="block bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-50 transition">
            <h3 className="text-xl font-medium mb-2">Organizing Committee</h3>
            <p className="text-gray-600">Handles logistics and event management.</p>
          </Link>
          <Link to="/committee/technicalCommitte" className="block bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-50 transition">
            <h3 className="text-xl font-medium mb-2">Technical Committee</h3>
            <p className="text-gray-600">Manages paper review and technical content.</p>
          </Link>
          <Link to="/committee/advisory" className="block bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-50 transition">
            <h3 className="text-xl font-medium mb-2">Advisory Committee</h3>
            <p className="text-gray-600">Provides expert advice and guidance.</p>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Committee;