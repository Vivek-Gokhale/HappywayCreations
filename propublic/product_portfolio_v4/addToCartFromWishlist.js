import { getCartProductFromLS } from "./getCartProductFromLS";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { showToast } from "./showToast";
import { updateCartValue } from "./updateCartValue";

export const addToCartFromWishList = (evt, id, stock) => {
  let arrLocalStorageProduct = getCartProductFromLS();
  let arrLocalStorageWishProduct = getWishProductFromLS();
  const currentProdElem = document.querySelector(`#card${id}`);
  let quantity = currentProdElem.querySelector(".productQuantity").innerText;
  let price = currentProdElem.querySelector(".product-price").innerText;

  price = Number(price.replace("₹", ""));
  quantity = Number(quantity);

  let existingProd = arrLocalStorageProduct.find(
    (curProd) => curProd.id === id
  );
   
  let existingWishProd = arrLocalStorageWishProduct.find(
    (curProd) => curProd.id === id
  ); 

  if (existingProd) {
    // Update the existing product's quantity and price
    const originalPricePerItem = existingProd.price / existingProd.quantity;
    const actualPricePerItem = existingProd.actualPrice / existingProd.quantity;
    const taxPricePerItem = existingProd.taxPrice / existingProd.quantity;
    existingProd.quantity += quantity;
    existingProd.price = Number((originalPricePerItem * existingProd.quantity).toFixed(2));
    existingProd.actualPrice =  Number((actualPricePerItem * existingProd.quantity).toFixed(2));
    existingProd.taxPrice =  Number((taxPricePerItem * existingProd.quantity).toFixed(2));

    arrLocalStorageProduct = arrLocalStorageProduct.map((curProd) =>
      curProd.id === id ? existingProd : curProd
    );

    localStorage.setItem("cartProductLS", JSON.stringify(arrLocalStorageProduct));
    showToast("add", id);
  } else {
    // Add new product to the cart

    const newProduct = existingWishProd;
    arrLocalStorageProduct.push(existingWishProd);
    
    localStorage.setItem("cartProductLS", JSON.stringify(arrLocalStorageProduct));
    showToast("add", id);
  }

  updateCartValue(arrLocalStorageProduct);
};
