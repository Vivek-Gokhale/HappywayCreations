import { getCartProductFromLS } from "./getCartProductFromLS";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { updateCartValue } from "./updateCartValue";
import { updateWishValue } from "./updateWishListValue";


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

