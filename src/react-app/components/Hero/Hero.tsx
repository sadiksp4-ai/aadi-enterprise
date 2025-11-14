import React from "react";
import "./Hero.css";
import video from "/bg-video.mp4";
import data from "../../../../aadi-info.json";

const Hero: React.FC = () => {
  const { tagline } = data.companyInfo;
  const { title } = data.introduction;

  // Split the title for a two-line display
  const titleParts = title.split(", ");
  const part1 = titleParts[0] + ",";
  const part2 = titleParts.slice(1).join(", ");

  return (
    <section id="home" className="hero">
      <video autoPlay loop muted className="hero-video">
        <source src={video} type="video/mp4" />
      </video>
      <div className="hero-content">
        <h1 className="hero-title">
          {part1}
          <br />
          {part2}
        </h1>
        <p className="hero-subtitle">{tagline}</p>
      </div>
    </section>
  );
};

export default Hero;
