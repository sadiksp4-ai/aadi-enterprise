import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/clients", label: "Clients" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close the mobile menu on route change and lock body scroll while open.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className={`navbar${isScrolled ? " scrolled" : ""}`}>
      <Link to="/" className="navbar-logo-link" onClick={closeMenu} aria-label="Aadi Enterprises — home">
        <span className="navbar-logo">Aadi Enterprises</span>
      </Link>
      <div className={`navbar-links${isMenuOpen ? " active" : ""}`} id="primary-navigation">
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={closeMenu}
            className={location.pathname === to ? "active" : ""}
            aria-current={location.pathname === to ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </div>
      <button
        type="button"
        className={`hamburger${isMenuOpen ? " open" : ""}`}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </nav>
  );
};

export default Navbar;
