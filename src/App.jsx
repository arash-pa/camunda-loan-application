import React, { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
//import "./index.css";
import "./app.css";
import Navbar from "./components/Navbar";
import {
  proofOfAddressInstructions,
  proofOfIncomeInstructions,
} from "../data/data";
import TextInput from "./components/TextInput";
import AddressInput from "./components/AddressInput";
import AddressInput2 from "./components/AddressInput2";
import PaymentDetails from "./components/PaymentDetails";
import PhoneInputComponent from "./components/PhoneInputComponent";
import EmailInput from "./components/EmailInput";
import DropdownInput from "./components/DropdownInput";
import DateInput from "./components/DateInput";
import CurrencyInput from "react-currency-input-field";
import WizardButtons from "./components/WizardButtons";
import StepCards from "./components/StepCards";
import Tooltip from "./components/Tooltip";
import {
  employmentTypeLookup,
  housingStatusLookup,
  loanTypeLookup,
} from "../data/lookupHardcode";
import FileUpload from "./components/FileUpload";
import FileUpload2 from "./components/FileUpload2";
import { callCamundaWebhook } from "../data/callCamundaWebhook";
import { uploadFileToS3 } from "./functions/apis";

import { createCustomerData } from "./functions/builders";

const App = () => {
  const formRef = useRef(null);
  const nodeRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    {
      image: "contact",
      title: "Contact Information",
      description: "The customer's personal contact information",
    },
    {
      image: "payment",
      title: "Payment Details",
      description: "The customer's payment details",
    },
    {
      image: "documents",
      title: "Documents",
      description: "The customer's address and income proof documents",
    },
  ];
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInputs, setUserInputs] = useState({
    firstName: "Leif",
    lastName: "Thracia",
    dateOfBirth: new Date("1999-09-01T00:00:00Z"),
    paymentDetails: {
      nameOnCard: "Leif Thracia",
      cardNumber: "7246-5762-5958-0403",
      sortCode: "30-45-04",
      isActive: true,
    },
    emailAddress: "arash.parsanejad@vasscompany.com",
    phone: "+447000000000",
    employmentType: "Full-Time",
    housingStatus: "Private Rental",
    address: {
      addressLine1: "5 Merchant Square",
      addressLine2: "",
      country: "United Kingdom",
      city: "London",
      region: "England",
      postCode: "W2 1BQ",
    },
    addressFull: "5 Merchant Square, London, England, GB, W2 1BQ",
    proofOfIncome: null,
    proofOfAddress: null,
    loanType: "Personal",
    loanAmount: {
      currency: "GBP",
      amount: 499,
    },
  });
  
  const [fileValidations, setFileValidations] = useState([false, false])

  const getFullAddress = () => {
    return `${userInputs.address.addressLine1}, ${userInputs.address.city}, ${userInputs.address.region}, ${userInputs.address.country}, ${userInputs.address.postCode}`;
  };

  useEffect(() => {
    const fullAddress = getFullAddress();
    setUserInputs({ ...userInputs, addressFull: fullAddress });
  }, [userInputs.address]); // Add userInputs.address as a dependency
  // Handle form changes (generic example)

  const handleChange = (event) => {
    setUserInputs({
      ...userInputs,
      [event.target.name]: event.target.value,
    });
  };

  const handlePaymentDetailChange = (event) => {
    const { name, value } = event.target;

    setUserInputs((prevInputs) => ({
      ...prevInputs,
      paymentDetails: {
        ...prevInputs.paymentDetails,
        [name]: value, // Update the specific field in paymentDetails
      },
    }));
  };

  const handlePhoneChange = (value) => {
    setUserInputs({ ...userInputs, phone: value });
  };

  const handleFileChangeAddress = (event) => {
    console.log("j'address")
    const file = event.target.files[0];
    if (["application/pdf"].includes(file.type)) {
      setUserInputs({ ...userInputs, "proofOfAddress": file});
      setFileValidations(prevValidations => {
        const newValidations = [...prevValidations]; 
        newValidations[0] = false;            
        return newValidations;                     
      });
    } else {
      setUserInputs({ ...userInputs, "proofOfAddress": null});
      setFileValidations(prevValidations => {
        const newValidations = [...prevValidations]; 
        newValidations[0] = true;            
        return newValidations;                     
      });
    }
  }

  const handleFileChangeIncome = (event, index, fieldName) => {
    console.log("j'income")
    const file = event.target.files[0];
    if (["application/pdf"].includes(file.type)) {
      setUserInputs({ ...userInputs, "proofOfIncome": file});
      setFileValidations(prevValidations => {
        const newValidations = [...prevValidations]; 
        newValidations[1] = false;            
        return newValidations;                     
      });
    } else {
      setUserInputs({ ...userInputs, "proofOfIncome": null});
      setFileValidations(prevValidations => {
        const newValidations = [...prevValidations]; 
        newValidations[1] = true;            
        return newValidations;                     
      });
    }
  }

  const handleValueChange = (value, name, values) => {
    setUserInputs({
      ...userInputs,
      loanAmount: {
        currency: values.formatted[0],
        amount: values.float,
      },
    });
  };

  const today = new Date();

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);

  const handleSubmit = async () => {
    event.preventDefault();
    if (formRef.current.checkValidity()) {
      setIsLoading(true);
      const POAName =
        "Proof_of_Address-" +
        userInputs.firstName +
        "_" +
        userInputs.lastName +
        "-" +
        today.toLocaleDateString("en-GB").replace(/\//g, "-") +
        ".pdf";

      const POIName =
        "Proof_of_Income-" +
        userInputs.firstName +
        "_" +
        userInputs.lastName +
        "-" +
        today.toLocaleDateString("en-GB").replace(/\//g, "-") +
        ".pdf";

      const POA_Result = await uploadFileToS3(
        userInputs.proofOfAddress,
        POAName
      );
      const POI_Result = await uploadFileToS3(
        userInputs.proofOfIncome,
        POIName
      );
      const POAUrl = POA_Result.objecturl;
      const POIUrl = POI_Result.objecturl;

      const customerData = createCustomerData(
        userInputs,
        POIName,
        POIUrl,
        POAName,
        POAUrl
      );
      console.log(customerData);
      const submissionData = {
        customerData: customerData,
      };
      callCamundaWebhook(submissionData);
      setIsLoading(false);
      setFormSubmitted(true);
    } else {
      formRef.current.reportValidity();
    }
  };
  console.log(userInputs);
  return (
    <div className={isLoading ? "loading-cursor" : ""}>
      <div>
        <header
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 776,
          }}
        >
          <Navbar />
        </header>
      </div>
      {formSubmitted ? (
        <div className="confirmation-page">
          <h2>We have your application...</h2>
          <p>Thank you for your submission!</p>
          <button
            onClick={() => {
              setFormSubmitted(false);
            }}
          >
            Back
          </button>
        </div>
      ) : (
        <form ref={formRef}>
          {" "}
          <div className="form-wrapper">
            <StepCards
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
            <hr></hr>
            <div ref={nodeRef}>
              {currentStep === 1 && (
                <React.Fragment>
                  <div className="form-container">
                    {/* Wrapper for layout */}
                    <div className="form-group">
                      {/* Column 1 */}
                      <TextInput
                        placeholder="Enter First Name"
                        label="First Name"
                        name="firstName"
                        value={userInputs.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      {/* Column 2 */}
                      <div>
                        <div className="input-line">
                          <DropdownInput
                            label="Requested Loan"
                            name="loanType"
                            value={userInputs.loanType || ""}
                            options={loanTypeLookup}
                            onChange={handleChange}
                            idKey="loanTypeID"
                            returnIdKey={true}
                          />
                        </div>
                        <div className="input-line-no-label">
                          <CurrencyInput
                            style={{ height: "40px" }}
                            id="loanAmount"
                            placeholder="Enter Loan Amount"
                            defaultValue={userInputs.loanAmount.amount}
                            value={userInputs.loanAmount.amount}
                            decimalsLimit={2}
                            decimalSeparator="."
                            groupSeparator=","
                            prefix="£"
                            onValueChange={handleValueChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <PhoneInputComponent
                        name="phone"
                        value={userInputs.phone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                  </div>
                  <div className="form-container">
                    {/* Wrapper for layout */}
                    <div className="form-group">
                      {/* Column 1 */}
                      <TextInput
                        placeholder="Enter Last Name(s)"
                        label="Last Name"
                        name="lastName"
                        value={userInputs.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      {/* Column 2 */}
                      <div className="input-line">
                        <DropdownInput
                          label="Employment Type"
                          name="employmentType"
                          value={userInputs.employmentType || ""}
                          options={employmentTypeLookup}
                          onChange={handleChange}
                          idKey="employmentTypeID"
                          returnIdKey={true}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <EmailInput
                        name="emailAddress"
                        label="Email"
                        value={userInputs.emailAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-container">
                    {/* Wrapper for layout */}
                    <div className="form-group">
                      {/* Column 1 */}
                      <DateInput
                        label="Date of Birth"
                        name="dateOfBirth"
                        dateBefore={eighteenYearsAgo}
                        dateAfter={hundredYearsAgo}
                        date={userInputs.dateOfBirth}
                        errorMessage="Invalid date selection"
                        onChange={(date) =>
                          setUserInputs({
                            ...userInputs,
                            dateOfBirth: date,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      {/* Column 2 */}
                      <div className="input-line">
                        <DropdownInput
                          label="Housing Status"
                          name="housingStatus"
                          value={userInputs.housingStatus || ""}
                          options={housingStatusLookup}
                          onChange={handleChange}
                          idKey="housingStatusID"
                          returnIdKey={true}
                        />
                      </div>
                    </div>
                    <div className="form-group"></div>
                  </div>
                </React.Fragment>
              )}

              {currentStep === 2 && (
                <React.Fragment>
                  <div className="form-container">
                    <div className="form-group">
                      <AddressInput
                        name="address"
                        value={userInputs.address}
                        onChange={(address) =>
                          setUserInputs({ ...userInputs, address })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <AddressInput2
                        name="address"
                        value={userInputs.address}
                        onChange={(address) =>
                          setUserInputs({ ...userInputs, address })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <PaymentDetails
                        userInputs={userInputs}
                        onChange={handlePaymentDetailChange}
                      />
                    </div>
                  </div>
                </React.Fragment>
              )}
              {currentStep === 3 && (
                <React.Fragment>
                  <div className="docs-container">
                    <div className="form-group">
                      <Tooltip
                        title="Proof of Address"
                        instructions={proofOfAddressInstructions}
                      />
                      <FileUpload
                        acceptedTypes={["application/pdf"]}
                        onUpload={handleFileChangeAddress}
                        errorMessage="Invalid file type. Please upload PDF files."
                        fieldName="proofOfAddress"
                        selectedFile={userInputs?.proofOfAddress}
                        fileName={userInputs?.proofOfAddress?.name}
                        validationError={fileValidations[0]}
                        index={0}
                      />
                    </div>
                    <div className="form-group">
                      <Tooltip
                        title="Proof of Income"
                        instructions={proofOfIncomeInstructions}
                      />
                      <FileUpload2
                        acceptedTypes={["application/pdf"]}
                        onUpload={handleFileChangeIncome}
                        errorMessage="Invalid file type. Please upload PDF files."
                        fieldName="proofOfIncome"
                        selectedFile={userInputs?.proofOfIncome}
                        fileName={userInputs?.proofOfIncome?.name}
                        validationError={fileValidations[1]}
                        index={1}
                      />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>

            <WizardButtons
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              steps={steps}
              handleSubmit={handleSubmit}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default App;
