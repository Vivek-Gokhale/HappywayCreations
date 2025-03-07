import { addToCart } from "./addToCart";
import { homeQuantityToggle } from "./homeQuantityToggle";
import { updateCartProductTotal } from "./updateCartProductTotal";
import { updateCartValue } from "./updateCartValue";
import { getCartProductFromLS } from "./getCartProductFromLS";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { updateWishValue } from "./updateWishListValue";
import { addToWishList } from "./addToWishList";
import { isLoggedIn } from "./loginStatus";
import { redirectToLogin } from "./redirectToLogin";
import { checkWishlistStatus } from "./wishListStatus";
import { buyNow } from "./buyNow";
import { getProductQuantity } from "./getProductQty";

const productContainer = document.querySelector("#productContainer");
const productTemplate = document.querySelector("#productTemplate");

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
      displayProductDetails(productId);
      displayCustomerReview(productId);
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

export const displayProductDetails = async (productId) => {
    productContainer.innerHTML = "";
    const product = await fetchProductById(productId);

    if (!product) {
        console.error('Product not found');
        return false;
    }
    console.log(product);

    const { 
        product_brand: brand, 
        category_name: category, 
        product_description: description, 
        product_id: id, 
        product_image: image, 
        product_name: name, 
        product_mrp: price, 
        no_of_items: stock, 
        product_discount: discount, 
        tax,
        product_color 
    } = product;

    const productClone = document.importNode(productTemplate.content, true);
    const rating = await fetchAverageRating(id) || 0;

    productClone.querySelector("#singleCard").setAttribute("id", `card${id}`);
  
    productClone.querySelector(".category").textContent = category;
    productClone.querySelector(".productName").textContent = name;
    productClone.querySelector(".brandName").textContent = brand;
    productClone.querySelector(".tax").value = tax;
    productClone.querySelector(".productStock").textContent = stock;
    productClone.querySelector(".productDescription").textContent = description;
    productClone.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
    
    let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
    productClone.querySelector(".productPrice").textContent = sellingPrice;

    if (discount != 0) {
        productClone.querySelector(".productActualPrice").textContent = `₹${price}`;
        productClone.querySelector('.discountPr').textContent = `${discount}% off`;
    } else {
        productClone.querySelector('.discountPr').style.background = 'none';
    }

    const swiperWrapper = document.querySelectorAll(".swiper-wrapper");
    swiperWrapper.forEach((currSwipper) => {
        image.forEach(imgSrc => {
            currSwipper.innerHTML += `<div class='swiper-slide'><img src="${imgSrc}" /></div>`;
        });
    });

    productClone.querySelector(".stockElement").addEventListener("click", (event) => {
        homeQuantityToggle(event, id, stock);
    });

    const wishListButton = productClone.querySelector(".wish-list-button");
    const wishListIcon = wishListButton.querySelector('i');
    checkWishlistStatus(id, wishListIcon);

    if (product_color.length >= 1) {
        // Set the text content of the productColor element
        console.log(product_color);
        productClone.querySelector(".productColor").textContent = "Colors";
      
        // Get the productColorGrid element
        const productColorGrid = productClone.querySelector(".productColorGrid");
      
        // Iterate over the product_color array
        product_color.forEach(color => {
          // Create a new label element
          const label = document.createElement("label");
          label.classList.add("product-color-option");
      
          // Create the input element
          const input = document.createElement("input");
          input.type = "radio";
          input.name = "color";
          input.value = color;
      
          // Create the div element for the color circle
          const div = document.createElement("div");
          div.classList.add("color-circle", `color-${color}`);
          div.style.backgroundColor = color; // Set the background color based on the color name
      
          // Append the input and div to the label
          label.appendChild(input);
          label.appendChild(div);
      
          // Append the label to the productColorGrid
          productColorGrid.appendChild(label);
        });
      }
    const productStockElement = productClone.querySelector(".productStock");

    if (isLoggedIn()) {
        productClone.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
            addToCart(event, id, sessionStorage.getItem('userEmail'));
        });

        productClone.querySelector(".wish-list-button").addEventListener("click", (event) => {
            addToWishList(event, id, stock, sessionStorage.getItem('userEmail'));
        });

        productClone.querySelector(".buy-now").addEventListener("click", (event) => {
            buyNow(event, id, getProductQuantity(), productStockElement); // Pass the element here
        });
    } else {
        productClone.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
        productClone.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
        productClone.querySelector(".buy-now").addEventListener("click", redirectToLogin);
    }

    productContainer.append(productClone);
};


const fetchProductReviews = async (productId) => {
    try {
        const response = await fetch(`http://localhost:3000/getProductReview/${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch product reviews:', error);
        return null;
    }
};

const fetchAverageRating = async (productId) => {
    // console.log("my id " + productId);
    try {
        const response = await fetch(`http://localhost:3000/getProductRating/${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.averageRating;
    } catch (error) {
        console.error('Failed to fetch average rating:', error);
        return null;
    }
};

const displayCustomerReview = async (productId) => {
    const reviewsContainer = document.querySelector("#reviews");
    
    reviewsContainer.innerHTML = ""; // Clear previous reviews

    const reviews = await fetchProductReviews(productId);
    console.log(reviews);
    if (!reviews || reviews.length === 0) {
        console.error('No reviews found for this product');
        reviewsContainer.innerHTML = "<p>No reviews available for this product.</p>";
        return;
    }

    const reviewTemplate = document.querySelector("#review-template").content;

    reviews.forEach(review => {
        const {
            feedback_headline,
            product_rating,
            product_feedback,
            product_review_image,
            first_name,
            last_name
        } = review;
        console.log(product_review_image);
        const reviewClone = document.importNode(reviewTemplate, true);

        reviewClone.querySelector(".author-name").textContent = `${first_name} ${last_name}`;
        reviewClone.querySelector(".stars").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(product_rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - product_rating);
        reviewClone.querySelector(".review-title").textContent = feedback_headline;
        reviewClone.querySelector(".review-body p").textContent = product_feedback;

        const reviewImagesContainer = reviewClone.querySelector(".review-img");
        reviewImagesContainer.innerHTML = ""; // Clear previous images
        const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
        
      
product_review_image.forEach(imgSrc => {
    const imgElement = document.createElement("img");
    imgElement.src = imgSrc;
    imgElement.alt = "Review Image";
    imgElement.className = "review-image";
    reviewImagesContainer.appendChild(imgElement);

    imgElement.addEventListener("click", () => {
        lightbox.style.display = "block";
        lightboxImg.src = imgSrc;
    });
});

lightboxClose.addEventListener("click", () => {
    lightbox.style.display = "none";
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        lightbox.style.display = "none";
    }
});
        reviewsContainer.appendChild(reviewClone);
    });
};


const fetchCartProducts = async () => {
  let cartProductLS = await getCartProductFromLS();
  
  updateCartValue(cartProductLS);
};
fetchCartProducts();

const fetchWishProducts = async () => {
let wishProductLS = await getWishProductFromLS();
updateWishValue(wishProductLS);
};

fetchWishProducts();