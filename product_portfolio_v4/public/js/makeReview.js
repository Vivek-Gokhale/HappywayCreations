const selectedFiles = [];
let rating = 0;
let PID = 0;
let OID = 0;

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
        if (!response.ok) throw new Error('Network response was not ok');
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

    const {
        product_description: description,
        product_id: id,
        product_image: image,
        product_name: name,
    } = product;

    document.querySelector(".productReviewImg").src = image[1] || image[0];
    document.querySelector(".productDesp").textContent = description;
    document.querySelector(".productName").textContent = name;
    document.querySelector(".singleProdLink").href = `singleProductPage.html?id=${id}`;
    PID = id;
};

document.querySelector('.custom-file-upload').addEventListener('click', () => {
    document.getElementById('media').click();
});

document.getElementById('media').addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    const imgContainer = document.querySelector('.imgContainer');

    files.forEach((file) => {
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
                const fileIndex = selectedFiles.indexOf(file);
                if (fileIndex > -1) selectedFiles.splice(fileIndex, 1);
            };

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);
            imgContainer.appendChild(imgWrapper);
        };

        reader.readAsDataURL(file);
    });
});

document.getElementById('reviewForm').addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const reviewText = document.getElementById('review').value;
    const reviewHeadline = document.getElementById('headline').value;
    const wordCount = reviewText.split(/\s+/).length;

    if (wordCount < 1) {
        document.getElementById('wordCountMessage').style.display = 'block';
        return;
    } else {
        document.getElementById('wordCountMessage').style.display = 'none';
    }

    const formData = new FormData();
    formData.append("headline", reviewHeadline);
    formData.append("review", reviewText);
    formData.append("rating", rating);

    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        console.error('No userEmail found in session storage');
        return;
    }

    formData.append('userEmail', userEmail);
    formData.append('product_id', PID);
    formData.append('order_id', OID);

    selectedFiles.forEach((file) => {
        formData.append('media', file);
    });

    try {
        const response = await fetch('http://localhost:3000/uploadReview', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload review');

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

function clearRating() {
    rating = 0;
    document.querySelectorAll(".rating-group .star").forEach((star) => {
        star.innerHTML = '<i class="fa-regular fa-star"></i>';
    });
}

document.querySelectorAll(".rating-group .star").forEach((star) => {
    star.addEventListener("click", () => {
        rate(parseInt(star.getAttribute("data-value")));
    });
});

document.getElementById("clearButton").addEventListener("click", clearRating);
