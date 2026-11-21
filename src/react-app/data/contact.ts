/**
 * Verified contact details used by the Contact page.
 *
 * Address and phone are the existing Aadi Enterprises details already shown
 * on the site/footer. The coordinates come from the existing Google Maps
 * listing for “Aadi Enterprises- Hospitality Solutions” at Parage Chowk,
 * Mangalwar Peth, Pune 411011.
 */
export const PUNE_HEAD_OFFICE = {
  label: "Pune (HQ)",
  phone: "+91-9076304428",
  address:
    "Parage Chowk, Ashirwad Complex, Barane Rd, Mangalwar Peth, Pune, Maharashtra 411011",
  addressLines: [
    "Parage Chowk, Ashirwad Complex",
    "Barane Rd, Mangalwar Peth",
    "Pune, Maharashtra 411011",
  ],
  directionsUrl: "https://maps.app.goo.gl/Eft6y7Ji6cmZpy7d7?g_st=ipc",
  coordinates: {
    lat: 18.5238332,
    lng: 73.8643409,
  },
} as const;

export const BUSINESS_HOURS = "Mon – Sat · 9:00 AM – 6:00 PM";

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
