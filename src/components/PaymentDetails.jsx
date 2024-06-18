import React, { useState, useEffect } from "react";
import "./AddressInput.css";

const PaymentDetails = ({ userInputs, onChange }) => {

  return (
    <div className="address-form">
      <div className="input-line">
        <label htmlFor="nameOnCard">Name On Card</label>
        <input
          type="text"
          placeholder="Enter Name on Card"
          id="nameOnCard"
          name="nameOnCard"
          value={userInputs.paymentDetails.nameOnCard}
          onChange={onChange}
          required={true}
        />
      </div>

      <div className="input-line">
        <label htmlFor="cardNo">Card Number</label>
        <input
          type="text"
          placeholder="Enter Card Number"
          id="cardNo"
          name="cardNo"
          value={userInputs.paymentDetails.cardNumber}
          onChange={onChange}
          required={true}
        />
      </div>

      <div className="input-line">
        <label htmlFor="nameOnCard">Sort Code</label>
        <input
          type="text"
          placeholder="Enter Sort Code"
          id="sortCode"
          name="sortCode"
          value={userInputs.paymentDetails.sortCode}
          onChange={onChange}
          required={true}
        />
      </div>
    </div>
  );
};

export default PaymentDetails;
