import { isLoggedIn } from "./loginStatus";


export const updateCartValue = (cartProducts,cartValue) => {
  if(isLoggedIn() && cartProducts && cartValue)
    {
      return (cartValue.innerHTML = ` <i class="fa-solid fa-cart-shopping"> ${cartProducts.length} </i>`);
    }
  
};
