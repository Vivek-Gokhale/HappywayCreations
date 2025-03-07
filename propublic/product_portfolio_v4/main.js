import "./style.css";
import products from "./api/products.json";
import { showProductContainer } from "./homeProductCards";
import { getCartProductFromLS } from "./getCartProductFromLS";
import { updateCartValue } from "./updateCartValue";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { updateWishValue } from "./updateWishListValue";

// Define a function named `showProductContainer` that takes an array of products as input.

  // showProductContainer(products);
const fetchCartProducts = async () => {
    let cartProductLS = await getCartProductFromLS();
    
    updateCartValue(cartProductLS);
};
fetchCartProducts();

const fetchWishProducts = async () => {
  let wishProductLS = await getWishProductFromLS();
  updateWishValue(wishProductLS);
};

fetchWishProducts();



// let cartProductLS = getCartProductFromLS();





