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

import { writeFile, readFile, stat } from "node:fs/promises";

let products, productId, jsonData;

const DB = "db.json";
const URL = "https://fakestoreapi.com/products";
const args = process.argv.slice(2);
const method = args[0].toUpperCase();
//TO USE WITH METHODS THAT MAKES CALLS TO THE API
// args[1].includes("/") ? (productId = args[1].slice(9)) : (products = args[1]);
args[1].includes("/")
  ? (productId = Number(args[1].slice(9)))
  : (products = args[1]);
const productTitle = args[2];
const productPrice = Number(args[3]);
const productCategory = args[4];

const isEmptyDB = async () => (await stat(DB)).size === 0;

async function fetchErrorHandler(response) {
  const errorData = await response.json().catch(() => null);
  const errorMessage =
    errorData && errorData.message ? errorData.message : response.statusText;
  throw new Error(`Error HTTP: ${response.status} - ${errorMessage}`);
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) await fetchErrorHandler(response);
    const data = await response.json();
    writeFile(DB, JSON.stringify(data), "utf8", (err) => {
      if (err) throw new Error("There was an error writing the data:", err);
      console.log("The file has been saved!");
    });
  } catch (error) {
    console.error(
      "Fetching data stopped with the following error --->",
      error.message
    );
  }
}

// METHODS WHICH READS DATA FROM LOCAL JSON FILE
async function readData(file, id) {
  try {
    const fileData = await readFile(file, "utf8");
    jsonData = JSON.parse(fileData);
    if (id) {
      let product = jsonData.find((prod) => prod.id === id);
      console.log(`Product: ${product.title}`);
      console.table(product);
    } else {
      jsonData.forEach((product) => {
        console.log(`Product: ${product.title}`);
        console.table(product);
      });
    }
  } catch (error) {
    if (id) {
      console.error(
        `Reading data from product with the id: ${id} stopped with the following error --->`,
        error.message
      );
    } else {
      console.error(
        "Reading data stopped with the following error --->",
        error.message
      );
    }
  } finally {
    if (id) console.log(`Reading data from product with the id: ${id} ended.`);
    else console.log("Reading all data ended.");
  }
}

// METHODS WHICH MAKES FETCHING TO THE API
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
    console.log("Request ended");
  }
}

async function getProduct(productId) {
  try {
    const response = await fetch(`${URL}/${productId}`);
    const data = await response.json();
    console.table(data);
  } catch (error) {
    console.error(
      "Application stopped with the following error --->",
      error.message
    );
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
    console.error(
      "Application stopped with the following error --->",
      error.message
    );
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
    console.error(
      "Application stopped with the following error --->",
      error.message
    );
  } finally {
    console.log("Request ended");
  }
}

if (await isEmptyDB()) await fetchData(URL);

switch (method) {
  case "GET":
    if (productId) await readData(DB, productId);
    else await readData(DB);
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
