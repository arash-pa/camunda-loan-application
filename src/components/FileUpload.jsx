import React, { useState } from "react";
import "./FileUpload.css"
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage, AiFillIdcard } from "react-icons/ai";
import { FaRegFilePdf } from "react-icons/fa";

const FileUpload = ({
  acceptedTypes,
  onUpload,
  errorMessage,
  fieldName,
  uploadedFile
}) => {
  const [selectedFile, setSelectedFile] = useState(uploadedFile);
  const [fileName, setFileName] = useState(uploadedFile?.name ?? "No File Selected")
  const [validationError, setValidationError] = useState(false);

  const handleChange = (event) => {
    const file = event.target.files[0];

    if (acceptedTypes.includes(file.type)) {
      setSelectedFile(file);
      setFileName(file.name)
      setValidationError(false);
      onUpload(file); // Pass the file to the parent component
    } else {
      setSelectedFile(null);
      setValidationError(true);
    }
  };

  return (
    <main>
      <form action="" className="upload-form" onClick={(e) => {
        e.stopPropagation();
        document.querySelector(".input-field").click()
        }}>
      <input type="file" required={true} onChange={handleChange} className="input-field" hidden />
      {selectedFile ?
      <FaRegFilePdf size={60}/> :
      <>
      <MdCloudUpload color="#00bdf0" size={60} />
      <p>Browse Files</p>
      </>}
      </form>
      <section className="uploaded-row">
        <AiFillFileImage color="#00bdf0" />
        <span className="upload-content">
        {fileName} - 
        <MdDelete
        onClick={()=> {
          setFileName("No File Selected")
          setSelectedFile(null)
          }}
        size={20}
        color="red"
        cursor={"pointer"} />
        </span>
      </section>
      {validationError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </main>
  );
};

export default FileUpload;
