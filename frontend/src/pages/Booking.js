import "../css/booking.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import { apiUrl } from "../utils/adminApi";
import {
  Calendar,
  User,
  Phone,
  Mail,
  Tent,
  Mountain,
  Utensils,
  Trees,
} from "lucide-react";

const getTodayInputValue = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export default function BookingPage() {
  const [formData, setFormData] = useState({
    fullname: "",
    email_address: "",
    phone_number: "",
    visitor_category: "",
    select_activities: "",
    booking_date: ""
  });
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const prices = {
    child: 15000,
    rwandan: 30000,
    eastAfrican: 35000,
    international: 40000,
  };

  const calculateTotal = () => {
    if (!formData.visitor_category) return 0;
    return prices[formData.visitor_category] * Number(people || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === "phone_number" ? value.replace(/\D/g, "") : value;
    setFormData(prev => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!formData.fullname.trim()) {
      setMessageType("error");
      setMessage("Full name is required");
      return;
    }
    if (!formData.email_address.trim()) {
      setMessageType("error");
      setMessage("Email is required");
      return;
    }
    if (!formData.phone_number.trim()) {
      setMessageType("error");
      setMessage("Phone number is required");
      return;
    }
    if (!formData.visitor_category) {
      setMessageType("error");
      setMessage("Please select a visitor category");
      return;
    }
    if (!formData.select_activities) {
      setMessageType("error");
      setMessage("Please select an activity");
      return;
    }
    if (!formData.booking_date) {
      setMessageType("error");
      setMessage("Please select a booking date");
      return;
    }
    if (formData.booking_date < getTodayInputValue()) {
      setMessageType("error");
      setMessage("Please select today or a future booking date");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/bookings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          booking_date: formData.booking_date,
          number_of_visitors: Number(people || 1),
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(data.error || "Booking failed");
        return;
      }

      setMessageType("success");
      setMessage("Booking submitted successfully! Total: " + calculateTotal().toLocaleString() + " RWF");
      
      // Clear form
      setFormData({
        fullname: "",
        email_address: "",
        phone_number: "",
        visitor_category: "",
        select_activities: "",
        booking_date: ""
      });
      setPeople(1);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessageType("error");
      setMessage("Error submitting booking: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bigogwe Eco-Cultural Tourism</h1>
          <p>
            Book your unforgettable eco-cultural adventure in Rwanda today.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link
              to="/"
              style={{
                color: "#ffffff",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section className="booking-wrapper">

        {/* LEFT SIDE */}
        <div className="left-content">
          <h2 className="text-4xl font-bold text-green-700 mb-6">
            Book Your Experience
          </h2>

          <p className="text-gray-600 mb-8 leading-7">
            Enjoy hiking, camping, storytelling, traditional meals,
            cow experiences, and cultural games with Bigogwe Eco-Cultural
            Tourism.
          </p>

          {/* SERVICES */}
          <div className="services-grid">
            <div className="service-card">
              <Mountain size={35} />
              <h3>Hiking</h3>
            </div>


            <div className="service-card">
              <Tent size={35} />
              <h3>Camping</h3>
            </div>

            <div className="service-card">
              <Utensils size={35} />
              <h3>Traditional Meals</h3>
            </div>

            <div className="service-card">
              <Trees size={35} />
              <h3>Cultural Activities</h3>
            </div>
          </div>

            {/* PRICE TABLE */}
          <div className="price-box">
            <h3>Booking Prices</h3>

            <div>
              <div className="flex justify-between border-b pb-2">
                <span>Children</span>
                <span>15,000 RWF</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Rwandans</span>
                <span>250 ,000 RWF</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>East African Visitors</span>
                <span>30,000 RWF</span>
              </div>

              <div className="flex justify-between">
                <span>International Visitors</span>
                <span>35 000 RWF</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING FORM */}
        <div className="booking-form">
          <h2>Reservation Form</h2>

       

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* NAME */}
            <div>
              <label className="block mb-2 font-semibold">
                Full Name
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <User className="text-green-700 mr-3" />
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-semibold">
                Email Address
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <Mail className="text-green-700 mr-3" />
                <input
                  type="email"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="block mb-2 font-semibold">
                Phone Number
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <Phone className="text-green-700 mr-3" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="078..."
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block mb-2 font-semibold">
                Visitor Category
              </label>

              <select
                name="visitor_category"
                value={formData.visitor_category}
                onChange={handleInputChange}
                className="w-full border rounded-xl px-4 py-3 outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="child">Child</option>
                <option value="rwandan">Rwandan</option>
                <option value="eastAfrican">
                  East African Visitor
                </option>
                <option value="international">
                  International Visitor
                </option>
              </select>
            </div>

            {/* ACTIVITIES */}
            <div>
              <label className="block mb-2 font-semibold">
                Select Activities
              </label>

              <select 
                name="select_activities"
                value={formData.select_activities}
                onChange={handleInputChange}
                className="w-full border rounded-xl px-4 py-3 outline-none"
                required
              >
                <option value="">Select an activity</option>
                <option value="Hiking">Hiking</option>
                <option value="Camping">Camping</option>
                <option value="Traditional Meals">Traditional Meals</option>
                <option value="Storytelling">Storytelling</option>
                <option value="Cow Experience">Cow Experience</option>
                <option value="Cultural Games">Cultural Games</option>
                <option value="All Activities">All Activities</option>
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="block mb-2 font-semibold">
                Booking Date
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <Calendar className="text-green-700 mr-3" />
                <input
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleInputChange}
                  min={getTodayInputValue()}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* PEOPLE */}
            <div>
              <label className="block mb-2 font-semibold">
                Number of Visitors
              </label>

              <input
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(e.target.value.replace(/\D/g, ""))}
                className="w-full border rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* TOTAL */}
            <div className="total-box">
              <h3 className="text-xl font-bold text-green-700">
                Total Price: {calculateTotal().toLocaleString()} RWF
              </h3>
              <p className="text-sm text-gray-600 mt-1">Includes basic entry and activity fees.</p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-gray-500" : "bg-green-700 hover:bg-green-800"} text-white py-4 rounded-2xl text-lg font-semibold transition duration-300`}
            >
              {loading ? "Submitting..." : "Book Now"}
            </button>
          </form>
             {message && (
            <div className={`p-4 rounded-lg mb-4 ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-2xl font-bold mb-4">
              Bigogwe Eco-Cultural Tourism
            </h3>

            <p className="text-gray-300">
              Discover Rwanda’s beauty, culture, and unforgettable
              tourism experiences.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">
              Contact
            </h3>

            <p>Email: Bigogweecoculturaltourismgmail.com</p>
            <p>Phone: 0788969258</p>
            <p>Location: Bigogwe, Rwanda</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">
              Follow Us
            </h3>

            <p>Facebook</p>
            <p>Instagram</p>
            <p>Twitter</p>
          </div>
        </div>

        <div className="text-center text-gray-400 mt-10">
          © 2026 Bigogwe Eco-Cultural Tourism. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
