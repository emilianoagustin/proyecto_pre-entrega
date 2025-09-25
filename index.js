/**
 * Argumentos que recibe el script npm run start:
 * todos los productos: GET products
 * un producto especifico: GET products/:id
 * crear producto: POST products <title> <price> <category>
 * eliminar un producto: DELETE products/:id
 *
 * Respuesta que se espera:
 * GET products: mostrar la lista completa de productos por consola
 * GET products/:id: mostrar el producto buscado por consola
 * POST: agregar el producto y mostrarlo en consola
 * DELETE: eliminar producto especifico y mostrar la respuesta en consola
 */

let products, productId;

const URL = "https://fakestoreapi.com/products";
const args = process.argv.slice(2);
const method = args[0].toUpperCase();
args[1].includes("/") ? (productId = args[1].slice(9)) : (products = args[1]);
const productTitle = args[2];
const productPrice = args[3];
const productCategory = args[4];

async function getProducts() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.log("Application stopped with the following error --->", error);
  } finally {
    console.log("Request ended");
  }
}

async function getProduct(productId) {
  try {
    const response = await fetch(`${URL}/${productId}`);
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.log("Application stopped with the following error --->", error);
  } finally {
    console.log("Request ended");
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${URL}/${productId}`, { method: "DELETE" });
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.log("Application stopped with the following error --->", error);
  } finally {
    console.log("Request ended");
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
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.log("Application stopped with the following error --->", error);
  } finally {
    console.log("Request ended");
  }
}

switch (method) {
  case "GET":
    if (productId) getProduct(productId);
    else getProducts();
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
