import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import WhatsAppIcon from "../components/WhatsAppIcon";
import "./NotFoundPage.css";
import {
  WHATSAPP_DISPLAY_NUMBER,
  getGeneralEnquiryMessage,
  getWhatsAppUrl,
} from "../utils/whatsapp";

function NotFoundPage() {
  const navigate = useNavigate();
  const whatsappUrl = getWhatsAppUrl(getGeneralEnquiryMessage());

  return (
    <section className="nf" aria-label="Page not found">
      <div className="nf-inner">
        <p className="nf-eyebrow">404</p>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-text">
          The page you are looking for doesn&apos;t exist or has been moved. Get in touch if you need help finding the right hospitality solution.
        </p>
        <div className="nf-actions">
          <button type="button" className="nf-btn nf-btn-primary" onClick={() => navigate("/")}>
            <ArrowLeft size={17} aria-hidden="true" />
            Back to Home
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nf-btn nf-btn-outline"
          >
            <WhatsAppIcon size={17} />
            WhatsApp ({WHATSAPP_DISPLAY_NUMBER})
          </a>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
