import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import "../App.css";
import "../css/style.css";
import backgroundImage from "../image/background.jpeg";
import { apiUrl, assetUrl } from "../utils/adminApi";


function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch(apiUrl("/gallery"));
        if (!response.ok) {
          throw new Error("Unable to load gallery images.");
        }

        const data = await response.json();
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.description ? item.description.slice(0, 40) : "Gallery Image",
          description: item.description || "Explore our eco-cultural experiences.",
          src: assetUrl(item.image),
        }));

        setGalleryItems(formatted);
      } catch (err) {
        console.error(err);
        setError(err.message || "Gallery fetch failed.");
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  return (
    <div>
      <Navbar />

      <section className="gallery-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(6,70,32,0.84), rgba(8,50,24,0.72)), url(${backgroundImage})` }}>
        <div className="hero-content gallery-hero-content">
          <p className="eyebrow">Gallery</p>
          <h1>Gallery</h1>
          <p>
            Discover the people, places, and experiences that make our eco-cultural tourism special. Each image tells a story of nature, culture, and hospitality.
          </p>
        </div>
      </section>

      <section className="gallery-page-section">
        <div className="section-header">
          <p className="subtitle">Memories from our guests</p>
          <h2>Beautiful moments from Bigogwe</h2>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#155a2f" }}>Loading gallery...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "#bb2b2b" }}>{error}</p>
        ) : galleryItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#155a2f" }}>No gallery images are available yet.</p>
        ) : (
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <article key={item.id} className="gallery-card">
                <img src={item.src} alt={item.title} />
                <div className="gallery-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Gallery;
