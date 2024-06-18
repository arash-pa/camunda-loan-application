import React from "react";
import "./StepCards.css";
import CheckIcon from '@mui/icons-material/Check';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PaymentsIcon from '@mui/icons-material/Payments';
import DifferenceIcon from '@mui/icons-material/Difference';

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
          {index < currentStep - 1 ? (
            <CheckIcon className="step-card-image" />
          ) : step.image === "contact" ? (
            <ContactPageIcon className="step-card-image" />
          ) : step.image === "payment" ? (
            <PaymentsIcon className="step-card-image" />
          ) : step.image === "documents" ? (
            <DifferenceIcon className="step-card-image" /> 
          ) : (
            <CheckIcon className="step-card-image" /> // Default
          )}
        </div>
      ))}
    </div>
  );
}

export default StepCards;
