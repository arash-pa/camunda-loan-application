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
}) => {
  return (
    <main>
      <section
        className="upload-form"
        onClick={() => {
          document.querySelector(".input-field").click();
        }}
      >
        <input
          type="file"
          id={fieldName}
          required={true}
          onChange={(event) => {
            console.log(event)
            onUpload(event);
          }}
          className="input-field"
          hidden
        />
        {selectedFile ? (
          <FaRegFilePdf size={60} />
        ) : (
          <>
            <MdCloudUpload color="#00bdf0" size={60} />
            <p>Browse Files</p>
          </>
        )}
      </section>
      <section className="uploaded-row">
        <AiFillFileImage color="#00bdf0" />
        <span className="upload-content">
          {fileName} -
          <MdDelete
            onClick={() => {}}
            size={20}
            color="red"
            cursor={"pointer"}
          />
        </span>
      </section>
      {validationError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </main>
  );
};

export default FileUpload;
