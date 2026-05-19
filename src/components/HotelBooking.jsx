import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

function HotelBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    // Step 2: Booking Details
    checkInDate: "",
    checkOutDate: "",
    numberOfRooms: 1,
    numberOfGuests: 1,
    mealPlan: "ep",
    specialRequests: "",
    // Step 3: Payment
    transactionId: "",
    paymentProof: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const mealPlans = [
    { id: "ep", name: "Room Only (EP)", price: "₹4,500/-" },
    { id: "cp", name: "With Breakfast (CP)", price: "₹6,000/-" },
    { id: "map", name: "With Breakfast + Lunch/Dinner (MAP)", price: "₹8,550/-" },
    { id: "ap", name: "With Breakfast + Lunch + Dinner (AP)", price: "₹9,950/-" },
  ];

  const mealPrices = {
    ep: 4500,
    cp: 6000,
    map: 8550,
    ap: 9950,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      paymentProof: file,
    }));
  };

  const validateStep1 = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.country.trim() &&
      formData.city.trim()
    );
  };

  const validateStep2 = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    // Check-in date cannot be before today
    if (checkIn < today) {
      alert("Check-in date cannot be before today");
      return false;
    }
    
    // Check-out date must be after check-in date
    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date");
      return false;
    }
    
    if (Number(formData.numberOfRooms) <= 0 || Number(formData.numberOfGuests) <= 0) {
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    return formData.transactionId.trim() && formData.paymentProof;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      alert("Please fill all required fields in Step 1: First Name, Last Name, Email, Phone, Country, and City");
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      alert("Please fill all required fields in Step 2: Check-in Date, Check-out Date, Number of Rooms, and Number of Guests");
      return;
    }
    if (currentStep === 3) {
      // On step 3, don't advance, just submit
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) {
      alert("Please fill all required fields in Step 3");
      return;
    }
    
    // Save to database
    saveBookingToDatabase();
  };

  const saveBookingToDatabase = async () => {
    try {
      const bookingId = `HB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const totalAmount = mealPrices[formData.mealPlan] * formData.numberOfRooms;
      
      // Initialize Supabase client
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      let paymentProofPath = null;

      // Upload payment proof file if provided
      if (formData.paymentProof) {
        const fileName = `${bookingId}-${formData.paymentProof.name}`;
        const { data, error } = await supabase.storage
          .from("hotel-bookings")
          .upload(`payment-proofs/${fileName}`, formData.paymentProof);

        if (error) {
          console.error("File upload error:", error);
          throw new Error("Failed to upload payment proof");
        }

        paymentProofPath = data.path;
        console.log("File uploaded successfully:", paymentProofPath);
      }

      const bookingData = {
        booking_id: bookingId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        check_in_date: formData.checkInDate,
        check_out_date: formData.checkOutDate,
        number_of_rooms: Number(formData.numberOfRooms),
        number_of_guests: Number(formData.numberOfGuests),
        meal_plan: formData.mealPlan,
        meal_plan_price: mealPrices[formData.mealPlan],
        total_amount: totalAmount,
        special_requests: formData.specialRequests || null,
        transaction_id: formData.transactionId,
        payment_proof_path: paymentProofPath,
        booking_status: 'pending'
      };

      console.log("Saving booking data:", bookingData);

      // Send to Supabase Edge Function with authorization
      const response = await fetch(`${supabaseUrl}/functions/v1/hotel-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save booking');
      }

      const result = await response.json();
      console.log("Booking saved successfully:", result);
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          checkInDate: "",
          checkOutDate: "",
          numberOfRooms: 1,
          numberOfGuests: 1,
          mealPlan: "ep",
          specialRequests: "",
          transactionId: "",
          paymentProof: null,
        });
        setCurrentStep(1);
      }, 3000);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Error saving booking: " + error.message);
    }
  };

  const totalAmount = mealPrices[formData.mealPlan] * formData.numberOfRooms;

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6AD2] dark:text-[#c9a86a] hover:underline mb-4"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-zinc-950 dark:text-zinc-100 mb-2">
            Hotel Booking
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Book your accommodation at CH2 Hotel for 2AI-2026
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center font-bold rounded-full border-2 
                  ${
                    currentStep === step
                      ? "bg-[#5E6AD2] dark:bg-[#c9a86a] text-white dark:text-zinc-950 border-[#5E6AD2] dark:border-[#c9a86a]"
                      : currentStep > step
                      ? "bg-[#16a34a] text-white border-[#16a34a]"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border-gray-200 dark:border-zinc-700"
                  } transition-all duration-300 shadow-sm`}
              >
                {currentStep > step ? "✓" : step}
              </div>
              {index < 2 && (
                <div
                  className={`w-12 md:w-20 h-1 
                    ${currentStep > step ? "bg-[#16a34a]" : "bg-gray-200 dark:bg-zinc-700"}
                    transition-colors duration-300`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="linear-card p-6 md:p-8">
          {submitted ? (
            <div className="rounded-lg bg-white dark:bg-emerald-900/20 border-2 border-emerald-500 dark:border-emerald-600 p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                Booking Confirmed!
              </p>
              <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Your hotel booking has been successfully submitted. Our team will review your payment and confirm your reservation within 24 hours. A confirmation email will be sent to <span className="font-semibold text-zinc-900 dark:text-white">{formData.email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 min-h-[400px]">
              {/* STEP 1: Personal Information */}
              {currentStep === 1 && (
                <div className="animate-fadeInDown">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2 mb-6">
                    Step 1: Personal Information
                  </h3>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                          placeholder="+91-XXXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                          placeholder="India"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                          placeholder="Srinagar"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Booking Details */}
              {currentStep === 2 && (
                <div className="animate-fadeInDown">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2 mb-6">
                    Step 2: Booking Details & Meal Plan
                  </h3>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Check-in Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="checkInDate"
                          value={formData.checkInDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Check-out Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="checkOutDate"
                          value={formData.checkOutDate}
                          onChange={handleChange}
                          min={formData.checkInDate ? new Date(new Date(formData.checkInDate).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Number of Rooms <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="numberOfRooms"
                          value={formData.numberOfRooms}
                          onChange={handleChange}
                          min="1"
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                          Number of Guests <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="numberOfGuests"
                          value={formData.numberOfGuests}
                          onChange={handleChange}
                          min="1"
                          className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-3">
                        Meal Plan <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        {mealPlans.map((plan) => (
                          <label
                            key={plan.id}
                            className="flex items-center space-x-2 text-sm text-zinc-800 dark:text-zinc-300 cursor-pointer bg-white dark:bg-white/5 p-3 border border-gray-200 dark:border-zinc-700 rounded shadow-sm hover:border-[#5E6AD2] dark:hover:border-[#c9a86a] hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors"
                          >
                            <input
                              type="radio"
                              name="mealPlan"
                              value={plan.id}
                              checked={formData.mealPlan === plan.id}
                              onChange={handleChange}
                              className="text-[#5E6AD2] dark:text-[#c9a86a] focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] h-4 w-4"
                            />
                            <span className="font-medium flex-1">{plan.name}</span>
                            <span className="font-bold text-[#5E6AD2] dark:text-[#c9a86a]">
                              {plan.price}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {currentStep === 3 && (
                <div className="animate-fadeInDown">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2 mb-6">
                    Step 3: Payment
                  </h3>

                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-gradient-to-r from-[#5E6AD2]/10 to-[#5E6AD2]/5 dark:bg-blue-900/20 border border-[#5E6AD2]/30 dark:border-blue-800 rounded p-4">
                      <h4 className="font-semibold text-[#5E6AD2] dark:text-blue-100 mb-3">
                        Booking Summary
                      </h4>
                      <div className="space-y-2 text-sm text-zinc-900 dark:text-blue-200">
                        <div className="flex justify-between">
                          <span>Guest Name:</span>
                          <span className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span className="font-medium">{formData.checkInDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span className="font-medium">{formData.checkOutDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rooms:</span>
                          <span className="font-medium">{formData.numberOfRooms}</span>
                        </div>
                        <div className="flex justify-between border-t border-[#5E6AD2]/20 dark:border-blue-700 pt-2 mt-2">
                          <span className="font-bold">Total Amount:</span>
                          <span className="font-bold text-lg text-[#5E6AD2] dark:text-[#c9a86a]">₹{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-zinc-700 rounded p-6 text-center">
                      <h4 className="font-semibold text-zinc-950 dark:text-zinc-100 mb-4">
                        Scan to Pay
                      </h4>
                      <img
                        src="/ch2jkbankqr.jpeg"
                        alt="Payment QR Code"
                        className="w-48 h-48 mx-auto rounded border border-gray-300 dark:border-zinc-700"
                      />
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
                        Please add the amount: <span className="font-bold text-lg">₹{totalAmount.toLocaleString()}</span>
                      </p>
                    </div>

                    {/* Payment Details */}
                    <div>
                      <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                        Transaction ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                        placeholder="Enter your transaction ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                        Payment Proof (Screenshot/Receipt) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded p-3 focus:ring-2 focus:ring-[#5E6AD2] dark:focus:ring-[#c9a86a] focus:border-[#5E6AD2] dark:focus:border-[#c9a86a] outline-none transition-shadow"
                      />
                      {formData.paymentProof && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          ✓ File selected: {formData.paymentProof.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-zinc-700">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                  >
                    ← Previous
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 rounded-lg bg-[#5E6AD2] dark:bg-[#c9a86a] text-white dark:text-zinc-950 font-medium hover:opacity-90 transition"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#5E6AD2] dark:bg-[#c9a86a] text-white dark:text-zinc-950 font-medium hover:opacity-90 transition"
                  >
                    Submit Booking
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default HotelBooking;
