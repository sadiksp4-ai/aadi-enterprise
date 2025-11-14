import React from "react";
import "./About.css";
import data from "../../../../aadi-info.json";

const About = React.forwardRef<HTMLElement>((_, ref) => {
  const { introduction, philosophy } = data;

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-content">
        <h2 className="section-title">{philosophy.title}</h2>
        <p className="section-subtitle">{philosophy.subtitle}</p>
        <p className="about-text">{introduction.description}</p>
        <ul className="philosophy-list">
          {philosophy.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default About;
