import React, { useState } from "react";
import Navbar from "../component/Navbar";
import "../css/contact.css";
import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { apiUrl } from "../utils/adminApi";

const initialForm = {
  fullname: "",
  email_address: "",
  phone_number: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "phone_number" ? value.replace(/[^\d+ ]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");

    if (!formData.fullname.trim()) {
      setNoticeType("error");
      setNotice("Full name is required.");
      return;
    }

    if (!formData.email_address.trim()) {
      setNoticeType("error");
      setNotice("Email address is required.");
      return;
    }

    if (!formData.subject) {
      setNoticeType("error");
      setNotice("Please choose a subject.");
      return;
    }

    if (!formData.message.trim()) {
      setNoticeType("error");
      setNotice("Please write your message.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/contacts"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not send your message.");
      }

      setNoticeType("success");
      setNotice("Thank you. Your message has been sent successfully.");
      setFormData(initialForm);
    } catch (error) {
      setNoticeType("error");
      setNotice(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />

      <section className="contact-hero">
        <div className="contact-hero-content">
          <span>Contact Us</span>
          <h1>Plan your Bigogwe visit with our team</h1>
          <p>
            Have a question about booking, activities, prices, group visits, or
            directions? Send us a message and we will help you prepare a smooth
            eco-cultural experience.
          </p>
        </div>
      </section>

      <main className="contact-main">
        <aside className="contact-info">
          <h2>Reach Bigogwe Eco-Cultural Tourism</h2>
          <p>
            We are ready to help visitors, schools, families, and tour groups
            choose the right activities and visiting time.
          </p>

          <div className="contact-list">
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={22} />
              </div>
              <div>
                <h3>Phone</h3>
                <a href="tel:+250788969258">0788969258</a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={22} />
              </div>
              <div>
                <h3>Email</h3>
                <a href="mailto:bigogweecoculturaltourism@gmail.com">
                  bigogweecoculturaltourism@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <MapPin size={22} />
              </div>
              <div>
                <h3>Location</h3>
                <p>Bigogwe, Nyabihu District, Rwanda</p>
              </div>
            </div>
          </div>

          <div className="contact-hours">
            <h3><Clock size={18} /> Visiting Support</h3>
            <p>Monday to Saturday: 8:00 AM - 6:00 PM</p>
            <p>Sunday: Available for booked experiences</p>
          </div>
        </aside>

        <section className="contact-form-panel">
          <h2>Send a Message</h2>
          <p>
            Tell us what you need and include your preferred date if you already
            have one in mind.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="fullname">Full Name</label>
              <div className="contact-input">
                <User size={20} />
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="email_address">Email Address</label>
              <div className="contact-input">
                <Mail size={20} />
                <input
                  id="email_address"
                  name="email_address"
                  type="email"
                  value={formData.email_address}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="phone_number">Phone Number</label>
              <div className="contact-input">
                <Phone size={20} />
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="078..."
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="subject">Subject</label>
              <div className="contact-input">
                <MessageSquare size={20} />
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a subject</option>
                  <option value="Booking question">Booking question</option>
                  <option value="Group visit">Group visit</option>
                  <option value="Activities and prices">Activities and prices</option>
                  <option value="Directions">Directions</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <div className="contact-textarea">
                <MessageSquare size={20} />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here"
                  required
                />
              </div>
            </div>

            {notice && (
              <div className={`contact-alert ${noticeType}`}>
                {notice}
              </div>
            )}

            <button className="contact-submit" type="submit" disabled={loading}>
              <Send size={20} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>

      <section className="contact-map">
        <div>
          <h2>Find us in Bigogwe</h2>
          <p>
            Bigogwe is known for green hills, cattle culture, hiking routes, and
            community-led experiences. Contact us before traveling so our team
            can guide your arrival.
          </p>
          <a
            className="contact-map-link"
            href="https://www.google.com/maps/search/?api=1&query=Bigogwe%20Rwanda"
            target="_blank"
            rel="noreferrer"
          >
            Open Map
          </a>
        </div>
        <div className="map-preview" aria-label="Bigogwe landscape preview" />
      </section>

      <footer className="contact-footer">
        <h2>Bigogwe Eco-Cultural Tourism</h2>
        <p>UMUCO NTUGACIKE</p>
        <p>Copyright 2026 Bigogwe Eco-Cultural Tourism Company</p>
      </footer>
    </div>
  );
}

export default Contact;
