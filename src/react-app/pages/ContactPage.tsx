import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import { MapPin, Mail, Clock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import data from "../../../aadi-info.json";
import "./ContactPage.css";

interface FormData {
    name: string;
    company: string;
    email: string;
    phone: string;
    type: string;
    message: string;
    botcheck: boolean;
}

const ContactPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful, isSubmitting },
    } = useForm<FormData>({
        mode: "onTouched",
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const { submit: onSubmit } = useWeb3Forms({
        access_key: "4c01bdc4-7391-495a-98af-27a45f30d65d",
        settings: {
            from_name: "Aadi Enterprises Website",
            subject: "New Inquiry from Website Contact Form",
        },
        onSuccess: (msg) => {
            setIsSuccess(true);
            setMessage(msg);
            reset();
        },
        onError: (msg) => {
            setIsSuccess(false);
            setMessage(msg);
        },
    });

    const { email: contactEmail, offices } = data.contactInfo;

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
                        <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                            {/* Honeypot for bot detection */}
                            <input
                                type="checkbox"
                                className="hidden"
                                style={{ display: "none" }}
                                {...register("botcheck")}
                            />

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.name ? "input-error" : ""}`}
                                        placeholder="Sameer"
                                        {...register("name", {
                                            required: "Name is required",
                                            maxLength: { value: 80, message: "Name is too long" },
                                        })}
                                    />
                                    {errors.name && (
                                        <span className="error-message">{errors.name.message}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Hotel / Restaurant"
                                        {...register("company")}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className={`form-input ${errors.email ? "input-error" : ""}`}
                                        placeholder="sameer@example.com"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Please enter a valid email",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <span className="error-message">{errors.email.message}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className={`form-input ${errors.phone ? "input-error" : ""}`}
                                        placeholder="+91 98765 43210"
                                        {...register("phone", {
                                            required: "Phone number is required",
                                        })}
                                    />
                                    {errors.phone && (
                                        <span className="error-message">{errors.phone.message}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Inquiry Type</label>
                                <select className="form-select" {...register("type")}>
                                    <option value="Pre-opening Consultation">Pre-opening Consultation</option>
                                    <option value="New Project Setup">New Project Setup</option>
                                    <option value="Equipment Replacement">Equipment Replacement</option>
                                    <option value="Consultation">Consultation</option>
                                    <option value="After-Sales Support">After-Sales Support</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    rows={4}
                                    className={`form-textarea ${errors.message ? "input-error" : ""}`}
                                    placeholder="Tell us about your requirements..."
                                    {...register("message", {
                                        required: "Message is required",
                                    })}
                                ></textarea>
                                {errors.message && (
                                    <span className="error-message">{errors.message.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="form-submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="btn-loading">
                                        <svg
                                            className="spinner"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="spinner-track"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="spinner-head"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        Submit Inquiry <ArrowRight size={18} className="btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Success/Error Messages */}
                        {isSubmitSuccessful && isSuccess && (
                            <div className="form-message success">
                                <CheckCircle size={20} />
                                <span>{message || "Thank you! Your inquiry has been sent successfully."}</span>
                            </div>
                        )}
                        {isSubmitSuccessful && !isSuccess && (
                            <div className="form-message error">
                                <AlertCircle size={20} />
                                <span>{message || "Something went wrong. Please try again later."}</span>
                            </div>
                        )}
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
                                            <a
                                                href="https://maps.app.goo.gl/Eft6y7Ji6cmZpy7d7?g_st=ipc"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="info-link"
                                            >
                                                <p className="info-main">Parage Chowk, Ashirwad Complex, Barane Rd, Mangalwar Peth, Pune, Maharashtra 411011</p>
                                                <p className="info-sub">
                                                    Registered Office & Experience Center
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon-wrapper">
                                            <Mail className="info-icon" size={24} />
                                        </div>
                                        <div>
                                            <p className="info-main">Email Us</p>
                                            <a href={`mailto:${contactEmail}`} className="info-link">
                                                {contactEmail}
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
