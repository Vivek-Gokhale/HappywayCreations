// Function to check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('isLoggedIn') === 'true';
}

// Function to update header buttons based on login status
function updateHeaderButtons() {
    const headerButtons = document.querySelector('.header-buttons');
    if (!headerButtons) return;

    if (isLoggedIn()) {
        headerButtons.innerHTML = `
            <a href="https://wa.me/1234567890" target="_blank" class="auth whatsapp-btn">
                <i class="fab fa-whatsapp"></i>
            </a>
            <a href="profile.html" class="auth profile-btn">
                <i class="fas fa-user"></i>
            </a>
            <a href="wishList.html" class="auth wishlist-btn">
                <i class="fas fa-heart"></i><span class="wishlist-count">1</span>
            </a>
            <a href="addToCart.html" class="auth cart-btn">
                <i class="fas fa-shopping-cart"></i><span class="cart-count">0</span>
            </a>
            <a href="javascript:void(0)" class="auth login-btn" onclick="handleLogout()">LOGOUT</a>
        `;
    } else {
        headerButtons.innerHTML = `
            <a href="login.html" class="auth login-btn">LOGIN</a>
        `;
    }
}

// Function to handle logout
function handleLogout() {
    // Clear session storage
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    
    // Update header buttons immediately
    updateHeaderButtons();
}

// Make handleLogout available globally
window.handleLogout = handleLogout;

// Update buttons when page loads and when storage changes
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderButtons();
});

// Listen for storage changes to update buttons across all open pages
window.addEventListener('storage', () => {
    updateHeaderButtons();
}); 