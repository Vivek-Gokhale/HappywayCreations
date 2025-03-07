function toggleMenu() {
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger-menu");
    
    if (navbar && hamburger) {
        navbar.classList.toggle("active");
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navbar.classList.contains("active") ? "hidden" : "";
        
        // Reset scroll position of navbar when opened
        if (navbar.classList.contains("active")) {
            navbar.scrollTop = 0;
        }
    }
}

// Function to update navigation based on login status
function updateNavigation() {
    const navbar = document.querySelector(".navbar ul");
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    
    if (!navbar) return;

    // Clear existing navigation
    navbar.innerHTML = '';

    // Main navigation items (always visible)
    const mainLinks = [
        { href: "index.html", text: "HOME" },
        { href: "products.html", text: "PRODUCTS" },
        { href: "events.html", text: "EVENTS" },
        { href: "about.html", text: "ABOUT" },
        { href: "contact.html", text: "CONTACT" }
    ];

    // Add main navigation items
    mainLinks.forEach(link => {
        const li = document.createElement("li");
        li.className = "nav-item";
        const a = document.createElement("a");
        a.href = link.href;
        a.className = "nav-link";
        a.textContent = link.text;
        li.appendChild(a);
        navbar.appendChild(li);
    });

    // Only add these links in mobile view
    if (window.innerWidth <= 768) {
        if (isLoggedIn) {
            // Links for logged-in users
            const userLinks = [
                { href: "wishlist.html", text: "WISHLIST" },
                { href: "addToCart.html", text: "CART" },
                { href: "profile.html", text: "PROFILE" }
            ];

            userLinks.forEach(link => {
                const li = document.createElement("li");
                li.className = "nav-item mobile-only";
                const a = document.createElement("a");
                a.href = link.href;
                a.className = "nav-link";
                a.textContent = link.text;
                li.appendChild(a);
                navbar.appendChild(li);
            });

            // Add logout button
            const logoutLi = document.createElement("li");
            logoutLi.className = "nav-item mobile-only";
            const logoutBtn = document.createElement("button");
            logoutBtn.className = "nav-link logout-btn";
            logoutBtn.textContent = "LOGOUT";
            logoutBtn.onclick = function() {
                sessionStorage.setItem("isLoggedIn", "false");
                window.location.href = "index.html";
            };
            logoutLi.appendChild(logoutBtn);
            navbar.appendChild(logoutLi);
        } else {
            // Add login link for non-logged-in users
            const loginLi = document.createElement("li");
            loginLi.className = "nav-item mobile-only";
            const loginLink = document.createElement("a");
            loginLink.href = "login.html";
            loginLink.className = "nav-link login-link";
            loginLink.textContent = "LOGIN";
            loginLi.appendChild(loginLink);
            navbar.appendChild(loginLi);
        }
    }

    // If in mobile view, adjust the menu height
    if (window.innerWidth <= 768 && navbar.closest('.navbar').classList.contains('active')) {
        const viewportHeight = window.innerHeight;
        const headerHeight = document.querySelector('.section-navbar').offsetHeight;
        const navbarElement = navbar.closest('.navbar');
        
        navbarElement.style.height = `${viewportHeight}px`;
        navbarElement.style.top = `${headerHeight}px`;
        navbar.style.maxHeight = `${viewportHeight - headerHeight - 40}px`;
        navbar.style.overflowY = 'auto';
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger-menu");
    
    if (navbar && hamburger && 
        !navbar.contains(e.target) && 
        !hamburger.contains(e.target) && 
        navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        document.body.style.overflow = "";
    }
});

// Close menu when clicking a nav link (for mobile)
document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.querySelector(".navbar");
        if (navbar && window.innerWidth <= 768) {
            navbar.classList.remove('active');
            document.body.style.overflow = "";
        }
    });
});

function toggleFilters() {
    const filterPanel = document.querySelector(".col-md-2");
    const filterOverlay = document.querySelector(".filter-overlay");
    
    if (filterPanel && filterOverlay) {
        filterPanel.classList.toggle("active");
        filterOverlay.classList.toggle("active");
    }
}

// Close filters when clicking outside
document.addEventListener('click', (e) => {
    const filterPanel = document.querySelector(".col-md-2");
    const filterButton = document.querySelector(".filter-button");
    const filterOverlay = document.querySelector(".filter-overlay");
    
    if (filterPanel && filterButton && filterOverlay && 
        !filterPanel.contains(e.target) && 
        !filterButton.contains(e.target) && 
        filterPanel.classList.contains('active')) {
        filterPanel.classList.remove('active');
        filterOverlay.classList.remove('active');
    }
});

// Add event listener for window resize
window.addEventListener('resize', updateNavigation);

// Call updateNavigation when the page loads
document.addEventListener('DOMContentLoaded', updateNavigation);

// Update navigation when login status changes
window.addEventListener('storage', function(e) {
    if (e.key === 'isLoggedIn') {
        updateNavigation();
    }
});

// Listen for login/logout events to update navigation
document.addEventListener('login', updateNavigation);
document.addEventListener('logout', updateNavigation);

// Add this after your existing code
document.addEventListener('DOMContentLoaded', function() {
    // Handle profile dropdown clicks
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent) {
                dropdownContent.style.display = 
                    dropdownContent.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
});
  
   
