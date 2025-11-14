import React from "react";
import "./WhyChooseUs.css";
import data from "../../../../aadi-info.json";

const WhyChooseUs = React.forwardRef<HTMLElement>((_, ref) => {
  const { whyChooseUs } = data;

  return (
    <section id="why-choose-us" className="why-choose-us" ref={ref}>
      <h2 className="section-title">{whyChooseUs.title}</h2>
      <div className="reasons-grid">
        {whyChooseUs.reasons.map((reason, index) => (
          <div key={index} className="reason-card">
            <div className="reason-icon">{index + 1}</div>
            <h3 className="reason-point">{reason.point}</h3>
            <p className="reason-description">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default WhyChooseUs;

