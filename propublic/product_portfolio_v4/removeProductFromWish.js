import { fetchWishProducts } from "./buttonSetup";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { showToast } from "./showToast";
import { updateWishValue } from "./updateWishListValue";





export const removeProductFromWish = async (id, userEmail) => {
    try {
        const response = await fetch('http://localhost:3000/remove-from-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: id, userEmail: userEmail })
        });

        if (!response.ok) {
            throw new Error('Failed to remove product from wishlist');
        }

        let wishProducts = getWishProductFromLS();
        let removeDiv = document.getElementById(`card${id}`);

        if (removeDiv) {
            removeDiv.remove();
            showToast("removed");
            fetchWishProducts();
        }

    
    } catch (error) {
        console.error(error);
        showToast("error", error.message);
    }
};
