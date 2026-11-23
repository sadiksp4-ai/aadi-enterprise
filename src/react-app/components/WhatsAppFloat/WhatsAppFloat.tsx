import React from "react";
import WhatsAppIcon from "../WhatsAppIcon";
import { getWhatsAppUrl, getGeneralEnquiryMessage } from "../../utils/whatsapp";
import "./WhatsAppFloat.css";

const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href={getWhatsAppUrl(getGeneralEnquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat with Aadi Enterprises on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon size={30} className="whatsapp-float-icon" />
    </a>
  );
};

export default WhatsAppFloat;
