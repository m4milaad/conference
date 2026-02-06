import React, { useState } from "react";
import Navbar from "./Navbar";
import emailjs from "emailjs-com";


function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  {/*this feedback form can be enabled after using backend because it doesn't work without backend*/ }
  {/*
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Feedback sent successfully!");
        setFormData({ name: "", email: "", contact: "", feedback: "" });
      } else {
        alert("❌ Failed to send feedback.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Error sending feedback.");
    }
  };
  */}

  {/*this handlesubmit form should be disabled after using backend */ }
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_maeeszh",    // Service_ID from EmailJS
      "template_3v6obkc",   // Template_ID from EmailJS
      formData,
      "PSALdnhIYuDuveD2z"        // public_key from EmailJS
    )
      .then(() => {
        alert("✅ Feedback sent successfully!");
        setFormData({ name: "", email: "", contact: "", feedback: "" });
      })
      .catch((error) => {
        console.error(error);
        alert("❌ Failed to send feedback.");
      });
  };

  return (
    <>
      <Navbar />
      <section className="relative bg-gray-50 text-gray-500 flex flex-col min-h-screen md:py-2 mt-8"
        style={{
          backgroundImage: "url('/Sammeer Wani 8768hu.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>

        {/* Conference Header */}
        <div className="relative z-10 text-center sm:px-8 w-auto space-y-4 text-[#0a0908] bg-black/20 text-white rounded-xl p-6 mt-12 ">
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

        {/* Contact Section */}
        <section className=" py-16 px-4 sm:px-8 -mt-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#001d3d] mb-12">
            Get in Touch
          </h2>
          <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto ">
            {/* Contact Info */}
            <div className="bg-white shadow-lg hover:shadow-2xl p-8 rounded-2xl transition flex flex-col justify-center max-w-md">
              <h3 className="text-2xl font-medium text-gray-800 mb-6">
                Contact Information
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  📧 Email:{" "}
                  <a
                    href="mailto:aaiconferences@gmail.com"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    aaiconferences@gmail.com
                  </a>
                </li>
                <li>📍 Location: Central University of Kashmir, India</li>
              </ul>

              {/* Clickable map that redirects to Google Maps */}
              <div className="mt-8">
                <a
                  href="https://maps.app.goo.gl/36i9dDJWYn9n3nRS7"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Central University of Kashmir on Google Maps"
                  className="block"
                >

                  <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.680615552739!2d74.72459227572418!3d34.23117257309002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e19d996de5015d%3A0x5cdc403498de0f0e!2sCentral%20University%20of%20Kashmir!5e0!3m2!1sen!2sin!4v1758301985418!5m2!1sen!2sin"
                    width="100%"
                    height="250"
                    allowFullScreen=""
                    loading="lazy"
                    className="rounded-xl border pointer-events-none"
                  ></iframe>
                </a>
              </div>
            </div>

            {/* this feedback form can be enabled after using backend because it doesn't work without backend  */}

            {/* Feedback Form
            <div className="bg-white shadow-lg hover:shadow-2xl p-8 rounded-2xl transition">
              <h3 className="text-2xl font-medium text-gray-800 mb-6">
                Send Us Your Feedback
              </h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="Your Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <textarea
                  name="feedback"
                  placeholder="Your Feedback"
                  rows="4"
                  value={formData.feedback}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:shadow-md transition font-medium"
                >
                  ✉️ Send Feedback
                </button>
              </form>
            </div> */}

            {/*this feedback form should be disabled after using backend */}
            <div className="bg-white shadow-lg hover:shadow-2xl p-8 rounded-2xl transition">
              <h3 className="text-2xl font-medium text-gray-800 mb-6">
                Send Us Your Feedback
              </h3>
              <form
                action="https://formspree.io/f/yourFormID"
                method="POST"
                className="space-y-5"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <textarea
                  name="feedback"
                  placeholder="Your Feedback"
                  rows="4"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:shadow-md transition font-medium"
                >
                  ✉️ Send Feedback
                </button>
              </form>
            </div>

          </div>
        </section>
      </section>
    </>
  );
}

export default Contact;
