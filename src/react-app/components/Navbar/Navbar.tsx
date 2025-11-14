import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "/logo.png";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
      <a href="#home" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src={logo} alt="AADI ENTERPRISE" />
          <span>AADI ENTERPRISE</span>
        </div>
      </a>
      <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <a href="#about" onClick={toggleMenu}>
          About
        </a>
        <a href="#products" onClick={toggleMenu}>
          Products
        </a>
        <a href="#brands" onClick={toggleMenu}>
          Brands
        </a>
        <a href="#clients" onClick={toggleMenu}>
          Clients
        </a>
        <a href="#contact" onClick={toggleMenu}>
          Contact
        </a>
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
