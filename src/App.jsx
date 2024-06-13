import React, { useState, useEffect, useRef } from "react";
//import "./index.css";
import "./app.css";
import Navbar from "./components/Navbar";
import {
  proofOfAddressInstructions,
  proofOfIncomeInstructions,
} from "../data/data";
import TextInput from "./components/TextInput";
import AddressInput from "./components/AddressInput";
import PhoneInputComponent from "./components/PhoneInputComponent";
import EmailInput from "./components/EmailInput";
import DropdownInput from "./components/DropdownInput";
import DateInput from "./components/DateInput";
import CurrencyInput from "./components/CurrencyInput";
import {
  employmentTypeLookup,
  housingStatusLookup,
  loanTypeLookup,
} from "../data/lookupHardcode";
import FileUpload from "./components/FileUpload";
import { callCamundaWebhook } from "../data/callCamundaWebhook";
import { uploadFileToS3 } from "./functions/apis";

import {
  generateCardNumber,
  generateSortCode,
  createCustomerData,
} from "./functions/builders";

const App = () => {
  const formRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInputs, setUserInputs] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    emailAddress: "",
    phone: "",
    employmentType: "",
    housingStatus: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      city: "",
      region: "",
      postCode: "",
    },
    addressFull: "",
    proofOfIncome: null,
    proofOfAddress: null,
    loanType: {
      id: "",
      name: "",
    },
    loanAmount: {
      currency: "GBP",
      amount: "",
    },
  });

  async function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

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

  const handleCurrencyChange = (currencyInput) => {
    setUserInputs({
      ...userInputs,
      loanAmount: currencyInput, // Update loanAmount directly
    });
  };

  const handlePhoneChange = (value) => {
    setUserInputs({ ...userInputs, phone: value });
  };

  const handleFileUpload = (file, fieldName) => {
    setUserInputs({ ...userInputs, [fieldName]: file });
    console.log(userInputs);
  };
  const fileExtensions = {
    accept: ".jpg, .jpeg, .png, .pdf",
  };

  const today = new Date();
  console.log(today)

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);

  const handleSubmit = async () => {
    event.preventDefault();

    if (formRef.current.checkValidity()) {
      setIsLoading(true)
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

      const customerData = createCustomerData(userInputs, POIName, POIUrl, POAName, POAUrl);
      console.log(customerData);
      const submissionData = {
        customerData: customerData,
      };
      callCamundaWebhook(submissionData);
      setIsLoading(false)
      setFormSubmitted(true);
    } else {
      console.log("fill in required fields");
      formRef.current.reportValidity();
    }
  };
  return (
    <div className={isLoading ? 'loading-cursor' : ''}>
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
          <div className="form-container">
            {/* Wrapper for layout */}
            <div className="form-column">
              {/* Column 1 */}
              <TextInput
                placeholder="Enter First Name"
                label="First Name"
                name="firstName"
                value={userInputs.firstName}
                onChange={handleChange}
              />
              <TextInput
                placeholder="Enter Last Name(s)"
                label="Last Name"
                name="lastName"
                value={userInputs.lastName}
                onChange={handleChange}
              />
              <DateInput
                label="Date of Birth"
                name="dateOfBirth"
                dateBefore={eighteenYearsAgo}
                dateAfter={hundredYearsAgo}
                date={userInputs.dateOfBirth}
                errorMessage="Invalid date selection"
                onChange={(date) =>
                  setUserInputs({ ...userInputs, dateOfBirth: date })
                }
              />
              <PhoneInputComponent
                name="phone"
                value={userInputs.phone}
                onChange={handlePhoneChange}
              />
              <EmailInput
                name="emailAddress"
                label="Email"
                value={userInputs.email}
                onChange={handleChange}
              />
              <div className="input-line">
                <DropdownInput
                  label="Loan Type"
                  name="loanType"
                  value={userInputs.loanType || ""}
                  options={loanTypeLookup}
                  onChange={handleChange}
                  idKey="loanTypeID"
                  returnIdKey={true}
                />
              </div>
              <div className="input-line">
                <CurrencyInput
                  name="loanAmount"
                  label="Loan Amount"
                  value={userInputs.loanAmount}
                  onChange={handleCurrencyChange}
                />
              </div>
            </div>
            <div className="form-column">
              {/* Column 2 */}
              <AddressInput
                name="address"
                value={userInputs.address}
                onChange={(address) =>
                  setUserInputs({ ...userInputs, address })
                }
              />
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
          </div>
          <div>
            <hr></hr>
            <h2>Proof Of Address</h2>
            <FileUpload
              acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
              onUpload={handleFileUpload}
              errorMessage="Invalid file type. Please upload JPEG, PNG, or PDF files."
              fieldName="proofOfAddress"
              instructions={proofOfAddressInstructions}
            />
            <hr></hr>
            <h2>Proof Of Income</h2>
            <FileUpload
              acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
              onUpload={handleFileUpload}
              errorMessage="Invalid file type. Please upload JPEG, PNG, or PDF files."
              fieldName="proofOfIncome"
              instructions={proofOfIncomeInstructions}
            />
            <div className="button-container">
              <button type="submit" onClick={handleSubmit} >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default App;
