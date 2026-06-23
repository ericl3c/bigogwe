import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import "../css/style.css"
import waitImage from "../image/image2.jpeg";
import logo from "../image/logo.jpeg";

function Home() {
  return (
    <div>

      <Navbar />

      {/* HERO SECTION */}
      <section className="home-hero">

        <div className="overlay"></div>

        <div className="hero-content">
          <span className="eyebrow">Authentic Eco-Cultural Tourism</span>

          <h1>Home</h1>

          <p>
            Explore Rwanda’s beautiful nature, culture,
            mountains, traditional games, camping,
            storytelling, and unforgettable adventures.
          </p>

          <div className="hero-buttons">
            <Link to="/booking" className="btn btn-green">Book Now</Link>
            <Link to="/services" className="btn btn-white">Explore Services</Link>
          </div>

        </div>

      </section>

      {/* SERVICES */}
      <section className="services-section">

        <h2>Our Main Activities</h2>

        <div className="services-cards">

          <div className="service-card">
            <h3>⛰️ Hiking</h3>

            <p>
              Explore mountains and enjoy beautiful
              natural landscapes.
            </p>
          </div>

          <div className="service-card">
            <h3>🌳 Nature Walk</h3>

            <p>
              Experience peaceful environmental walks
              and conservation activities.
            </p>
          </div>

          <div className="service-card">
            <h3>⛺ Camping</h3>

            <p>
              Enjoy outdoor adventures and campfire
              nights with friends and family.
            </p>
          </div>

          <div className="service-card">
            <h3>📷 Photo Shoot</h3>

            <p>
              Capture unforgettable memories in
              beautiful scenery.
            </p>
          </div>

        </div>

      </section>

      {/* ABOUT PREVIEW */}
      <section className="home-about">

        <div className="home-about-image">

          <img
            src={waitImage}
            alt="Visitors waiting at eco-tourism site"
          />

        </div>

        <div className="home-about-text">

          <h2>Discover Rwanda’s Culture & Nature</h2>

          <p>
            Bigogwe Eco-Cultural Tourism offers authentic
            experiences that combine eco-tourism,
            traditional culture, and community life.
          </p>

          <p>
            Visitors enjoy storytelling, traditional meals,
            hiking, cultural games, and nature exploration.
          </p>

          <button className="btn-green">
            Learn More
          </button>

        </div>

      </section>

      {/* GALLERY */}
      <section className="gallery-section">

  

        <div className="gallery-grid">

    


        

         

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial-section">

        <h2>What Visitors Say</h2>

        <div className="testimonial-cards">

          <div className="testimonial-card">
            <p>
              “Amazing cultural experience and beautiful
              mountains.”
            </p>

            <h4>- Tourist</h4>
          </div>

          <div className="testimonial-card">
            <p>
              “The best eco-tourism destination in Rwanda.”
            </p>

            <h4>- Visitor</h4>
          </div>

          <div className="testimonial-card">
            <p>
              “Very friendly people and unforgettable
              activities.”
            </p>

            <h4>- Traveler</h4>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        <img src={logo} alt="Bigogwe logo" className="footer-logo" />
        <h2>Bigogwe Eco-Cultural Tourism</h2>

        <p>UMUCO NTUGACIKE</p>

        <p>
          © 2026 Bigogwe Eco-Cultural Tourism Company
        </p>

      </footer>

    </div>
  );
}

export default Home;