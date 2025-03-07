import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { getWishProductFromLS } from "./getWishProductFromLS.js";
import { showToast } from "./showToast.js";
import { updateCartValue } from "./updateCartValue.js";
import { removeProductFromWish } from "./removeProductFromWish.js";

export const addToCartFromWishList = async (button, id, stock) => {
  const userEmail = sessionStorage.getItem('userEmail');
  if (!userEmail) return;

  try {
    // First add to cart
    const row = button.closest('tr');
    const quantity = row.querySelector(".productQuantity").innerText;
    const price = row.querySelector(".product-price").innerText.replace("₹", "");

    let cartProducts = getCartProductFromLS();
    let wishlistProducts = await getWishProductFromLS();
    
    // Find the product in wishlist using product_id instead of id
    let wishlistProduct = wishlistProducts.find(product => product.product_id === id);
    
    if (!wishlistProduct) {
      // If not found by product_id, try with id
      wishlistProduct = wishlistProducts.find(product => product.id === id);
    }

    if (!wishlistProduct) {
      throw new Error('Product not found in wishlist');
    }

    // Add to cart logic
    let existingCartProduct = cartProducts.find(product => 
      product.product_id === id || product.id === id
    );

    if (existingCartProduct) {
      // Update existing cart product
      existingCartProduct.product_qty = Number(existingCartProduct.product_qty || existingCartProduct.quantity) + Number(quantity);
      
      cartProducts = cartProducts.map(product => 
        (product.product_id === id || product.id === id) ? existingCartProduct : product
      );
    } else {
      // Add new product to cart
      cartProducts.push({
        product_id: wishlistProduct.product_id || wishlistProduct.id,
        user_id: userEmail,
        product_qty: Number(quantity),
        // Include other necessary product details
        ...wishlistProduct
      });
    }

    // Update cart in localStorage
    localStorage.setItem("cartProductLS", JSON.stringify(cartProducts));
    updateCartValue(cartProducts);

    // Remove from wishlist
    await removeProductFromWish(id, userEmail);

    // Remove the row from UI
    row.remove();

    showToast("success", "Product added to cart");

  } catch (error) {
    console.error('Error:', error);
    showToast("error", "Failed to process request");
  }
};
