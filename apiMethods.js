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

export const methods = {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
};
