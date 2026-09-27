import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import data from "../../../aadi-info.json";
import { WHATSAPP_DISPLAY_NUMBER, getContactPageEnquiryMessage, getWhatsAppUrl } from "../utils/whatsapp";
import "./ContactPage.css";

interface FormData {
    name: string;
    company: string;
    phone: string;
    email: string;
    projectType: string;
    requirement: string;
    message: string;
    botcheck: boolean;
}

const PROJECT_TYPES = [
    "Hotel / Resort",
    "Restaurant / Food Service",
    "Healthcare",
    "Corporate / Commercial",
    "Institution / Education",
    "Wellness & Lifestyle",
    "Other",
];

const REASONS = [
    {
        index: "01",
        title: "Project Planning",
        description: "Understand requirements and plan the right solution.",
    },
    {
        index: "02",
        title: "Product Sourcing",
        description: "Source hospitality products and equipment from established brands.",
    },
    {
        index: "03",
        title: "Installation & Commissioning",
        description: "Support for professional installation and commissioning.",
    },
    {
        index: "04",
        title: "After-Sales Support",
        description: "Reliable assistance to keep operations running.",
    },
];

const HELP_LINKS = [
    { label: "Professional Kitchen", to: "/products" },
    { label: "Food & Beverage", to: "/products" },
    { label: "Housekeeping & Hygiene", to: "/products" },
    { label: "Guest Experience", to: "/products" },
    { label: "Hospitality Procurement", to: "/products" },
    { label: "Project & Property Solutions", to: "/about" },
];

const ContactPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful, isSubmitting },
    } = useForm<FormData>({
        mode: "onTouched",
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const { submit: onSubmit } = useWeb3Forms({
        access_key: "255c983d-a0b4-474e-b591-cd287efa3236",
        settings: {
            from_name: "Aadi Enterprises Website",
            subject: "New Inquiry from Website Contact Form",
        },
        onSuccess: (msg) => {
            setIsSuccess(true);
            setStatusMessage(msg);
            reset();
        },
        onError: (msg) => {
            setIsSuccess(false);
            setStatusMessage(msg);
        },
    });

    const { email: contactEmail, offices } = data.contactInfo;
    const whatsappUrl = getWhatsAppUrl(getContactPageEnquiryMessage());

    const scrollToForm = () => {
        document.getElementById("cx-enquiry")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="cx">
            {/* Hero */}
            <section className="cx-hero">
                <div className="cx-hero-inner">
                    <p className="cx-eyebrow">Contact Aadi Enterprises</p>
                    <h1 className="cx-hero-title">
                        Let&rsquo;s Build the Right Solution for Your Property.
                    </h1>
                    <p className="cx-hero-text">
                        Tell us about your property, project, requirements, or upcoming
                        procurement needs. Our team can help you identify the right products,
                        equipment, and hospitality solutions.
                    </p>
                    <div className="cx-hero-actions">
                        <button type="button" className="cx-btn cx-btn-primary" onClick={scrollToForm}>
                            Talk to Aadi Enterprises
                            <ArrowRight size={17} aria-hidden="true" />
                        </button>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cx-btn cx-btn-outline"
                        >
                            <MessageCircle size={17} aria-hidden="true" />
                            WhatsApp Enquiry
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact information */}
            <section className="cx-info" aria-label="Contact information">
                <div className="cx-inner">
                    <div className="cx-info-grid">
                        <div>
                            <h2 className="cx-h2">Head Office</h2>
                            <p className="cx-place">Pune, Maharashtra</p>
                            <a
                                href="https://maps.app.goo.gl/Eft6y7Ji6cmZpy7d7?g_st=ipc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cx-inline-link"
                            >
                                Parage Chowk, Ashirwad Complex, Barane Rd, Mangalwar Peth,
                                Pune, Maharashtra 411011
                            </a>
                            <ul className="cx-office-list">
                                {offices.map((office) => (
                                    <li key={office.label} className="cx-office">
                                        <span className="cx-office-city">
                                            {office.label.replace(" Office", "")}
                                        </span>
                                        <a href={`tel:${office.phone}`} className="cx-office-phone">
                                            {office.phone}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="cx-h2">Direct Lines</h2>
                            <dl className="cx-direct">
                                <div className="cx-direct-row">
                                    <dt>Email</dt>
                                    <dd>
                                        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                                    </dd>
                                </div>
                                <div className="cx-direct-row">
                                    <dt>WhatsApp</dt>
                                    <dd>
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                            {WHATSAPP_DISPLAY_NUMBER}
                                        </a>
                                    </dd>
                                </div>
                                <div className="cx-direct-row">
                                    <dt>Hours</dt>
                                    <dd>Mon – Sat: 9:00 AM – 6:00 PM</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enquiry form */}
            <section id="cx-enquiry" className="cx-form-section" aria-labelledby="cx-form-title">
                <div className="cx-inner cx-form-grid">
                    <div>
                        <p className="cx-eyebrow">Enquiry</p>
                        <h2 id="cx-form-title" className="cx-h2">
                            Send an Enquiry
                        </h2>
                        <p className="cx-form-intro">
                            Share a few details and our team will get back to you. For an
                            immediate response, reach us on WhatsApp.
                        </p>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cx-inline-link cx-wa-inline"
                        >
                            <MessageCircle size={15} aria-hidden="true" />
                            Chat on WhatsApp ({WHATSAPP_DISPLAY_NUMBER})
                        </a>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit(onSubmit)} className="cx-form" noValidate={false}>
                            <input
                                type="checkbox"
                                className="cx-honeypot"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                {...register("botcheck")}
                            />

                            <div className="cx-row">
                                <div className="cx-field">
                                    <label htmlFor="cx-name">
                                        Name <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="cx-name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Your full name"
                                        aria-invalid={!!errors.name}
                                        {...register("name", {
                                            required: "Name is required",
                                            maxLength: { value: 80, message: "Name is too long" },
                                        })}
                                    />
                                    {errors.name && (
                                        <span className="cx-error" role="alert">{errors.name.message}</span>
                                    )}
                                </div>
                                <div className="cx-field">
                                    <label htmlFor="cx-company">Company / Organization</label>
                                    <input
                                        id="cx-company"
                                        type="text"
                                        autoComplete="organization"
                                        placeholder="Hotel / Restaurant"
                                        {...register("company")}
                                    />
                                </div>
                            </div>

                            <div className="cx-row">
                                <div className="cx-field">
                                    <label htmlFor="cx-phone">
                                        Phone <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="cx-phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="+91 98765 43210"
                                        aria-invalid={!!errors.phone}
                                        {...register("phone", {
                                            required: "Phone number is required",
                                        })}
                                    />
                                    {errors.phone && (
                                        <span className="cx-error" role="alert">{errors.phone.message}</span>
                                    )}
                                </div>
                                <div className="cx-field">
                                    <label htmlFor="cx-email">Email</label>
                                    <input
                                        id="cx-email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        aria-invalid={!!errors.email}
                                        {...register("email", {
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Please enter a valid email",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <span className="cx-error" role="alert">{errors.email.message}</span>
                                    )}
                                </div>
                            </div>

                            <div className="cx-row">
                                <div className="cx-field">
                                    <label htmlFor="cx-project-type">Property / Project Type</label>
                                    <select id="cx-project-type" {...register("projectType")}>
                                        {PROJECT_TYPES.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="cx-field">
                                    <label htmlFor="cx-requirement">Requirement</label>
                                    <input
                                        id="cx-requirement"
                                        type="text"
                                        placeholder="e.g. Kitchen setup for a new hotel"
                                        {...register("requirement")}
                                    />
                                </div>
                            </div>

                            <div className="cx-field">
                                <label htmlFor="cx-message">
                                    Message <span aria-hidden="true">*</span>
                                </label>
                                <textarea
                                    id="cx-message"
                                    rows={5}
                                    placeholder="Tell us about your requirements…"
                                    aria-invalid={!!errors.message}
                                    {...register("message", {
                                        required: "Message is required",
                                    })}
                                />
                                {errors.message && (
                                    <span className="cx-error" role="alert">{errors.message.message}</span>
                                )}
                            </div>

                            <button type="submit" className="cx-btn cx-btn-primary cx-submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sending…" : (
                                    <>
                                        Send Enquiry
                                        <ArrowRight size={17} aria-hidden="true" />
                                    </>
                                )}
                            </button>

                            {isSubmitSuccessful && isSuccess && (
                                <p className="cx-status cx-status-success" role="status">
                                    <CheckCircle size={17} aria-hidden="true" />
                                    {statusMessage || "Thank you! Your enquiry has been sent successfully."}
                                </p>
                            )}
                            {isSubmitSuccessful && !isSuccess && (
                                <p className="cx-status cx-status-error" role="alert">
                                    <AlertCircle size={17} aria-hidden="true" />
                                    {statusMessage || "Something went wrong. Please try again later."}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* Why work with us */}
            <section className="cx-why" aria-labelledby="cx-why-title">
                <div className="cx-inner">
                    <p className="cx-eyebrow">Working together</p>
                    <h2 id="cx-why-title" className="cx-h2 cx-head-space">
                        Why Work With Aadi Enterprises
                    </h2>
                    <ol className="cx-why-list">
                        {REASONS.map((reason) => (
                            <li key={reason.index} className="cx-why-item">
                                <span className="cx-why-index" aria-hidden="true">
                                    {reason.index}
                                </span>
                                <h3 className="cx-why-title">{reason.title}</h3>
                                <p className="cx-why-text">{reason.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Service areas */}
            <section className="cx-help" aria-labelledby="cx-help-title">
                <div className="cx-inner">
                    <p className="cx-eyebrow">Coverage</p>
                    <h2 id="cx-help-title" className="cx-h2 cx-head-space">
                        What We Help With
                    </h2>
                    <ul className="cx-help-list">
                        {HELP_LINKS.map((item) => (
                            <li key={item.label}>
                                <button
                                    type="button"
                                    className="cx-help-link"
                                    onClick={() => navigate(item.to)}
                                >
                                    {item.label}
                                    <ArrowRight size={15} aria-hidden="true" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cx-cta" aria-labelledby="cx-cta-title">
                <div className="cx-cta-inner">
                    <h2 id="cx-cta-title" className="cx-cta-title">
                        Planning a New Property or Upgrading an Existing One?
                    </h2>
                    <p className="cx-cta-text">
                        Tell us about your requirement — our team will help you plan, source
                        and set up the right solution for your property.
                    </p>
                    <div className="cx-cta-actions">
                        <button
                            type="button"
                            className="cx-btn cx-btn-light"
                            onClick={scrollToForm}
                        >
                            Talk to Aadi Enterprises
                            <ArrowRight size={17} aria-hidden="true" />
                        </button>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cx-btn cx-btn-ghost-light"
                        >
                            <MessageCircle size={17} aria-hidden="true" />
                            WhatsApp Enquiry
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
