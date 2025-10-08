let products, productId, jsonData;

// CONSTANTS
const DB = "db.json";
const URL = "https://fakestoreapi.com/products";

// ARGUMENTS

let [, , initialMethod, resource, ...params] = process.argv;
const method = initialMethod.toUpperCase();
let id = null;

if (resource.includes("/")) {
  let charIndex = resource.indexOf("/");
  let resourceCopy = resource;
  resource = resource.slice(0, charIndex).toLowerCase();
  id = resourceCopy.slice(charIndex + 1);
}

// ERROR HANDLER METHOD
async function fetchErrorHandler(response) {
  const errorData = await response.json().catch(() => null);
  const errorMessage =
    errorData && errorData.message ? errorData.message : response.statusText;
  throw new Error(`Error HTTP: ${response.status} - ${errorMessage}`);
}

// CRUD METHODS
async function getProducts() {
  try {
    const response = await fetch(URL);
    if (!response.ok) await fetchErrorHandler(response);
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.error(
      "Application stopped with the following error --->",
      error.message
    );
  } finally {
    console.log("GET request ended");
  }
}

async function getProduct(productId) {
  try {
    const response = await fetch(`${URL}/${productId}`);
    if (!response.ok) await fetchErrorHandler(response);
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.error(
      "Application stopped with the following error --->",
      error.message
    );
  } finally {
    console.log("GET/id request ended");
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${URL}/${productId}`, { method: "DELETE" });
    if (!response.ok) await fetchErrorHandler(response);
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.error(
      "Application stopped with the following error --->",
      error.message
    );
  } finally {
    console.log("DELETE request ended");
  }
}

async function createProduct([title, price, category]) {
  const product = { title, price: Number(price), category };
  const config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  };

  try {
    const response = await fetch(URL, config);
    if (!response.ok) await fetchErrorHandler(response);
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.error(
      "Application stopped with the following error --->",
      error.message
    );
  } finally {
    console.log("POST request ended");
  }
}

switch (method) {
  case "GET":
    if (resource === "products") {
      if (id) await getProduct(id);
      else await getProducts();
    } else console.log("Error: Some argument is missing or misspelled");
    break;
  case "DELETE":
    if (resource === "products") deleteProduct(id);
    else console.log("Error: Some argument is missing or misspelled");
    break;
  case "POST":
    if (resource === "products") createProduct(params);
    else console.log("Error: Some argument is missing or misspelled");
    break;
  default:
    console.log("Error: You entered an invalid method");
    break;
}
