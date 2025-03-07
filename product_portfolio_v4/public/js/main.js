

import { showProductContainer } from "./homeProductCards.js";
import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { updateCartValue } from "./updateCartValue.js";
import { getWishProductFromLS } from "./getWishProductFromLS.js";
import { updateWishValue } from "./updateWishListValue.js";

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


 

  //   document.addEventListener('DOMContentLoaded', () => {
  //     const productLink = document.querySelector('.nav-link[href="products.html"]');
  
  //     if (productLink) {
  //         productLink.addEventListener('click', (event) => {
  //             event.preventDefault(); // Prevent default page reload
              
  //             fetch('/products')
  //                 .then(response => response.text())
  //                 .then(html => {
  //                     document.body.innerHTML = html; // Replace current content with new page
  //                     history.pushState(null, '', '/products'); // Update URL
  //                 })
  //                 .catch(error => console.error('Error loading products page:', error));
  //         });
  //     }
  // });
  
// let cartProductLS = getCartProductFromLS();





