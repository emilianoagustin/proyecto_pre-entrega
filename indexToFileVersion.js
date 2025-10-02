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

const baseProduct = {
  id: 0,
  title: "default",
  price: 0,
  description: "default",
  category: "default",
  image: "default",
  rating: { rate: 0, count: 0 },
};

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

async function saveData(DB, data) {
  await writeFile(DB, JSON.stringify(data), "utf8", (err) => {
    if (err) throw new Error("There was an error writing the data:", err);
    console.log("The file has been saved!");
  });
}

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
    await saveData(DB, data);
  } catch (error) {
    console.error(
      "Fetching data stopped with the following error --->",
      error.message
    );
  }
}

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

async function deleteProductData(file, id) {
  try {
    const fileData = await readFile(file, "utf8");
    jsonData = JSON.parse(fileData);
    let product = jsonData.find((prod) => prod.id === id);
    if (!product)
      return console.log(`The product with the id ${id} does not exists.`);
    let filteredProducts = jsonData.filter((prod) => prod.id !== id);
    await saveData(file, filteredProducts);
    console.log(`Deleted product with id: ${id}`);
    console.table(product);
    console.log(`Updated product list`);
    console.table(await readData(file));
  } catch (error) {
    console.error(
      "An error ocurred trying to delete the product --->",
      error.message
    );
  } finally {
    console.log("Delete process ended.");
  }
}

async function newProduct(file, title, price, category) {
  try {
    const fileData = await readFile(file, "utf8");
    jsonData = JSON.parse(fileData);
    const product = {
      ...baseProduct,
      id: jsonData[jsonData.length - 1].id + 1,
      title,
      price,
      category,
    };
    jsonData.push(product);
    await saveData(file, jsonData);
    await readData(file);
  } catch (error) {
    console.log(`An error ocurred creating the new product: ${error.message}`);
  } finally {
    console.log("The process to create a new product has ended.");
  }
}

if (await isEmptyDB()) await fetchData(URL);

switch (method) {
  case "GET":
    if (productId) await readData(DB, productId);
    else await readData(DB);
    break;
  case "DELETE":
    await deleteProductData(DB, productId);
    break;
  case "POST":
    await newProduct(DB, productTitle, productPrice, productCategory);
    break;
  default:
    console.log(new Error("An unknown method requested"));
    break;
}
