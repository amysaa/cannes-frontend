import React from "react";
import "./FeatureCard.css";

const FeatureCard = ({ id, title, subtitle }) => {
  return (
    <div className="feature__card">
      <div className="feature__card-title">{title}</div>
      <div className="feature__card-subtitle">{subtitle}</div>
    </div>
  );
};

export default FeatureCard;
