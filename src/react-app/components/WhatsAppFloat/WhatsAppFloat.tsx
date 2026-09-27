import React from "react";
import { MessageCircle } from "lucide-react";
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
      <MessageCircle size={26} className="whatsapp-float-icon" />
    </a>
  );
};

export default WhatsAppFloat;
