import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { getWishProductFromLS } from "./getWishProductFromLS.js";
import { updateCartValue } from "./updateCartValue.js";
import { updateWishValue } from "./updateWishListValue.js";


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

