import { getCartProductFromLS } from "./getCartProductFromLS";
import { updateCartProductTotal } from "./updateCartProductTotal";
import { updateCartValue } from "./updateCartValue";
import { showToast } from "./showToast";

export const incrementDecrement = async (event, id, stock, price) => {
  const currentCardElement = document.querySelector(`#card${id}`);
  const productQuantity = currentCardElement.querySelector(".productQuantity");
  const productPrice = currentCardElement.querySelector(".product-price");
  
  let quantity = Number.parseInt(productQuantity.textContent);
  let action = event.target.className;

  if (action === "cartIncrement" && quantity < stock) {
    quantity += 1;
  } else if (action === "cartDecrement" && quantity > 1) {
    quantity -= 1;
  }

  try {
    const response = await fetch('http://localhost:3000/update-cart-quantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: id, userEmail: sessionStorage.getItem('userEmail'), quantity: quantity })
    });

    if (!response.ok) {
      throw new Error('Failed to update cart quantity');
    }

    // Update local storage with the new quantity
   
    // Reflect the changes on the screen
    productQuantity.innerText = quantity;
    productPrice.innerText = "₹" + (price * quantity).toFixed(2);

    updateCartProductTotal();
    
    
    
  } catch (error) {
    console.error(error);
   
  }
};
