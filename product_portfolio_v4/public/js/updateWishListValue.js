import { isLoggedIn } from "./loginStatus.js";

export const updateWishValue = async (wishProducts, wishListValue) => {
  if (isLoggedIn() && wishListValue) {
    const products = Array.isArray(wishProducts) ? wishProducts : await wishProducts;
    if (products) {
      wishListValue.innerHTML = ` <i class="fa-solid fa-heart"> ${products.length} </i>`;
    }
  }
};
