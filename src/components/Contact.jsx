// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import { useState } from "react";
import PageLayout from "./PageLayout";
import { Mail, MapPin, Send } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    alert("✅ Feedback sent successfully!");
    setFormData({ name: "", email: "", feedback: "" });
  };

  return (
    <PageLayout 
      title="Contact Us"
      subtitle="Get in touch with the conference organizers"
    >
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Contact Information */}
        <div className="bg-white rounded shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Contact Information
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <a
                  href="mailto:aaiconferences@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  aaiconferences@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Location</p>
                <p className="text-gray-700">Central University of Kashmir, India</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-6">
            <a
              href="https://maps.app.goo.gl/36i9dDJWYn9n3nRS7"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.680615552739!2d74.72459227572418!3d34.23117257309002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e19d996de5015d%3A0x5cdc403498de0f0e!2sCentral%20University%20of%20Kashmir!5e0!3m2!1sen!2sin!4v1758301985418!5m2!1sen!2sin"
                width="100%"
                height="300"
                allowFullScreen=""
                loading="lazy"
                className="rounded border border-gray-300"
              ></iframe>
            </a>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Send Us Your Feedback
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            
            <div>
              <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                id="feedback"
                name="feedback"
                rows="5"
                value={formData.feedback}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white font-semibold px-6 py-3 rounded transition flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Send Feedback
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}

export default Contact;
