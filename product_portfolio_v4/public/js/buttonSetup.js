import { getCartProductFromLS } from './getCartProductFromLS.js';
import { getWishProductFromLS } from './getWishProductFromLS.js';
import { isLoggedIn } from './loginStatus.js';
import { updateCartValue } from './updateCartValue.js';
import { updateWishValue } from './updateWishListValue.js';

let headerButtons = document.querySelector('.header-buttons');

export const logInLogoutSet = () => {
    if (!headerButtons) return; // Guard clause to prevent null reference

    if (!isLoggedIn()) {
        headerButtons.innerHTML = `<a href="login.html" class="auth login-btn">LOGIN</a>`;
    } else {
        headerButtons.innerHTML = `
            <a href="https://wa.me/1234567890" target="_blank" class="auth whatsapp-btn">
                <i class="fab fa-whatsapp"></i>
            </a>
            <a href="profile.html" class="auth profile-btn">
                <i class="fas fa-user"></i>
            </a>
            <a href="wishList.html" class="auth wishlist-btn">
                <i class="fas fa-heart"></i><span class="wishlist-count">0</span>
            </a>
            <a href="addToCart.html" class="auth cart-btn">
                <i class="fas fa-shopping-cart"></i><span class="cart-count">0</span>
            </a>
            <a href="javascript:void(0)" class="auth login-btn" onclick="handleLogout()">LOGOUT</a>
        `;

        // Only fetch products if user is logged in
        fetchCartProducts();
        fetchWishProducts();
    }
};

// Update window.handleLogout to use the one from auth.js
window.handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    logInLogoutSet(); // Update buttons immediately
    window.location.href = 'login.html';
};

document.addEventListener('DOMContentLoaded', () => {
    logInLogoutSet();
});

export const fetchCartProducts = async () => {
    let cartProductLS = await getCartProductFromLS();
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cartProductLS ? cartProductLS.length : '0';
    }
};

export const fetchWishProducts = async () => {
    let wishProductLS = await getWishProductFromLS();
    const wishCount = document.querySelector('.wishlist-count');
    if (wishCount) {
        wishCount.textContent = wishProductLS ? wishProductLS.length : '0';
    }
};

// Update counts when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        fetchCartProducts();
        fetchWishProducts();
    }
});
