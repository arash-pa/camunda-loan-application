import React from 'react';

const DropdownInput = ({ label, name, value, options, idKey = 'code', nameKey = 'name', returnIdKey=false, onChange, required=true }) => {
  return (
    <div className='input-line'>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} required={required} value={value || ''} onChange={onChange}>
        <option value="">Select an option</option>
        {options.map((option) => {
          // Check if option is an object
          const isObject = typeof option === 'object';

          return (
            <option 
              key={isObject ? option[idKey] : option} 
              value={isObject ? (returnIdKey ? option[idKey] : option[nameKey]) : option}
            >
              {isObject ? option[nameKey] : option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default DropdownInput;
