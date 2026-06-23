import Navbar from "../component/Navbar";
import "../App.css";
import "../css/style.css";
import {
  Mountain,
  Tent,
  Utensils,
  BookOpen,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: <Mountain size={40} />,
    title: "Hiking Adventures",
    description: "Guided trails through lush forests and scenic landscapes for every experience level.",
  },
  {
    icon: <Tent size={40} />,
    title: "Eco Camping",
    description: "Overnight stays in nature with sustainable tents, campfires, and starry sky views.",
  },
  {
    icon: <Utensils size={40} />,
    title: "Traditional Meals",
    description: "Authentic local dishes prepared with fresh ingredients and served in a warm cultural setting.",
  },
  {
    icon: <BookOpen size={40} />,
    title: "Storytelling Sessions",
    description: "Share the history and legends of Rwanda through engaging local storytelling evenings.",
  },
  {
    icon: <MessageCircle size={40} />,
    title: "Cultural Activities",
    description: "Enjoy cultural games, local music, and immersive community experiences.",
  },
  {
    icon: <Sparkles size={40} />,
    title: "Cow Experience",
    description: "Hands-on visits to local farms to learn about traditional cattle care and rural life.",
  },
];

function Services() {
  return (
    <div>
      <Navbar />

      <section className="services-section">
        <div className="section-intro services-intro">
          <span className="section-label">Our Services</span>
          <h1>Discover Our Eco-Cultural Experiences</h1>
          <p>
            Explore hiking, camping, traditional meals, storytelling, cultural activities, and authentic local experiences designed to immerse you in Rwanda’s rich nature and heritage.
          </p>
        </div>

        <div className="services-cards">
          {services.map((service) => (
            <div key={service.title} className="service-card service-card-icon-only">
              <div className="service-card-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;
