import React from "react";
import "./StepCards.css";

function StepCards({ steps, currentStep, setCurrentStep }) {
  return (
    <div className="step-cards-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-card ${index < currentStep - 1 ? "completed" : ""} ${
            index === currentStep - 1 ? "active" : ""
          }`}
        >
          <img src={step.image} alt={step.title} className="step-card-image" />
        </div>
      ))}
    </div>
  );
}

export default StepCards;
