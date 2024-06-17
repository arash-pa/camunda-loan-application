import React from "react";
import "./StepCards.css";

function StepCards({ steps, currentStep, setCurrentStep }) {
    const handleClick = (index) => {
        setCurrentStep(index + 1); // Set the current step (add 1 for 1-based indexing)
      };

  return (
    <div className="step-cards-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-card ${index < currentStep - 1 ? "completed" : ""} ${
            index === currentStep - 1 ? "active" : ""
          }`}
          onClick={() => handleClick(index)}  // Add onClick handler
          style={{transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            transform: index === currentStep -1 ? 'scale(1.1)' : 'scale(1)',
            opacity: index === currentStep -1 ? '1' : '0.75'}}
        >
          <img src={step.image} alt={step.title} className="step-card-image" />
        </div>
      ))}
    </div>
  );
}

export default StepCards;
