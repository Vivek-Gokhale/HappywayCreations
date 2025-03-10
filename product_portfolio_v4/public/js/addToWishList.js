import { fetchWishProducts } from "./buttonSetup.js";
import { getWishProductFromLS } from "./getWishProductFromLS.js";
import { showToast } from "./showToast.js";
import { updateWishValue } from "./updateWishListValue.js";



  
 

export const addToWishList = async (evt, id, stock, userEmail) => {
  const currentProdElem = document.querySelector(`#card${id}`);
  let quantity = currentProdElem.querySelector(".productQuantity").innerText;
    const newElement = document.createElement('i');
    newElement.className = 'fa-solid fa-heart fa-2xl';
    newElement.style.color = 'red';
    evt.target.replaceWith(newElement);

    try {
        const response = await fetch('https://happywaycreations.147.93.106.209.nip.io/add-to-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, productId: id, quantity })
        });

        if (response.ok) {
            const result = await response.text();
            showToast("wish", id);

           
            fetchWishProducts();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add item to wishlist');
        }
    } catch (error) {
        console.error('Error adding item to wishlist:', error.message);
        // Handle error scenario (e.g., show error message)
    }

    // Optionally update local storage or perform any other actions
};
