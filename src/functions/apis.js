export async function uploadFileToS3(file, filename) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/pdf");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const formdata = new FormData();
  formdata.append("", file);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  console.log(requestOptions);

  try {
    const response = await fetch(`https://7h4ioutdyk.execute-api.eu-west-2.amazonaws.com/dev/upload?filename=${filename}`,
    requestOptions); 
    if (!response.ok) {
      throw new Error('Network response was not okay');
    }
    const responseData = await response.json(); 
    return responseData;   
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
