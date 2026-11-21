import React, { lazy, Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  ClipboardList,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import data from "../../../aadi-info.json";
import { BUSINESS_HOURS, PUNE_HEAD_OFFICE } from "../data/contact";
import {
  WHATSAPP_DISPLAY_NUMBER,
  getContactPageEnquiryMessage,
  getWhatsAppUrl,
} from "../utils/whatsapp";
import {
  SECTION_VIEWPORT,
  heroReveal,
  revealItem,
  staggerParent,
} from "../lib/catalogue-motion";
import { usePrefersReducedMotion } from "../lib/use-reduced-motion";
import "./ContactPage.css";

const ContactMap = lazy(() => import("../components/Contact/ContactMap"));

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

const ContactPage: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
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
    <div className="px cx">
      <header className="cx-hero">
        <div className="px-shell cx-hero-inner">
          <motion.p
            className="px-eyebrow"
            {...heroReveal(0.05, prefersReducedMotion)}
          >
            Contact
          </motion.p>
          <motion.h1
            className="cx-hero-title"
            {...heroReveal(0.12, prefersReducedMotion)}
          >
            Contact Aadi Enterprises
          </motion.h1>
          <motion.p
            className="cx-hero-text"
            {...heroReveal(0.2, prefersReducedMotion)}
          >
            Get the right hospitality solutions for your next project.
          </motion.p>
        </div>
      </header>

      <section
        className="px-section px-section--flush cx-quick"
        aria-labelledby="cx-quick-title"
      >
        <div className="px-shell">
          <h2 id="cx-quick-title" className="cx-sr">
            Quick contact options
          </h2>
          <motion.div
            className="cx-quick-grid"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cx-option"
              variants={revealItem}
            >
              <span className="cx-option-icon" aria-hidden="true">
                <MessageCircle size={20} />
              </span>
              <span className="cx-option-copy">
                <span className="cx-option-title">WhatsApp Enquiry</span>
                <span className="cx-option-text">Message our team directly.</span>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" className="cx-option-arrow" />
            </motion.a>

            <motion.button
              type="button"
              className="cx-option"
              onClick={scrollToForm}
              variants={revealItem}
            >
              <span className="cx-option-icon" aria-hidden="true">
                <ClipboardList size={20} />
              </span>
              <span className="cx-option-copy">
                <span className="cx-option-title">Project Enquiry</span>
                <span className="cx-option-text">Share your requirements.</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="cx-option-arrow" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section
        id="cx-enquiry"
        className="px-section px-section--alt cx-enquiry"
        aria-labelledby="cx-form-title"
      >
        <div className="px-shell cx-enquiry-grid">
          <motion.div
            className="cx-enquiry-copy"
            {...heroReveal(0.08, prefersReducedMotion)}
          >
            <p className="px-eyebrow">Project enquiry</p>
            <h2 id="cx-form-title" className="cx-h2">
              Tell us about your project.
            </h2>
            <a href={`mailto:${contactEmail}`} className="cx-text-link">
              {contactEmail}
            </a>
          </motion.div>

          <motion.div
            className="cx-form-card"
            {...heroReveal(0.16, prefersReducedMotion)}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="cx-form"
              noValidate={false}
            >
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
                    <span className="cx-error" role="alert">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="cx-field">
                  <label htmlFor="cx-company">Company / Organisation</label>
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
                    <span className="cx-error" role="alert">
                      {errors.phone.message}
                    </span>
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
                    <span className="cx-error" role="alert">
                      {errors.email.message}
                    </span>
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
                  <span className="cx-error" role="alert">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="px-btn px-btn-primary cx-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Send Enquiry"}
                {!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}
              </button>

              {isSubmitSuccessful && isSuccess && (
                <p className="cx-status cx-status-success" role="status">
                  <CheckCircle size={17} aria-hidden="true" />
                  {statusMessage ||
                    "Thank you! Your enquiry has been sent successfully."}
                </p>
              )}
              {isSubmitSuccessful && !isSuccess && (
                <p className="cx-status cx-status-error" role="alert">
                  <AlertCircle size={17} aria-hidden="true" />
                  {statusMessage ||
                    "Something went wrong. Please try again later."}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <section
        className="px-section cx-location"
        aria-labelledby="cx-location-title"
      >
        <div className="px-shell">
          <div className="cx-section-head">
            <p className="px-eyebrow">Pune head office</p>
            <h2 id="cx-location-title" className="cx-h2">
              Visit us in Pune.
            </h2>
          </div>

          <div className="cx-location-grid">
            <motion.div
              className="cx-map-wrap"
              {...heroReveal(0.05, prefersReducedMotion)}
            >
              <Suspense
                fallback={
                  <div
                    className="cx-map-fallback"
                    role="status"
                    aria-label="Loading map"
                  />
                }
              >
                <ContactMap />
              </Suspense>
            </motion.div>

            <motion.div
              className="cx-location-info"
              {...heroReveal(0.14, prefersReducedMotion)}
            >
              <MapPin size={18} aria-hidden="true" className="cx-location-icon" />
              <h3>Aadi Enterprises</h3>
              <address>
                {PUNE_HEAD_OFFICE.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <a
                href={`tel:${PUNE_HEAD_OFFICE.phone.replace(/[^+\d]/g, "")}`}
                className="cx-location-phone"
              >
                {PUNE_HEAD_OFFICE.phone}
              </a>
              <a
                href={PUNE_HEAD_OFFICE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-btn px-btn-secondary cx-directions"
              >
                Get directions
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="px-section px-section--alt cx-offices"
        aria-labelledby="cx-offices-title"
      >
        <div className="px-shell">
          <h2 id="cx-offices-title" className="cx-h2">
            Other offices.
          </h2>
          <div className="cx-offices-grid">
            <dl className="cx-office-list">
              {offices.map((office) => (
                <div key={office.label} className="cx-office-row">
                  <dt>
                    {office.label === "Delhi Office"
                      ? "Delhi NCR"
                      : office.label.replace(" Office", "")}
                  </dt>
                  <dd>
                    <a
                      href={`tel:${office.phone.replace(/[^+\d]/g, "")}`}
                    >
                      {office.phone}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <dl className="cx-direct-list">
              <div className="cx-direct-row">
                <dt>
                  <Mail size={14} aria-hidden="true" /> Email
                </dt>
                <dd>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </dd>
              </div>
              <div className="cx-direct-row">
                <dt>
                  <MessageCircle size={14} aria-hidden="true" /> WhatsApp
                </dt>
                <dd>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {WHATSAPP_DISPLAY_NUMBER}
                  </a>
                </dd>
              </div>
              <div className="cx-direct-row">
                <dt>
                  <Clock3 size={14} aria-hidden="true" /> Hours
                </dt>
                <dd>{BUSINESS_HOURS}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="cx-closing" aria-labelledby="cx-closing-title">
        <div className="px-shell cx-closing-inner">
          <h2 id="cx-closing-title" className="cx-closing-title">
            Start a conversation.
          </h2>
          <div className="cx-closing-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-btn px-btn-primary"
            >
              <MessageCircle size={16} aria-hidden="true" />
              WhatsApp
            </a>
            <button
              type="button"
              className="px-btn px-btn-secondary"
              onClick={scrollToForm}
            >
              Send an enquiry
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
