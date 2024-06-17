import React, { useState, useEffect } from "react";
import DropdownInput from "./DropdownInput.jsx";
import PostCodeInput from "./PostCodeInput.jsx";
import { europeanCountries, countryRegions } from "../../data/data.js";
import "./AddressInput.css";

const AddressInput2 = ({ value, onChange }) => {
  const [address, setAddress] = useState(value);
  console.log("ADDRESS");
  console.log(value);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(value.country);
  const [selectedRegion, setSelectedRegion] = useState(value.region);

  useEffect(() => {
    setCountries(europeanCountries);
  }, []);

  useEffect(() => {
    setRegions(countryRegions[value.country]);
  }, []);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setAddress({
      ...address,
      region: event.target.value, // Update the 'region' here
    });
    onChange(address); // Notify the parent
  };

  const handleAddressChange = (event) => {
    setAddress({
      ...address,
      [event.target.name]: event.target.value,
    });
    onChange(address); // Notify parent of changes immediately
  };

  return (
    <div className="address-form">
      <div className="input-line">
        <label htmlFor="addressLine2">Address Line 2</label>
        <input
          type="text"
          placeholder="Enter Address Line 2"
          id="addressLine2"
          name="addressLine2"
          value={address.addressLine2}
          onChange={handleAddressChange}
          required={false}
        />
      </div>
      <div className="input-line">
        <label htmlFor="city">City</label>
        <input
          type="text"
          placeholder="Enter City"
          id="city"
          name="city"
          value={address.city}
          onChange={handleAddressChange}
          required={true}
        />
      </div>

      <div className="input-line">
        <DropdownInput
          label="Region"
          name="region"
          value={address.region || ""}
          options={regions}
          onChange={handleRegionChange}
        />
      </div>
    </div>
  );
};

export default AddressInput2;
