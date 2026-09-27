/**
 * Reusable WhatsApp enquiry helpers for Aadi Enterprises.
 * Keeps the destination number and message formatting in one place.
 */

export const WHATSAPP_DISPLAY_NUMBER = "+91 93561 26454";
export const WHATSAPP_DIGITS = "919356126454";

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_DIGITS}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getGeneralEnquiryMessage(): string {
  return "Hello Aadi Enterprises! I would like to enquire about your hospitality solutions.";
}

export function getProductEnquiryMessage(productName: string, categoryTitle?: string): string {
  if (categoryTitle) {
    return `Hello Aadi Enterprises! I would like to enquire about "${productName}" (${categoryTitle}). Please share details.`;
  }
  return `Hello Aadi Enterprises! I would like to enquire about "${productName}". Please share details.`;
}

export function getContactPageEnquiryMessage(): string {
  return "Hello Aadi Enterprises! I reached you from the Contact page and would like to discuss my requirement.";
}
