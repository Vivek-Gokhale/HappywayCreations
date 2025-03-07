import { getProductDetailsFromServer } from "./getProductDetailsFromServer";
import { updateCartValue } from "./updateCartValue";
import { updateWishValue } from "./updateWishListValue";
import { isLoggedIn } from "./loginStatus";
import { incrementDecrementWishlist } from "./incrementDecrementWishlist";
import { addToCartFromWishList } from "./addToCartFromWishlist";
import { removeProductFromWish } from "./removeProductFromWish";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { getCartProductFromLS } from "./getCartProductFromLS";
import { addToCart } from "./addToCart";

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

const fetchAndShowWishProducts = async () => {
  const wishProductLS = await getWishProductFromLS();
  if(wishProductLS.length > 0)
    {
      const productIds = wishProductLS.map(prod => prod.product_id);
      const filterProducts = await getProductDetailsFromServer(productIds);
    
      // Include product_qty from wishProductLS
      const productsWithQty = filterProducts.map(product => {
        const matchedProduct = wishProductLS.find(wishProd => wishProd.product_id === product.product_id);
        return {
          ...product,
          product_qty: matchedProduct ? matchedProduct.product_qty : 0
        };
      });
    
      const cartElement = document.querySelector("#productList"); // Assuming this is the correct container for your wishlist products
      const templateContainer = document.querySelector("#productCartTemplate");
    
      productsWithQty.forEach((curProd) => {
        const { product_id, product_name, product_image, no_of_items, product_mrp, product_qty, product_discount } = curProd;
        
        let productClone = document.importNode(templateContainer.content, true);
    
        const lSActualData = wishProductLS.find(prod => prod.product_id === product_id);
    
        productClone.querySelector("#cardValue").setAttribute("id", `card${product_id}`);
        productClone.querySelector('.productNameLink').dataset.id = product_id;
        productClone.querySelector('.productNameLink').href = `singleProductPage.html?id=${product_id}`;
    
        productClone.querySelector(".productName").textContent = product_name;
        if (no_of_items > 0) {
          productClone.querySelector(".category").textContent = "In Stock";
          productClone.querySelector(".category").style.backgroundColor = "#9aedb6";
        } else {
          productClone.querySelector(".category").textContent = "Not Available";
        }
    
        productClone.querySelector(".productImage").src = product_image[0];
        productClone.querySelector(".productQuantity").textContent = lSActualData.product_qty;
    
        // Calculate and display the price considering the discount
        let finalPrice = Number(product_mrp);
        let singleProductFinalPrice = finalPrice;
        if (product_discount) {
          finalPrice = product_mrp - (product_mrp * product_discount / 100);
          singleProductFinalPrice = finalPrice;
        }
        finalPrice = finalPrice * product_qty;
    
        productClone.querySelector(".product-price").textContent = "₹" + finalPrice.toFixed(2);
    
        // Handle increment and decrement button
        productClone.querySelector(".stockElement").addEventListener("click", (event) => {
          incrementDecrementWishlist(event, product_id, no_of_items, Number(singleProductFinalPrice));
        });
    
        productClone.querySelector(".add-to-cart-button-from-wishlist").addEventListener("click", (event) => {
          addToCart(event, product_id,sessionStorage.getItem('userEmail'));
        });
    
        productClone.querySelector(".remove-to-wishlist-button").addEventListener("click", () => {
          removeProductFromWish(product_id, sessionStorage.getItem('userEmail'));
        });
    
        cartElement.appendChild(productClone);
      });
    
    }

  };

if (isLoggedIn()) {
  fetchAndShowWishProducts();
}
