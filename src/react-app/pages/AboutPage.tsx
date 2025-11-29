import React from "react";
import {
    Target,
    Eye,
    Map,
    Globe,
    ShieldCheck,
    Award,
    Users,
    Layers,
    HeartHandshake,
    Briefcase,
    ArrowRight,
    Download
} from "lucide-react";
import { Link } from "react-router-dom";
import "./AboutPage.css";
import { getAssetUrl } from "../utils";

const AboutPage: React.FC = () => {
    return (
        <div className="about-page">
            {/* 1. Hero Section */}
            <section className="about-hero">
                <div className="about-hero-background">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                        alt="Abstract Architectural Glass and Steel"
                        className="about-hero-image"
                    />
                    <div className="about-hero-overlay"></div>
                </div>

                <div className="about-hero-content">
                    <h1 className="about-hero-title">
                        More Than a Supplier. <br />
                        <span className="about-hero-accent">A Business Associate.</span>
                    </h1>
                    <div className="about-hero-divider"></div>
                    <p className="about-hero-subtitle">
                        Bridging the gap between global innovation and Indian hospitality. We specialize in high-quality, stylish, and functional equipment that defines luxury.
                    </p>
                </div>
            </section>

            {/* 2. The Narrative (Who We Are) - Split Screen */}
            <section className="about-narrative">
                <div className="about-container">
                    <div className="about-split">
                        {/* Left: Text */}
                        <div className="about-split-text">
                            <h2 className="section-title">
                                We Engineer <span className="text-accent">Experiences.</span>
                            </h2>
                            <div className="about-narrative-text">
                                <p>
                                    At Aadi Enterprises, we don't just sell equipment; we help businesses create unique and unforgettable dining experiences.
                                </p>
                                <p>
                                    As a leading supplier of cutting-edge Food & Beverage solutions, we bring the world's finest brands directly to your doorstep. From pre-opening consultation to after-sales support, our role evolves from vendor to strategic partner, ensuring your business thrives in a competitive market.
                                </p>
                            </div>

                            {/* The Aadi Standard */}
                            <div className="aadi-standard">
                                <h3 className="aadi-standard-title">The Aadi Standard</h3>
                                <ul className="aadi-standard-list">
                                    <li className="aadi-standard-item">
                                        <Globe className="aadi-icon" size={20} />
                                        <div>
                                            <span className="aadi-label">Global Reach:</span>
                                            <span className="aadi-desc">Direct imports from top international manufacturers.</span>
                                        </div>
                                    </li>
                                    <li className="aadi-standard-item">
                                        <ShieldCheck className="aadi-icon" size={20} />
                                        <div>
                                            <span className="aadi-label">Certified Trust:</span>
                                            <span className="aadi-desc">ISO 9001:2015 Certified | FSSAI Registered | GeM Govt. Marketplace Approved.</span>
                                        </div>
                                    </li>
                                    <li className="aadi-standard-item">
                                        <Map className="aadi-icon" size={20} />
                                        <div>
                                            <span className="aadi-label">Regional Power:</span>
                                            <span className="aadi-desc">Serving India, Sri Lanka, and the Maldives.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="about-split-image">
                            <div className="about-image-wrapper">
                                <img
                                    src={getAssetUrl("about_us_image.jpg")}
                                    alt="Chef and consultant discussing kitchen blueprints"
                                    className="about-narrative-image"
                                />
                                <div className="about-image-overlay"></div>
                            </div>
                            {/* Floating Badge */}
                            <div className="about-floating-badge">
                                <p className="badge-number">100+</p>
                                <p className="badge-label">Projects Delivered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Mission & Vision (The Core) */}
            <section className="about-mission-vision">
                <div className="about-container">
                    <div className="mission-vision-grid">
                        {/* Mission Card */}
                        <div className="mission-vision-card">
                            <div className="mv-icon-wrapper">
                                <Target className="mv-icon" size={28} />
                            </div>
                            <h3 className="mv-title">Our Mission</h3>
                            <p className="mv-description">
                                To empower the Food & Beverage industry by providing premium, innovative equipment solutions. We aim to enhance operational efficiency while elevating the aesthetics and customer experience of every establishment we touch.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="mission-vision-card">
                            <div className="mv-icon-wrapper">
                                <Eye className="mv-icon" size={28} />
                            </div>
                            <h3 className="mv-title">Our Vision</h3>
                            <p className="mv-description">
                                To become the most trusted partner for F&B solutions across India. We envision a future where every hospitality business has access to world-class equipment that elevates their culinary excellence and brand identity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Our Expertise (Why Choose Us?) */}
            <section className="about-expertise">
                <div className="about-container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose Us?</h2>
                        <p className="section-subtitle">Excellence isn't just a goal; it's our baseline.</p>
                    </div>

                    <div className="expertise-grid">
                        <div className="expertise-card">
                            <div className="expertise-icon-wrapper">
                                <Award size={32} />
                            </div>
                            <h3 className="expertise-title">Premium Quality</h3>
                            <p className="expertise-desc">
                                Access the latest and most reliable equipment from global leaders like Rational, Hoshizaki, and Winterhalter.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrapper">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="expertise-title">Expert Consultation</h3>
                            <p className="expertise-desc">
                                Tailored pre-opening advice. We assist in choosing the right products to match your specific operational needs.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrapper">
                                <Layers size={32} />
                            </div>
                            <h3 className="expertise-title">One-Stop Solution</h3>
                            <p className="expertise-desc">
                                From front-office luggage carts to back-of-house combi ovens. Everything sourced from a single reliable partner.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrapper">
                                <HeartHandshake size={32} />
                            </div>
                            <h3 className="expertise-title">Customer-Centric</h3>
                            <p className="expertise-desc">
                                Our relationship doesn't end at delivery. We provide reliable after-sales support and service to keep operations running.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Industry Footprint */}
            <section className="about-footprint">
                <div className="footprint-map-pattern">
                    <Map size={600} strokeWidth={0.5} />
                </div>

                <div className="about-container footprint-content">
                    <div className="footprint-layout">
                        <div className="footprint-text">
                            <h2 className="footprint-title">Trusted Across Borders.</h2>
                            <p className="footprint-description">
                                Headquartered in Pune, with a strong operational presence in Mumbai, Bengaluru, and Delhi. We seamlessly execute projects across the subcontinent.
                            </p>

                            <div className="footprint-locations">
                                <div className="footprint-location">
                                    <h4 className="location-label">HQ</h4>
                                    <p className="location-name">Pune, Maharashtra</p>
                                </div>
                                <div className="footprint-location">
                                    <h4 className="location-label">Hubs</h4>
                                    <p className="location-name">Mumbai, Bengaluru, Delhi</p>
                                </div>
                            </div>
                        </div>

                        <div className="footprint-sectors">
                            <h3 className="sectors-title">
                                <Users className="sectors-icon" size={24} />
                                Sectors We Serve
                            </h3>
                            <ul className="sectors-list">
                                <li className="sector-item">
                                    <span className="sector-name">Hotels & Resorts</span>
                                    <span className="sector-clients">Marriott, Ritz Carlton, Hyatt</span>
                                </li>
                                <li className="sector-item">
                                    <span className="sector-name">Corporate Institutions</span>
                                    <span className="sector-clients">Bajaj Finserv, Fujitsu</span>
                                </li>
                                <li className="sector-item">
                                    <span className="sector-name">Healthcare & Education</span>
                                    <span className="sector-clients">Apollo, Wellington College</span>
                                </li>
                                <li className="sector-item">
                                    <span className="sector-name">Restaurants & Bars</span>
                                    <span className="sector-clients">High-End Retail & Cafes</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Bottom CTA */}
            <section className="about-cta">
                <div className="about-cta-content">
                    <h2 className="about-cta-title">
                        Ready to elevate your hospitality standards?
                    </h2>
                    <p className="about-cta-subtitle">
                        Let's create something amazing together.
                    </p>
                    <div className="about-cta-buttons">
                        <Link to="/contact" className="btn-primary">
                            Contact Our Consultants <ArrowRight size={18} className="btn-icon" />
                        </Link>
                        <a
                            href="https://drive.google.com/drive/folders/1f6st0JQ64rPWvfX-nhnfuVSjP5kFCohs?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                        >
                            Download Corporate Profile <Download size={18} className="btn-icon" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
