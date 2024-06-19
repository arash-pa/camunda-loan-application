import React, { useCallback, useState } from "react";
import "./FileUpload.css";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage, AiFillIdcard } from "react-icons/ai";
import { FaRegFilePdf } from "react-icons/fa";

const FileUpload = ({
  onUpload,
  errorMessage,
  fieldName,
  selectedFile,
  fileName,
  validationError,
  index,
  setUserInputs,
  userInputs,
}) => {
  return (
    <main>
      <section
        className="upload-form"
        onClick={() => {
          document.querySelector("#" + fieldName).click();
        }}
      >
        <input
          type="file"
          id={fieldName}
          required={true}
          onChange={(event) => {
            console.log(event);
            onUpload(event, fieldName, index);
          }}
          className="input-field"
          hidden
        />
        {selectedFile ? (
          <FaRegFilePdf size={60} color="#4c6688" />
        ) : (
          <>
            <MdCloudUpload color="#4c6688" size={60} />
            <p style={{color: "#4c6688"}}>Browse Files</p>
          </>
        )}
      </section>
      <section className="uploaded-row">
        <span className="upload-content">
          <p>{fileName ?? "No File Uploaded"}</p>
        </span>
        <span
          className={fileName ? "delete-section":"delete-section-disabled"}
          onClick={() => {
            setUserInputs({ ...userInputs, [fieldName]: null });
          }}
        >
          <MdDelete size={20} color="white" />
        </span>
      </section>
      {validationError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </main>
  );
};

export default FileUpload;
