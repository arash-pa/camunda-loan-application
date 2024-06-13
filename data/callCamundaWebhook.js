export async function callCamundaWebhook(data) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(
      "https://gj0dobamcb.execute-api.eu-west-2.amazonaws.com/camunda/newWebhook",
      requestOptions
    );
    const result = await response.text();
    console.log(result);
    return result; // Return the result for further use
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error for potential handling elsewhere
  }
}
