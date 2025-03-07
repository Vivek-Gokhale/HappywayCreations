import { isLoggedIn } from "./loginStatus";

export const updateWishValue = (wishProducts,wishListValue) => {
  if(isLoggedIn() && wishProducts && wishListValue)
    {
      return (wishListValue.innerHTML = ` <i class="fa-solid fa-heart"> ${wishProducts.length} </i>`);
    }
 
};
