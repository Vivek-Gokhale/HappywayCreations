const selectedFiles = [];
let rating = 0;
let PID = 0;
let OID = 0;
const productReviewImg = document.querySelector(".productReviewImg");
const productName = document.querySelector(".productName");
const productDesp = document.querySelector(".productDesp");
const singleProdLink = document.querySelector(".singleProdLink");
const reviewForm = document.getElementById('reviewForm');
const formData = new FormData(reviewForm); // Initialize FormData


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('pid');
    const orderId = urlParams.get('oid');
    OID = Number(orderId);

    if (productId) {
        displayProductDetails(productId);
    } else {
        console.error('No product ID found in the URL.');
    }
});

const fetchProductById = async (productId) => {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
    }
};

const displayProductDetails = async (productId) => {
    const product = await fetchProductById(productId);
    if (!product) {
        console.error('Product not found');
        return false;
    }
    console.log(product);

    const { product_brand: brand, category_name: category, product_description: description, product_id: id, product_image: image, product_name: name, product_mrp: price, no_of_items: stock, product_discount: discount, tax } = product;
    productReviewImg.src = image[1] || image[0];
    productDesp.textContent = description;
    productName.textContent = name;
    singleProdLink.href = `singleProductPage.html?id=${id}`;
    PID = id;
};

document.querySelector('.custom-file-upload').addEventListener('click', () => {
    document.getElementById('media').click();
});

document.getElementById('media').addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    const imgContainer = document.querySelector('.imgContainer');

    files.forEach((file, index) => {
        selectedFiles.push(file);
        const reader = new FileReader();

        reader.onload = (e) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'imgWrapper';

            const img = document.createElement('img');
            img.src = e.target.result;

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = 'X';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => {
                imgWrapper.remove();
                selectedFiles.splice(index, 1);
                
            };

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);
            imgContainer.appendChild(imgWrapper);
        };

        reader.readAsDataURL(file);
    });
});




reviewForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const reviewText = document.getElementById('review').value;
    const reviewHeadline = document.getElementById('headline').value;
    
    const wordCount = reviewText.split(/\s+/).length;
    
    if (wordCount < 20) {
        document.getElementById('wordCountMessage').style.display = 'block';
        return;
    } else {
        document.getElementById('wordCountMessage').style.display = 'none';
    }

    formData.delete("headline");
    formData.delete("review");
    formData.append("headline", reviewHeadline);
    formData.append('review', reviewText);
    formData.append('rating', rating);
    console.log(reviewText, reviewHeadline);
   
    
    const userEmail = sessionStorage.getItem('userEmail');
    const product_id = PID;

    if (userEmail) {
        formData.append('userEmail', userEmail);
        formData.append('product_id', product_id);
        formData.append('order_id', OID);

        // Remove existing 'media' entries in formData
        formData.delete('media');

        // Append selectedFiles to formData under 'media' key
        selectedFiles.forEach((file, index) => {
            formData.append(`media`, file);
        });

        console.log(formData);
    } else {
        console.error('No userEmail found in session storage');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/uploadReview', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload review');
        }

        const result = await response.json();
        alert('Review uploaded successfully');
        window.location.href = "orders.html";
    } catch (error) {
        console.error('Error uploading review:', error);
    }
});


function rate(value) {
    rating = value;
    const stars = document.querySelectorAll(".rating-group .star");
    stars.forEach((star) => {
        const starValue = parseInt(star.getAttribute("data-value"));
        if (starValue <= rating) {
            star.innerHTML = '<i class="fa-solid fa-star" style="color:#ffa500"></i>';
        } else {
            star.innerHTML = '<i class="fa-regular fa-star"></i>';
        }
    });
}

// Function to clear ratings
function clearRating() {
    rating = 0;
    const stars = document.querySelectorAll(".rating-group .star");
    stars.forEach((star) => {
        star.innerHTML = '<i class="fa-regular fa-star"></i>';
    });
}

// Add event listener for each star
const stars = document.querySelectorAll(".rating-group .star");
stars.forEach((star) => {
    star.addEventListener("click", function() {
        const value = parseInt(star.getAttribute("data-value"));
        rate(value);
    });
});

// Add event listener for clear button
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearRating);
