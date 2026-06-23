import Navbar from "../component/Navbar";
import "../App.css";
import "../css/about.css";
import heroImage from "../image/background.jpeg";
import developerImage from "../image/image1.jpeg";
import teamImage from "../image/ceo.jpeg";
import tourGuideImage from "../image/Tour_Guide.jpeg";
import culturalTrainerImage from "../image/caltural_trean.jpeg";

function About() {
  return (
    <div>

      <Navbar />

      {/* HERO */}
      <section className="about-hero">

        <div className="overlay"></div>

        <div className="about-content">

          <h1>About</h1>

          <p>
            Discover Rwanda’s culture, nature, traditions,
            and unforgettable eco-tourism experiences.
          </p>

        </div>

      </section>

      {/* COMPANY STORY */}
      <section className="about-section">

        <div className="container">

          <div className="about-text">

            <h2>Who We Are</h2>

            <p>
              Bigogwe Eco-Cultural Tourism Company is a tourism
              organization dedicated to promoting Rwanda’s
              natural beauty, traditional culture, and
              community tourism experiences.
            </p>

            <p>
              We provide activities like hiking, camping,
              storytelling, traditional games, cultural meals,
              cow experience, and natural walks.
            </p>

          </div>

          <div className="about-image">

            <img
              src={heroImage}
              alt="Rwanda nature"
            />

          </div>

        </div>

      </section>

      {/* MISSION */}
      <section className="mission-section">

        <div className="mission-card">

          <h2>Our Mission</h2>

          <p>
            To promote sustainable tourism while preserving
            Rwandan culture and supporting local communities.
          </p>

        </div>

        <div className="mission-card">

          <h2>Our Vision</h2>

          <p>
            To become the leading eco-cultural tourism
            destination in Rwanda and East Africa.
          </p>

        </div>

      </section>

      {/* DEVELOPMENT */}
     
      {/* TEAM */}
      <section className="team-section">

        <h2>Our Team</h2>

        <div className="team-cards">

          <div className="team-card">
            <img
              src={teamImage}
              alt="CEO"
            />
            <h3>CEO : BUTERA didier</h3>
            
            <p>Company Director
              Butera Didier is the Founder and Chief Executive Officer (CEO) of Bigogwe Eco-Cultural Tourism Company. He is a passionate tourism and hospitality professional with a strong commitment to promoting Rwanda’s natural beauty, cultural heritage, and sustainable tourism development.

As the CEO of Bigogwe Eco-Cultural Tourism Company, Butera Didier has gained valuable experience in tourism operations, customer service, tour planning, cultural tourism, community engagement, and eco-tourism management. He works closely with local communities to create authentic tourism experiences that benefit both visitors and residents while preserving cultural traditions and environmental resources.

Currently pursuing studies in Hospitality Management, he combines academic knowledge with practical industry experience to provide high-quality tourism services. His vision is to position Bigogwe Eco-Cultural Tourism Company as a leading provider of eco-cultural tourism experiences in Rwanda and beyond.

Contact Information

* CEO & Founder: Butera Didier 
* Phone: +250 788 969 258

“Connecting visitors with Rwanda’s culture, nature, and communities through sustainable tourism experiences.”
            </p>
          </div>

          <div className="team-card">
            <img
              src={tourGuideImage}
              alt=""
            />
            <h3>Tour Guide</h3>
            <p>Eco Tourism Expert</p>
          </div>

          <div className="team-card">
            <img
              src={culturalTrainerImage}
              alt=""
            />
            <h3>Cultural Trainer</h3>
            <p>Traditional Activities</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default About;