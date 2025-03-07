import { fetchWishProducts } from "./buttonSetup";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { showToast } from "./showToast";
import { updateWishValue } from "./updateWishListValue";

export const removeProductFromWish = async (productId, userEmail) => {
    try {
        const response = await fetch('http://localhost:3000/remove-from-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                productId, 
                userEmail 
            })
        });

        if (!response.ok) {
            throw new Error('Failed to remove from wishlist');
        }

        // Remove the product row from UI
        const productRow = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (productRow) {
            productRow.remove();
        }

        // Update wishlist count in UI if needed
        const wishlistValue = document.querySelector('.wishListValue');
        if (wishlistValue) {
            const currentCount = parseInt(wishlistValue.textContent) || 0;
            wishlistValue.innerHTML = ` <i class="fa-solid fa-heart"> ${Math.max(0, currentCount - 1)} </i>`;
        }

        return true;
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        throw error;
    }
};

// Add this new function to handle adding to cart
export const handleAddToCartFromWishlist = async (productId) => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
        // First add to cart
        const cartResponse = await fetch('http://localhost:3000/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                userEmail: userEmail,
                quantity: 1
            })
        });

        if (!cartResponse.ok) {
            throw new Error('Failed to add to cart');
        }

        // Then remove from wishlist
        await removeProductFromWish(productId, userEmail);

    } catch (error) {
        console.error('Error:', error);
        showToast("error", "Failed to add to cart");
    }
};
