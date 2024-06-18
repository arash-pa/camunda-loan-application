import React from "react";
import './WizardButtons.css'


const WizardButtons = ({
  currentStep,
  setCurrentStep,
  steps,
  handleSubmit,
}) => {
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="wizard-wrapper">
      <div className="wizard-navigation">
        <button
          type="button"
          className="previous-button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </button>

        {/* Space between buttons - adjust as needed */}
        <div style={{ flex: 1 }} />

        <button
          type="button"
          className="next-button"
          onClick={handleNext}
          disabled={currentStep === steps.length}
        >
          Next
        </button>

        {currentStep === steps.length && ( // Show submit button on the last step
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardButtons;
