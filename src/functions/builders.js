import { formatDate } from "./formats";

export function generateCardNumber() {
  function generateSegment() {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
  }

  return [
    generateSegment(),
    generateSegment(),
    generateSegment(),
    generateSegment(),
  ].join("-");
}

export function generateSortCode(region) {
  const prefix = region === "England" ? "30" : "31";
  const segment1 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const segment2 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");

  return `${prefix}-${segment1}-${segment2}`;
}

export function createCustomerData(data, POIName, POIUrl, POAName, POAUrl) {
  const today = new Date();

  const createCaseData = (data, today) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Calculate tomorrow's date

    return {
      fk_caseStatusID: 1, // hardcoded to new case
      fk_loanTypeID: parseInt(data.loanType, 10),
      loanAmount: data.loanAmount.currency + " " + data.loanAmount.amount,
      renewalFrequency: "Daily",
      nextRenewalDate: formatDate(tomorrow),
      caseSupportingDocument:[
        {
          fk_documentTypeID: 1,
          documentName: POIName,
          documentBase64OrURL: POIUrl,
          fk_createdByUserID: 1,
          createdOn: formatDate(today),
          fk_modifiedByUserID: 1,
          modifiedOn: formatDate(today),
          isActive: true,
        },
        {
          fk_documentTypeID: 2,
          documentName: POAName,
          documentBase64OrURL: POAUrl,
          fk_createdByUserID: 1,
          createdOn: formatDate(today),
          fk_modifiedByUserID: 1,
          modifiedOn: formatDate(today),
          isActive: true,
        }
      ],
      fk_createdByUserID: 1,
      createdOn: formatDate(today),
      fk_modifiedByUserID: 1,
      modifiedOn: formatDate(today),
      isActive: true,
    };
  };

  const createPaymentDetails = (data) => {
    return {
      nameOnCard: data.firstName + " " + data.lastName,
      cardNumber: generateCardNumber(),
      sortCode: generateSortCode((region = data.address.region)),
      isActive: true,
    };
  };

  return {
    case: createCaseData(data, today),
    customerPaymentDetail: createPaymentDetails(data),
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: formatDate(data.dateOfBirth),
    address: data.addressFull,
    fk_employmentTypeID: parseInt(data.employmentType, 10),
    fk_housingStatusID: parseInt(data.housingStatus, 10),
    email: data.emailAddress,
    phoneNo: data.phone,
    fk_createdByUserID: 1, // Hardcoded to system
    createdOn: formatDate(today),
    fk_modifiedByUserID: 1,
    modifiedOn: formatDate(today),
    isActive: true,
  };
}
