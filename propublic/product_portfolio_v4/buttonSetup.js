import { getCartProductFromLS } from './getCartProductFromLS';
import { getWishProductFromLS } from './getWishProductFromLS';
import { isLoggedIn } from './loginStatus';
import { updateCartValue } from './updateCartValue';
import { updateWishValue } from './updateWishListValue';

let auth = document.querySelector('.sing_in_up');

export const logInLogoutSet = () => {
    if (!isLoggedIn()) {
        auth.innerHTML = `<button style="outline: none;" class="add-to-cart-button login"><b>LOG IN</b></button>`;
        const loginButton = document.querySelector('.login');
        loginButton.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'login.html';
        });
    } else {
        auth.innerHTML = `
        <a  href="https://web.whatsapp.com/send?phone=9727380992" target="_blank">
        <button id="whatsappBtn" style="outline: none; background:none; border:none;" class="profile">
            <i class="fa-brands fa-whatsapp fa-2xl"></i>
        </button>
        </a>
        <button id="profileButton" style="outline: none; background:none; border:none;" class="profile">
            <i class="far fa-user-circle fa-2xl" style="color:#fff"></i>
        </button>
        <a href="wishList.html" class="wish-list" id="wishValue" style="padding:0 0">
            <i class="fa-solid fa-heart"> 0 </i>
        </a>
        <a href="addToCart.html" class="add-to-cart-button" id="cartValue" style="padding:0 0">
            <i class="fa-solid fa-cart-shopping"> 0 </i>
        </a>
        <button style="outline: none;" class="logout"><b>LOG OUT</b></button>
        `;

        document.getElementById('profileButton').addEventListener('click', function() {
            window.location.href = 'orders.html';
        });

        const logoutButton = document.querySelector('.logout');
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            // Perform logout logic
            sessionStorage.removeItem('isLoggedIn');
            window.location.reload(); // Reload the page to update UI
        });

        // Call fetch functions after updating the inner HTML
        fetchCartProducts();
        fetchWishProducts();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    logInLogoutSet();
});

export const fetchCartProducts = async () => {
    let cartProductLS = await getCartProductFromLS();
    const cartValue = document.querySelector('#cartValue');
    updateCartValue(cartProductLS, cartValue);
};

export const fetchWishProducts = async () => {
    let wishProductLS = await getWishProductFromLS();
    const wishListValue = document.querySelector('#wishValue');
    updateWishValue(wishProductLS, wishListValue);
};
