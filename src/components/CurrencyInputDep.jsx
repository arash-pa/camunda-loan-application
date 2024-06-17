import React, { useState, useEffect } from "react";
import DropdownInput from "./DropdownInput";
import { currencyOptions } from "../../data/data";

const CurrencyInputDep = ({ name, label, value, onChange, error }) => {
  const [currency, setCurrency] = useState(value.currency || "GBP");
  const [amount, setAmount] = useState(value.amount || "");

  const handleCurrencyChange = (selectedCurrency) => {
    console.log(selectedCurrency.target.value);
    setCurrency(selectedCurrency.target.value);
    onChange({ currency: selectedCurrency.target.value, amount });
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    onChange({ currency, amount: event.target.value });
  };

  useEffect(() => {
    setCurrency(value.currency || "GBP");
    setAmount(value.amount || "");
  }, [value]);

  return (
    <div className="currency-input-container">
      <div className="input-and-dropdown">
        <select
          options={currencyOptions}
          value={currency}
          onChange={handleCurrencyChange}
          name={name}
          returnIdKey={true}
        />
        <input
          type="number"
          placeholder="Enter Loan Amount"
          id={name}
          name={name}
          value={value.amount}
          onChange={handleAmountChange}
          required={true}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default CurrencyInputDep;
