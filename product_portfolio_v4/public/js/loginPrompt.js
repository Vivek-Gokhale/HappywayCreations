import { isLoggedIn } from './loginStatus.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.login');

    if (loginButton) {
        loginButton.addEventListener('click', (event) => {
            event.preventDefault();
            const currentUrl = window.location.href;
            sessionStorage.setItem('redirectAfterLogin', currentUrl);
            window.location.href = 'login.html';
        });
    }

    // Protect restricted pages
    const restrictedPages = ['orders.html', 'profile.html', 'wishList.html', 'addToCart.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (restrictedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = 'login.html';
    }
});
