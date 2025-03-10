import { fetchCartProducts } from "./buttonSetup.js";
import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { showToast } from "./showToast.js";
import { updateCartProductTotal } from "./updateCartProductTotal.js";
import { updateCartValue } from "./updateCartValue";





export const removeProductFromCart = async (id, userEmail) => {
    try {
        const response = await fetch('https://www.happywaycreations.com/remove-from-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: id, userEmail: userEmail })
        });

        if (!response.ok) {
            throw new Error('Failed to remove product from cart');
        }

        // Assuming the cart products are stored in localStorage
        let cartProducts = getCartProductFromLS();
      

        let removeDiv = document.getElementById(`card${id}`);

        if (removeDiv) {
            removeDiv.remove();
            showToast("removed");
        }

        fetchCartProducts();
        updateCartProductTotal();
    } catch (error) {
        console.error(error);
        showToast("error", error.message);
    }
};
