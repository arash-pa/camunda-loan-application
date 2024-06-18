import React, { useState } from "react";
import "./FileUpload.css"
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";

const FileUpload = ({
  acceptedTypes,
  onUpload,
  errorMessage,
  fieldName,
  instructions,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(false);

  const handleChange = (event) => {
    const file = event.target.files[0];

    if (acceptedTypes.includes(file.type)) {
      setSelectedFile(file);
      setValidationError(false);
      onUpload(file, fieldName); // Pass the file to the parent component
    } else {
      setSelectedFile(null);
      setValidationError(true);
    }
  };

  return (
    <main>
      <ul style={{ textAlign: "left" }}>
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      <form action="" className="upload-form">
      <input type="file" required={true} onChange={handleChange} />
      </form>
      {validationError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </main>
  );
};

export default FileUpload;
