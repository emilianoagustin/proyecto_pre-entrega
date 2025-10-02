let products, productId, jsonData;

const DB = "db.json";
const URL = "https://fakestoreapi.com/products";
const args = process.argv.slice(2);
const method = args[0].toUpperCase();
args[1].includes("/") ? (productId = args[1].slice(9)) : (products = args[1]);
const productTitle = args[2];
const productPrice = Number(args[3]);
const productCategory = args[4];

async function fetchErrorHandler(response) {
  const errorData = await response.json().catch(() => null);
  const errorMessage =
    errorData && errorData.message ? errorData.message : response.statusText;
  throw new Error(`Error HTTP: ${response.status} - ${errorMessage}`);
}

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

async function createProduct(title, price, category) {
  const product = { title, price, category };
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
    if (productId) await getProduct(productId);
    else await getProducts();
    break;
  case "DELETE":
    deleteProduct(productId);
    break;
  case "POST":
    createProduct(productTitle, productPrice, productCategory);
    break;
  default:
    console.log("default case");
    break;
}
