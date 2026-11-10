import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { getAssetUrl } from "../../utils";
import { EnquiryDrawer } from "../EnquiryDrawer";
import { MorphingButton } from "../ui/morphing-button";
import { DirectionalTooltip } from "../ui/directional-tooltip";

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
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
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
    <nav
      className={`navbar fixed top-0 left-0 z-[1000] flex w-full items-center justify-between border-b border-white/10 bg-[#080808]/90 text-white backdrop-blur-md transition-all duration-300 ${
        isScrolled
          ? "bg-[#080808]/95 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          : "py-4"
      }`}
    >
      <Link to="/" className="navbar-logo-link" onClick={closeMenu} aria-label="Aadi Enterprises — home">
        <img
          src={getAssetUrl("logo.png")}
          alt=""
          className="navbar-logo-img"
          width={44}
          height={40}
          decoding="async"
        />
        <span className="navbar-logo-text">
          <span className="navbar-logo-name text-white">Aadi Enterprises</span>
          <span className="navbar-logo-tag">Hospitality Solutions</span>
        </span>
      </Link>
      <div className={`navbar-links${isMenuOpen ? " active" : ""}`} id="primary-navigation">
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={closeMenu}
            className={`text-zinc-300 hover:text-teal-400 font-medium transition-colors ${
              location.pathname === to ? "active text-white" : ""
            }`}
            aria-current={location.pathname === to ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        <MorphingButton
          idleText="Request a Quote"
          variant="primary"
          className="navbar-cta text-xs sm:text-sm"
          onClick={() => setIsQuoteOpen(true)}
        />
      </div>
      <DirectionalTooltip content={isMenuOpen ? "Close menu" : "Open menu"} side="bottom" delayDuration={200}>
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
      </DirectionalTooltip>

      <EnquiryDrawer open={isQuoteOpen} onOpenChange={setIsQuoteOpen} />
    </nav>
  );
};

export default Navbar;
