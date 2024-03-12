async function uploadAppianFile(file) {
  const options = {
    method: "POST",
    headers: {
      "Appian-Document-Name": file.name,
    },
    body: file,
  };
  console.log(options);
  try {
    const response = await fetch(
      "https://5g3m2m0yca.execute-api.us-east-1.amazonaws.com/dev/appian-upload",
      options
    );
    console.log(response);
    return response; // Return the raw API response
  } catch (error) {
    console.error("Error calling Appian Web API:", error);
    throw error;
  }
}

export default uploadAppianFile;
