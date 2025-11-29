import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "/logo.png";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src={logo} alt="AADI ENTERPRISES" />
          <span>AADI ENTERPRISES</span>
        </div>
      </Link>
      <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <Link
          to="/about"
          onClick={closeMenu}
          className={location.pathname === "/about" ? "active" : ""}
        >
          About
        </Link>
        <Link
          to="/products"
          onClick={closeMenu}
          className={location.pathname === "/products" ? "active" : ""}
        >
          Products
        </Link>
        {/* Brands link removed as it's merged with Products */}
        <Link
          to="/clients"
          onClick={closeMenu}
          className={location.pathname === "/clients" ? "active" : ""}
        >
          Clients
        </Link>
        <Link
          to="/partners"
          onClick={closeMenu}
          className={location.pathname === "/partners" ? "active" : ""}
        >
          Partners
        </Link>
        <Link
          to="/contact"
          onClick={closeMenu}
          className={location.pathname === "/contact" ? "active" : ""}
        >
          Contact
        </Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
