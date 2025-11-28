import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import data from "../../../../aadi-info.json";
import "./ContactPage.css";

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        type: "New Project Setup",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        alert("Thank you for your inquiry. Our team will contact you shortly.");
        setFormData({
            name: "",
            company: "",
            email: "",
            type: "New Project Setup",
            message: "",
        });
    };

    const { email, linkedin, maps, closingMessage, offices } = data.contactInfo;

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <h1 className="contact-title">Let's Create Something Amazing</h1>
                    <p className="contact-subtitle">
                        Reach out for consultations, quotes, or to schedule a visit to our experience center.
                    </p>
                </div>

                <div className="contact-layout">
                    {/* Contact Form */}
                    <div className="contact-form-wrapper">
                        <h3 className="form-title">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="form-input"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) =>
                                            setFormData({ ...formData, company: e.target.value })
                                        }
                                        className="form-input"
                                        placeholder="Hotel / Restaurant"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="form-input"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Inquiry Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value })
                                    }
                                    className="form-select"
                                >
                                    <option>New Project Setup</option>
                                    <option>Equipment Replacement</option>
                                    <option>Consultation</option>
                                    <option>After-Sales Support</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    className="form-textarea"
                                    placeholder="Tell us about your requirements..."
                                ></textarea>
                            </div>

                            <button type="submit" className="form-submit-btn">
                                Submit Inquiry <ArrowRight size={18} className="btn-icon" />
                            </button>
                        </form>
                    </div>

                    {/* Contact Details */}
                    <div className="contact-details">
                        <div className="contact-info-card">
                            <div className="info-card-content">
                                <h3 className="info-card-title">Headquarters</h3>
                                <div className="info-items">
                                    <div className="info-item">
                                        <div className="info-icon-wrapper">
                                            <MapPin className="info-icon" size={24} />
                                        </div>
                                        <div>
                                            <p className="info-main">Pune, Maharashtra</p>
                                            <p className="info-sub">
                                                Registered Office & Experience Center
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon-wrapper">
                                            <Mail className="info-icon" size={24} />
                                        </div>
                                        <div>
                                            <p className="info-main">Email Us</p>
                                            <a href={`mailto:${email}`} className="info-link">
                                                {email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon-wrapper">
                                            <Clock className="info-icon" size={24} />
                                        </div>
                                        <div>
                                            <p className="info-main">Working Hours</p>
                                            <p className="info-sub">Mon - Sat: 9:00 AM - 6:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="regional-contacts-card">
                            <h3 className="regional-title">Regional Contacts</h3>
                            <div className="regional-grid">
                                {offices.map((office, index) => (
                                    <div key={index} className="regional-item">
                                        <p className="regional-label">{office.label.replace(" Office", "")}</p>
                                        <a href={`tel:${office.phone}`} className="regional-phone">
                                            {office.phone}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
