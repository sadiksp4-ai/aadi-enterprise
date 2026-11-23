import React from "react";
import { getAssetUrl } from "../utils";

interface WhatsAppIconProps {
  size?: number;
  className?: string;
}

/** Official WhatsApp mark from `public/WhatsApp_Logo.webp`. */
const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({ size = 16, className }) => (
  <img
    src={getAssetUrl("/WhatsApp_Logo.webp")}
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    className={className}
    style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle" }}
    decoding="async"
  />
);

export default WhatsAppIcon;
