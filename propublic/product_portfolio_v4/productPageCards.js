// import products from "razorpay/dist/types/products";
import { addToCart } from "./addToCart";
import { addToWishList } from "./addToWishList";
import { buyNow } from "./buyNow";
import { getProductQuantity } from "./getProductQty";
import { homeQuantityToggle } from "./homeQuantityToggle";
import { isLoggedIn } from "./loginStatus";
import { redirectToLogin } from "./redirectToLogin";
import { checkWishlistStatus } from "./wishListStatus";

const productContainer = document.querySelector("#productContainer");
const productTemplate = document.querySelector("#productTemplate");

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

const createImageElements = (images) => {
  const fragment = document.createDocumentFragment();
  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.classList.add('productImage');
    img.src = src;
    img.alt = `Product Image ${index + 1}`;
    if (index === 0) img.style.opacity = '1'; // Show the first image initially
    fragment.appendChild(img);
  });
  return fragment;
};

const addHoverEffect = (imageContainer) => {
  const images = imageContainer.querySelectorAll('.productImage');
  if (images.length === 0) return; // Check if images exist

  let currentImageIndex = 0;
  let hoverInterval;

  imageContainer.addEventListener('mouseenter', () => {
    hoverInterval = setInterval(() => {
      images[currentImageIndex].style.opacity = '0';
      currentImageIndex = (currentImageIndex + 1) % images.length;
      images[currentImageIndex].style.opacity = '1';
    }, 1000);
  });

  imageContainer.addEventListener('mouseleave', () => {
    clearInterval(hoverInterval);
    images.forEach((img, index) => {
      img.style.opacity = index === 0 ? '1' : '0';
    });
  });
};
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/productsAll');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return null;
  }
};

export const showProductContainer = async () => {
  productContainer.innerHTML = "";

  const products = await fetchProducts();

  if (!products) {
    return false;
  }

  products.forEach(async(curProd) => {
    const { 
      product_brand: brand,
      category_name: category,
      product_description: description,
      product_id: id,
      product_image: image,
      product_name: name,
      tax,
      product_color,
      product_mrp: price,
      no_of_items: stock,
      product_discount: discount
    } = curProd;

    
    const rating = await fetchAverageRating(id) || 0;
    const productClone = document.importNode(productTemplate.content, true);
    const card = productClone.querySelector(".cards");
    if (!card) return;

    card.setAttribute("id", `card${id}`);
    card.querySelector(".category").textContent = category;
    card.querySelector(".productName").textContent = name;
    card.querySelector('.productNameLink').dataset.id = id;
    card.querySelector('.productNameLink').href = `singleProductPage.html?id=${id}`;
    card.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
    const imageContainer = card.querySelector('.imageContainer');
    imageContainer.appendChild(createImageElements(image));

    card.querySelector(".productStock").textContent = stock;
    const productStock = card.querySelector(".productStock");
    card.querySelector(".tax").value = tax;
    let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
    card.querySelector(".productPrice").textContent = sellingPrice;
   
   

    if (discount != 0) {
      card.querySelector(".productActualPrice").textContent = `₹${price}`;
      card.querySelector('.discountPr').textContent = `${discount}% off`;
    } else {
      card.querySelector('.discountPr').style.background = 'none';
    }

    card.querySelector(".stockElement").addEventListener("click", (event) => {
      homeQuantityToggle(event, id, stock);
    });

    const wishListButton = card.querySelector(".wish-list-button");
    const wishListIcon = wishListButton.querySelector('i');

    checkWishlistStatus(id,wishListIcon);
      
      
    if (product_color.length >= 1) {
      // Set the text content of the productColor element
      card.querySelector(".productColor").textContent = "Colors";
    
      // Get the productColorGrid element
      const productColorGrid = card.querySelector(".productColorGrid");
    
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
    

    if (isLoggedIn()) {
      card.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
        addToCart(event, id,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".wish-list-button").addEventListener("click", (event) => {
        addToWishList(event, id, stock,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".buy-now").addEventListener("click", (event) => {
        buyNow(event, id, getProductQuantity(), productStock);
      });
    } else {
      card.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
      card.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
      card.querySelector(".buy-now").addEventListener("click", redirectToLogin);
    }

    productContainer.append(productClone);

    addHoverEffect(imageContainer);
  });
};


async function fetchProductsColor(color, cateName) {
  try {
      const response = await fetch('http://localhost:3000/productsByColor', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ color: color, category: cateName })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const products = await response.json();
      return products;
  } catch (error) {
      console.error('Failed to fetch products by color and category:', error);
  }
}


export const showProductContainerColor = async (color, cateName) => {
  console.log(color + " : " + cateName);
  
  productContainer.innerHTML = "";

  const products = await fetchProductsColor(color, cateName);

  if (!products) {
    return false;
  }

  products.forEach(async(curProd) => {
    const { 
      product_brand: brand,
      category_name: category,
      product_description: description,
      product_id: id,
      product_image: image,
      product_name: name,
      tax,
      product_color,
      product_mrp: price,
      no_of_items: stock,
      product_discount: discount
    } = curProd;

    
    const rating = await fetchAverageRating(id) || 0;
    const productClone = document.importNode(productTemplate.content, true);
    const card = productClone.querySelector(".cards");
    if (!card) return;

    card.setAttribute("id", `card${id}`);
    card.querySelector(".category").textContent = category;
    card.querySelector(".productName").textContent = name;
    card.querySelector('.productNameLink').dataset.id = id;
    card.querySelector('.productNameLink').href = `singleProductPage.html?id=${id}`;
    card.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
    const imageContainer = card.querySelector('.imageContainer');
    imageContainer.appendChild(createImageElements(image));

    card.querySelector(".productStock").textContent = stock;
    const productStock = card.querySelector(".productStock");
    card.querySelector(".tax").value = tax;
    let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
    card.querySelector(".productPrice").textContent = sellingPrice;
   
   

    if (discount != 0) {
      card.querySelector(".productActualPrice").textContent = `₹${price}`;
      card.querySelector('.discountPr').textContent = `${discount}% off`;
    } else {
      card.querySelector('.discountPr').style.background = 'none';
    }

    card.querySelector(".stockElement").addEventListener("click", (event) => {
      homeQuantityToggle(event, id, stock);
    });

    const wishListButton = card.querySelector(".wish-list-button");
    const wishListIcon = wishListButton.querySelector('i');

    checkWishlistStatus(id,wishListIcon);
      
      
    if (product_color.length >= 1) {
      // Set the text content of the productColor element
      card.querySelector(".productColor").textContent = "Colors";
    
      // Get the productColorGrid element
      const productColorGrid = card.querySelector(".productColorGrid");
    
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
    

    if (isLoggedIn()) {
      card.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
        addToCart(event, id,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".wish-list-button").addEventListener("click", (event) => {
        addToWishList(event, id, stock,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".buy-now").addEventListener("click", (event) => {
        buyNow(event, id, getProductQuantity(), productStock);
      });
    } else {
      card.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
      card.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
      card.querySelector(".buy-now").addEventListener("click", redirectToLogin);
    }

    productContainer.append(productClone);

    addHoverEffect(imageContainer);
  });
};


const fetchProductsByCategory = async (cateName) => {
  try {
      const response = await fetch(`http://localhost:3000/productsCate?category=${cateName}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return await response.json();
  } catch (error) {
      console.error('Failed to fetch products:', error);
      return null;
  }
};

export const showProductContainerCateWithDiscount = async (cateName, cateDiscount) => {
  

  console.log(cateName + " : " + cateDiscount + "card with");
  productContainer.innerHTML = "";

  const products = await fetchProductsByCategory(cateName);
  
  if (!products) {
    return false;
  }

  products.forEach(async(curProd) => {
    const {
      product_brand: brand,
      category_name: category,
      product_description: description,
      product_id: id,
      tax,
      product_color,
      product_image: image,
      product_name: name,
      product_mrp: price,
      product_discount: discount,
      no_of_items: stock
    } = curProd;
    console.log("this is " + product_color[0]);
    const rating = await fetchAverageRating(id) || 0;
    if (category === cateName && discount >= cateDiscount) {
      const productClone = document.importNode(productTemplate.content, true);
    const card = productClone.querySelector(".cards");
    if (!card) return;
    console.log(curProd);

    card.setAttribute("id", `card${id}`);
    card.querySelector(".category").textContent = category;
    card.querySelector(".productName").textContent = name;
    card.querySelector('.productNameLink').dataset.id = id;
    card.querySelector('.productNameLink').href = `singleProductPage.html?id=${id}`;
    card.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
    const imageContainer = card.querySelector('.imageContainer');
    imageContainer.appendChild(createImageElements(image));

    card.querySelector(".productStock").textContent = stock;
    const productStock = card.querySelector(".productStock");
    card.querySelector(".tax").value = tax;
    let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
    card.querySelector(".productPrice").textContent = sellingPrice;

    if (discount != 0) {
      card.querySelector(".productActualPrice").textContent = `₹${price}`;
      card.querySelector('.discountPr').textContent = `${discount}% off`;
    } else {
      card.querySelector('.discountPr').style.background = 'none';
    }

    card.querySelector(".stockElement").addEventListener("click", (event) => {
      homeQuantityToggle(event, id, stock);
    });

   
    const wishListButton = card.querySelector(".wish-list-button");
    const wishListIcon = wishListButton.querySelector('i');

    checkWishlistStatus(id,wishListIcon);

    if (product_color.length >= 1) {
      // Set the text content of the productColor element
      card.querySelector(".productColor").textContent = "Colors";
    
      // Get the productColorGrid element
      const productColorGrid = card.querySelector(".productColorGrid");
    
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
    if (isLoggedIn()) {
      card.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
        addToCart(event, id, sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".wish-list-button").addEventListener("click", (event) => {
        addToWishList(event, id, stock,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".buy-now").addEventListener("click", (event) => {
        buyNow(event, id, getProductQuantity(), productStock);
      });
    } else {
      card.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
      card.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
      card.querySelector(".buy-now").addEventListener("click", redirectToLogin);
    }

    productContainer.append(productClone);

    addHoverEffect(imageContainer);    }
  });
};

export const showProductContainerCate = async (cateName) => {
  

  console.log(cateName);
  productContainer.innerHTML = "";

  const products = await fetchProductsByCategory(cateName);
  
  if (!products) {
    return false;
  }

  products.forEach(async(curProd) => {
    const {
      product_brand: brand,
      category_name: category,
      product_description: description,
      product_id: id,
      tax,
      product_color,
      product_image: image,
      product_name: name,
      product_mrp: price,
      product_discount: discount,
      no_of_items: stock
    } = curProd;
    console.log("this is " + product_color[0]);
    const rating = await fetchAverageRating(id) || 0;
    if (category === cateName) {
      const productClone = document.importNode(productTemplate.content, true);
    const card = productClone.querySelector(".cards");
    if (!card) return;
    console.log(curProd);

    card.setAttribute("id", `card${id}`);
    card.querySelector(".category").textContent = category;
    card.querySelector(".productName").textContent = name;
    card.querySelector('.productNameLink').dataset.id = id;
    card.querySelector('.productNameLink').href = `singleProductPage.html?id=${id}`;
    card.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
    const imageContainer = card.querySelector('.imageContainer');
    imageContainer.appendChild(createImageElements(image));

    card.querySelector(".productStock").textContent = stock;
    const productStock = card.querySelector(".productStock");
    card.querySelector(".tax").value = tax;
    let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
    card.querySelector(".productPrice").textContent = sellingPrice;

    if (discount != 0) {
      card.querySelector(".productActualPrice").textContent = `₹${price}`;
      card.querySelector('.discountPr').textContent = `${discount}% off`;
    } else {
      card.querySelector('.discountPr').style.background = 'none';
    }

    card.querySelector(".stockElement").addEventListener("click", (event) => {
      homeQuantityToggle(event, id, stock);
    });

   
    const wishListButton = card.querySelector(".wish-list-button");
    const wishListIcon = wishListButton.querySelector('i');

    checkWishlistStatus(id,wishListIcon);

    if (product_color.length >= 1) {
      // Set the text content of the productColor element
      card.querySelector(".productColor").textContent = "Colors";
    
      // Get the productColorGrid element
      const productColorGrid = card.querySelector(".productColorGrid");
    
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
    if (isLoggedIn()) {
      card.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
        addToCart(event, id, sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".wish-list-button").addEventListener("click", (event) => {
        addToWishList(event, id, stock,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".buy-now").addEventListener("click", (event) => {
        buyNow(event, id, getProductQuantity(), productStock);
      });
    } else {
      card.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
      card.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
      card.querySelector(".buy-now").addEventListener("click", redirectToLogin);
    }

    productContainer.append(productClone);

    addHoverEffect(imageContainer);    }
  });
};

const fetchProductsByCategoryAndPrice = async (category, price) => {
  try {
    const response = await fetch(`http://localhost:3000/productsByCategoryAndPrice?category=${category}&price=${price}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return null;
  }
};

export const showProductContainerPrice = async (category, minPrice,maxPrice) => {
  productContainer.innerHTML = "";

  const products = await fetchProductsByCategoryAndPrice(category, maxPrice);

  if (!products) {
    return false;
  }

  products.forEach(async(curProd) => {
    const { 
      product_brand: brand,
      category_name: category,
      product_description: description,
      product_id: id,
      product_image: image,
      product_name: name,
      tax,
      product_color,
      product_mrp: price,
      no_of_items: stock,
      product_discount: discount
    } = curProd;
    console.log(product_color[0]);
    const rating = await fetchAverageRating(id) || 0;
    if (price >= minPrice && price <= maxPrice && (category === 'All' || category === curProd.category_name)) {
      const productClone = document.importNode(productTemplate.content, true);
    const card = productClone.querySelector(".cards");
    if (!card) return;

    card.setAttribute("id", `card${id}`);
    card.querySelector(".category").textContent = category;
    card.querySelector(".productName").textContent = name;
    card.querySelector('.productNameLink').dataset.id = id;
    card.querySelector('.productNameLink').href = `singleProductPage.html?id=${id}`;
    card.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
    const imageContainer = card.querySelector('.imageContainer');
    imageContainer.appendChild(createImageElements(image));

    card.querySelector(".productStock").textContent = stock;
    card.querySelector(".tax").value = tax;
    let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
    card.querySelector(".productPrice").textContent = sellingPrice;

    if (discount != 0) {
      card.querySelector(".productActualPrice").textContent = `₹${price}`;
      card.querySelector('.discountPr').textContent = `${discount}% off`;
    } else {
      card.querySelector('.discountPr').style.background = 'none';
    }

    card.querySelector(".stockElement").addEventListener("click", (event) => {
      homeQuantityToggle(event, id, stock);
    });

    const wishListButton = card.querySelector(".wish-list-button");
    const wishListIcon = wishListButton.querySelector('i');

    checkWishlistStatus(id,wishListIcon);
    if (product_color.length >= 1) {
      // Set the text content of the productColor element
      card.querySelector(".productColor").textContent = "Colors";
    
      // Get the productColorGrid element
      const productColorGrid = card.querySelector(".productColorGrid");
    
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

    if (isLoggedIn()) {
      card.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
        addToCart(event, id,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".wish-list-button").addEventListener("click", (event) => {
        addToWishList(event, id, stock,sessionStorage.getItem('userEmail'));
      });

      card.querySelector(".buy-now").addEventListener("click", (event) => {
        buyNow(event, id, getProductQuantity(), card);
      });
    } else {
      card.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
      card.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
      card.querySelector(".buy-now").addEventListener("click", redirectToLogin);
    }

    productContainer.append(productClone);

    addHoverEffect(imageContainer);    }
  });
};


export const showProductContainerRating = async (cateName, checkedValues) => {
  productContainer.innerHTML = "";

  const products = await fetchProducts();

  if (!products) {
    return false;
  }

  for (const curProd of products) {
    const { 
      product_brand: brand,
      category_name: category,
      product_description: description,
      product_id: id,
      product_image: image,
      product_name: name,
      tax,
      product_color,
      product_mrp: price,
      no_of_items: stock,
      product_discount: discount
    } = curProd;

    const rating = await fetchAverageRating(id) || 0;
    if(cateName === 'All')
    {
      if (checkedValues.includes(String(rating))) {
        const productClone = document.importNode(productTemplate.content, true);
        const card = productClone.querySelector(".cards");
        if (!card) return;
  
        card.setAttribute("id", `card${id}`);
        card.querySelector(".category").textContent = category;
        card.querySelector(".productName").textContent = name;
        card.querySelector('.productNameLink').dataset.id = id;
        card.querySelector('.productNameLink').href = `singleProductPage.html?id=${id}`;
        card.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
        const imageContainer = card.querySelector('.imageContainer');
        imageContainer.appendChild(createImageElements(image));
  
        card.querySelector(".productStock").textContent = stock;
        card.querySelector(".tax").value = tax;
        let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
        card.querySelector(".productPrice").textContent = sellingPrice;
  
        if (discount != 0) {
          card.querySelector(".productActualPrice").textContent = `₹${price}`;
          card.querySelector('.discountPr').textContent = `${discount}% off`;
        } else {
          card.querySelector('.discountPr').style.background = 'none';
        }
  
        card.querySelector(".stockElement").addEventListener("click", (event) => {
          homeQuantityToggle(event, id, stock);
        });
  
        const wishListButton = card.querySelector(".wish-list-button");
        const wishListIcon = wishListButton.querySelector('i');
  
        checkWishlistStatus(id, wishListIcon);
  
        if (product_color.length >= 1) {
          // Set the text content of the productColor element
          card.querySelector(".productColor").textContent = "Colors";
        
          // Get the productColorGrid element
          const productColorGrid = card.querySelector(".productColorGrid");
        
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
        if (isLoggedIn()) {
          card.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
            addToCart(event, id, sessionStorage.getItem('userEmail'));
          });
  
          card.querySelector(".wish-list-button").addEventListener("click", (event) => {
            addToWishList(event, id, stock, sessionStorage.getItem('userEmail'));
          });
  
          card.querySelector(".buy-now").addEventListener("click", (event) => {
            buyNow(event, id, getProductQuantity(), card);
          });
        } else {
          card.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
          card.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
          card.querySelector(".buy-now").addEventListener("click", redirectToLogin);
        }
  
        productContainer.append(productClone);
  
        addHoverEffect(imageContainer);
      }
    }
    else
    {
      
      if ((cateName === curProd.category_name) && checkedValues.includes(String(rating))) {
        const productClone = document.importNode(productTemplate.content, true);
        const card = productClone.querySelector(".cards");
        if (!card) return;
  
        card.setAttribute("id", `card${id}`);
        card.querySelector(".category").textContent = category;
        card.querySelector(".productName").textContent = name;
        card.querySelector('.productNameLink').dataset.id = id;
        card.querySelector('.productNameLink').href = `singleProductPage.html?id=${id}`;
        card.querySelector(".productRating").innerHTML = "<i class='fa-solid fa-star' style='color: #ffa500'></i>".repeat(rating) + "<i class='fa-regular fa-star' style='color: #ffa500'></i>".repeat(5 - rating);
        const imageContainer = card.querySelector('.imageContainer');
        imageContainer.appendChild(createImageElements(image));
  
        card.querySelector(".productStock").textContent = stock;
        card.querySelector(".tax").value = tax;
        let sellingPrice = discount > 0 ? `₹${(price * (1 - discount / 100)).toFixed(2)}` : `₹${price.toFixed(2)}`;
        card.querySelector(".productPrice").textContent = sellingPrice;
  
        if (discount != 0) {
          card.querySelector(".productActualPrice").textContent = `₹${price}`;
          card.querySelector('.discountPr').textContent = `${discount}% off`;
        } else {
          card.querySelector('.discountPr').style.background = 'none';
        }
  
        card.querySelector(".stockElement").addEventListener("click", (event) => {
          homeQuantityToggle(event, id, stock);
        });
  
        const wishListButton = card.querySelector(".wish-list-button");
        const wishListIcon = wishListButton.querySelector('i');
  
        checkWishlistStatus(id, wishListIcon);
  
        if (isLoggedIn()) {
          card.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
            addToCart(event, id, sessionStorage.getItem('userEmail'));
          });
  
          card.querySelector(".wish-list-button").addEventListener("click", (event) => {
            addToWishList(event, id, stock, sessionStorage.getItem('userEmail'));
          });
  
          card.querySelector(".buy-now").addEventListener("click", (event) => {
            buyNow(event, id, getProductQuantity(), card);
          });
        } else {
          card.querySelector(".add-to-cart-button").addEventListener("click", redirectToLogin);
          card.querySelector(".wish-list-button").addEventListener("click", redirectToLogin);
          card.querySelector(".buy-now").addEventListener("click", redirectToLogin);
        }
  
        productContainer.append(productClone);
  
        addHoverEffect(imageContainer);
      }
    }
   
  }
};
