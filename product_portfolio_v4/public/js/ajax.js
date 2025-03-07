// Utility function to handle AJAX requests
function ajaxRequest(url, method, data, successCallback, errorCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                successCallback(JSON.parse(xhr.responseText));
            } else {
                if (errorCallback) errorCallback(xhr);
            }
        }
    };

    xhr.send(JSON.stringify(data));
}

// Add item to cart
function addToCart(productId, quantity) {
    const url = '/api/cart/add';
    const data = { productId, quantity };

    ajaxRequest(url, 'POST', data, (response) => {
        if (response.success) {
            // Update cart UI
            document.getElementById('cart-count').innerText = response.cartCount;
            alert('Item added to cart successfully!');
        } else {
            alert('Error adding item to cart');
        }
    }, (error) => {
        console.error('Add to cart error:', error);
        alert('Failed to add item to cart');
    });
}

// Fetch product details and display
function fetchProductDetails(productId) {
    const url = `/api/products/${productId}`;

    ajaxRequest(url, 'GET', null, (product) => {
        // Update product UI
        document.getElementById('product-name').innerText = product.name;
        document.getElementById('product-price').innerText = `$${product.price}`;
        document.getElementById('product-description').innerText = product.description;
        document.getElementById('product-stock').innerText = `Stock: ${product.stock}`;
    }, (error) => {
        console.error('Fetch product error:', error);
        alert('Failed to load product details');
    });
}

// Example event listener for adding an item to the cart
document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    const productId = document.getElementById('product-id').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    addToCart(productId, quantity);
});

// Example event listener for fetching product details on page load
document.addEventListener('DOMContentLoaded', () => {
    const productId = document.getElementById('product-id').value;
    fetchProductDetails(productId);
});
