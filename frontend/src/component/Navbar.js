import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/nav.css"
import logo from "../image/logo.jpeg";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const pageTitleFromPath = (p) => {
    if (p === "/" || p === "") return "Home";
    if (p.startsWith("/about")) return "About";
    if (p.startsWith("/services")) return "Services";
    if (p.startsWith("/booking")) return "Booking";
    if (p.startsWith("/gallery")) return "Gallery";
    if (p.startsWith("/contact")) return "Contact";
    return "";
  };
  const currentTitle = pageTitleFromPath(location.pathname);

  useEffect(() => {
    const base = '# Bigogwe Eco-Cultural';
    if (currentTitle) {
      document.title = `${currentTitle} - ${base}`;
    } else {
      document.title = base;
    }
  }, [currentTitle]);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">

      <h1 className="logo">
        <img src={logo} alt="Bigogwe logo" className="nav-logo" />
        <span>{currentTitle || '# Bigogwe Eco-Cultural'}</span>
      </h1>

      <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="hamburger" />
      </button>

      <ul data-open={open}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>

        <li><Link to="/about" onClick={closeMenu}>About</Link></li>

        <li><Link to="/services" onClick={closeMenu}>Services</Link></li>

        <li><Link to="/booking" onClick={closeMenu}>Booking</Link></li>

         <li><Link to="/gallery" onClick={closeMenu}>Gallery</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
      </ul>

    </nav>
  );
}

export default Navbar;