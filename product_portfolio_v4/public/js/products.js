import { showProductContainer, showProductContainerCate, showProductContainerCateWithDiscount, showProductContainerColor, showProductContainerPrice, showProductContainerRating } from "./productPageCards.js";
import { getCartProductFromLS } from "./getCartProductFromLS.js";
import { updateCartValue } from "./updateCartValue.js";
import { getWishProductFromLS } from "./getWishProductFromLS.js";
import { updateWishValue } from "./updateWishListValue.js";



// Fetch and populate categories, then add event listeners

        // Fetch the current URL
const currentUrl = window.location.href;

// Create a URL object
const url = new URL(currentUrl);

// Get the query parameters
const queryParams = new URLSearchParams(url.search);

// Find the length (number of query parameters)
const queryParamsLength = Array.from(queryParams.keys()).length;


        document.addEventListener('DOMContentLoaded', function() {
           


           if(queryParamsLength == 1)
           {
            
                console.log(queryParams.get('type'));
                const productCate = document.querySelector(".productCate");
            const colorGrid = document.querySelector(".color-grid");
            let cateName = queryParams.get('type');
            
            function updateSelectedOption(cateName) {
                const productCate = document.getElementById('productCate');
                const options = productCate.querySelectorAll('option');
            
                options.forEach(option => {
                    if (option.value === cateName) {
                        option.selected = true;
                        showProductContainerCate(cateName);
                    } else {
                        option.selected = false;
                    }
                });
            }

            // Function to add event listeners to category items
            function addCategoryEventListeners() {
                const productCate = document.getElementById('productCate');
                
                productCate.addEventListener('change', () => {
                    const selectedCategory = productCate.value;
                    const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                    const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                    const selectedColorInput = document.querySelector('input[name="color"]:checked');
                    selectedColor = selectedColorInput ? selectedColorInput.value : null;
                    
                    if (selectedCategory.toLowerCase() === 'all') {
                        cateName = 'All';
                        if (selectedColor) {
                            showProductContainerColor(selectedColor, 'All', minPrice, maxPrice);
                        } else {
                            showProductContainerPrice('All', minPrice, maxPrice);
                        }
                    } else {
                        cateName = selectedCategory;
                        if (selectedColor) {
                            showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                        } else {
                            showProductContainerPrice(selectedCategory, minPrice, maxPrice);
                        }
                    }
                });
            }
            
            // Initialize event listeners
            addCategoryEventListeners();
            if (cateName) {
                updateSelectedOption(cateName);
            }
            
            async function fetchColors(cateName) {
                try {
                    const response = await fetch('http://localhost:3000/colors', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ category: cateName })
                    });
            
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
            
                    const colors = await response.json();
            
                    const colorContainer = document.querySelector('.color-container');
                    colorContainer.innerHTML = ''; // Clear the container
            
                    if (colors.length === 0) {
                        colorContainer.style.display = 'none';
                    } else {
                        colorContainer.style.display = 'block';
            
                        // Add the "Color" heading
                        const newLine = document.createElement('br');
                        colorContainer.appendChild(newLine);
                        const colorHeading = document.createElement('p');
                        colorHeading.textContent = 'Color';
                        colorContainer.appendChild(colorHeading);
            
                        // Add the color grid container
                        const colorGrid = document.createElement('div');
                        colorGrid.classList.add('color-grid');
                        colorContainer.appendChild(colorGrid);
            
                        // Populate the color grid with unique color options
                        colors.forEach(color => {
                            const label = document.createElement('label');
                            label.classList.add('color-option');
            
                            const input = document.createElement('input');
                            input.type = 'radio';
                            input.name = 'color';
                            input.value = color;
            
                            const colorCircle = document.createElement('div');
                            colorCircle.classList.add('color-circle');
                            colorCircle.style.backgroundColor = color.toLowerCase();
            
                            label.appendChild(input);
                            label.appendChild(colorCircle);
            
                            colorGrid.appendChild(label);
            
                            // Add event listener to the radio button
                            input.addEventListener('change', () => {
                                const selectedCategory = document.getElementById('productCate').value;
                                const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                                const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                                showProductContainerColor(color, selectedCategory, minPrice, maxPrice);
                            });
                        });
                    }
            
                } catch (error) {
                    console.error('Failed to fetch colors:', error);
                }
            }
            
            // Call fetchColors function
            fetchColors(cateName);
            
            // Fetch and update cart products
            const fetchCartProducts = async () => {
                let cartProductLS = await getCartProductFromLS();
                updateCartValue(cartProductLS);
            };
            fetchCartProducts();

            // Fetch and update wish products
            const fetchWishProducts = async () => {
                let wishProductLS = await getWishProductFromLS();
                updateWishValue(wishProductLS);
            };
            fetchWishProducts();

            // Function to handle price range filtering
            const rangeInput = document.querySelectorAll(".range-input input");
            const priceInput = document.querySelectorAll(".price-input input");
            const progress = document.querySelector(".slider .progress");
            const go = document.querySelector(".go");

            // Initialize price range values
            let minPrice = 0;
            let maxPrice = 50000;

            // Function to update slider progress
            function updateSliderProgress() {
                progress.style.left = (rangeInput[0].value / rangeInput[0].max) * 100 + "%";
                progress.style.right = 100 - (rangeInput[1].value / rangeInput[1].max) * 100 + "%";
            }

            // Function to apply price filter
            function applyPriceFilter() {
                const selectedCategory = document.getElementById('productCate').value;
                const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                const selectedColorInput = document.querySelector('input[name="color"]:checked');
                const selectedColor = selectedColorInput ? selectedColorInput.value : null;
                
                if (selectedColor) {
                    showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                } else {
                    showProductContainerPrice(selectedCategory, minPrice, maxPrice);
                }
            }

            // Event listeners for price input fields
            priceInput.forEach((input) => {
                input.addEventListener("input", (e) => {
                    let value = parseInt(input.value) || 0;
                    
                    if (input.classList.contains("input-min")) {
                        if (value < 0) value = 0;
                        if (value > 50000) value = 50000;
                        if (value > parseInt(priceInput[1].value)) {
                            value = parseInt(priceInput[1].value);
                        }
                        minPrice = value;
                        rangeInput[0].value = value;
                    } else {
                        if (value < parseInt(priceInput[0].value)) {
                            value = parseInt(priceInput[0].value);
                        }
                        if (value > 50000) value = 50000;
                        maxPrice = value;
                        rangeInput[1].value = value;
                    }
                    input.value = value;
                    updateSliderProgress();
                });
            });

            // Event listeners for range sliders
            rangeInput.forEach((input) => {
                input.addEventListener("input", (e) => {
                    let minVal = parseInt(rangeInput[0].value);
                    let maxVal = parseInt(rangeInput[1].value);

                    if (minVal > maxVal) {
                        if (e.target.classList.contains("range-min")) {
                            minVal = maxVal;
                        } else {
                            maxVal = minVal;
                        }
                    }

                    minPrice = minVal;
                    maxPrice = maxVal;
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    updateSliderProgress();
                });
            });

            // Event listener for Go button
            go.addEventListener("click", applyPriceFilter);

            // Initialize slider progress
            updateSliderProgress();

            // Function to handle search
            const search = () => {
                const searchVal = document.getElementById('search-item').value.toUpperCase();
                const storeItems = document.getElementById('productContainer');
                const products = document.querySelectorAll('.cards');
                const pname = storeItems.getElementsByTagName('h2');

                for (let i = 0; i < pname.length; i++) {
                    let match = products[i].getElementsByTagName('h2')[0];
                    if (match) {
                        let textValue = match.textContent || match.innerHTML;
                        if (textValue.toUpperCase().indexOf(searchVal) > -1) {
                            products[i].style.display = "";
                        } else {
                            products[i].style.display = "none";
                        }
                    }
                }
            }

            let searchbar = document.getElementById('search-item');
            searchbar.addEventListener('keyup', () => {
                search();
            });

            const ratingFilter = document.getElementById('rating-filter');
            const checkboxs = ratingFilter.querySelectorAll('input[type="checkbox"]');
            const checkedValues = [];
        
            checkboxs.forEach(function(checkbox) {
            
              checkbox.addEventListener('change', function() {
                
                const value = this.getAttribute('data-value');
                if (this.checked) {
                  checkedValues.push(value);
                } else {
                  const index = checkedValues.indexOf(value);
                  if (index > -1) {
                    checkedValues.splice(index, 1);
                  }
                }
                console.log(checkedValues.length + " : " + checkedValues);
                if(checkedValues.length === 0)
                {
                    if(cateName === 'All')
                    showProductContainer();
                    else
                    showProductContainerCate(cateName);
                }
                else
                {
                    console.log(checkedValues);
                    showProductContainerRating(cateName, checkedValues);
                }
               
              });
            });

            // Add color filter event listeners
            const colorOptions = document.querySelectorAll('.color-option input[type="radio"]');
            let selectedColor = null;

            colorOptions.forEach(input => {
                input.addEventListener('change', () => {
                    selectedColor = input.value;
                    const selectedCategory = document.getElementById('productCate').value;
                    const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                    const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                    
                    if (selectedCategory.toLowerCase() === 'all') {
                        showProductContainerColor(selectedColor, 'All', minPrice, maxPrice);
                    } else {
                        showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                    }
                });
            });

           }
           else if(queryParamsLength == 2)
           {
                 console.log(queryParams.get('discount'));
                 console.log(queryParams.get('type'));
                const productCate = document.querySelector(".productCate");
            const colorGrid = document.querySelector(".color-grid");
            let cateName = queryParams.get('type');
            let cateDiscount = queryParams.get('discount');
            
            function updateSelectedOption(cateName) {
                const productCate = document.getElementById('productCate');
                const options = productCate.querySelectorAll('option');
            
                options.forEach(option => {
                    if (option.value === cateName) {
                        option.selected = true;
                        showProductContainerCateWithDiscount(cateName, cateDiscount);
                    } else {
                        option.selected = false;
                    }
                });
            }

            // Function to add event listeners to category items
            function addCategoryEventListeners() {
                const productCate = document.getElementById('productCate');
                
                productCate.addEventListener('change', () => {
                    const selectedCategory = productCate.value;
                    const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                    const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                    const selectedColorInput = document.querySelector('input[name="color"]:checked');
                    selectedColor = selectedColorInput ? selectedColorInput.value : null;
                    
                    if (selectedCategory.toLowerCase() === 'all') {
                        cateName = 'All';
                        if (selectedColor) {
                            showProductContainerColor(selectedColor, 'All', minPrice, maxPrice);
                        } else {
                            showProductContainerPrice('All', minPrice, maxPrice);
                        }
                    } else {
                        cateName = selectedCategory;
                        if (selectedColor) {
                            showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                        } else {
                            showProductContainerPrice(selectedCategory, minPrice, maxPrice);
                        }
                    }
                });
            }
            
            // Initialize event listeners
            addCategoryEventListeners();
            if (cateName) {
                updateSelectedOption(cateName);
            }
            
            async function fetchColors(cateName) {
                try {
                    const response = await fetch('http://localhost:3000/colors', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ category: cateName })
                    });
            
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
            
                    const colors = await response.json();
            
                    const colorContainer = document.querySelector('.color-container');
                    colorContainer.innerHTML = ''; // Clear the container
            
                    if (colors.length === 0) {
                        colorContainer.style.display = 'none';
                    } else {
                        colorContainer.style.display = 'block';
            
                        // Add the "Color" heading
                        const newLine = document.createElement('br');
                        colorContainer.appendChild(newLine);
                        const colorHeading = document.createElement('p');
                        colorHeading.textContent = 'Color';
                        colorContainer.appendChild(colorHeading);
            
                        // Add the color grid container
                        const colorGrid = document.createElement('div');
                        colorGrid.classList.add('color-grid');
                        colorContainer.appendChild(colorGrid);
            
                        // Populate the color grid with unique color options
                        colors.forEach(color => {
                            const label = document.createElement('label');
                            label.classList.add('color-option');
            
                            const input = document.createElement('input');
                            input.type = 'radio';
                            input.name = 'color';
                            input.value = color;
            
                            const colorCircle = document.createElement('div');
                            colorCircle.classList.add('color-circle');
                            colorCircle.style.backgroundColor = color.toLowerCase();
            
                            label.appendChild(input);
                            label.appendChild(colorCircle);
            
                            colorGrid.appendChild(label);
            
                            // Add event listener to the radio button
                            input.addEventListener('change', () => {
                                const selectedCategory = document.getElementById('productCate').value;
                                const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                                const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                                showProductContainerColor(color, selectedCategory, minPrice, maxPrice);
                            });
                        });
                    }
            
                } catch (error) {
                    console.error('Failed to fetch colors:', error);
                }
            }
            
            // Call fetchColors function
            fetchColors(cateName);
            
            // Fetch and update cart products
            const fetchCartProducts = async () => {
                let cartProductLS = await getCartProductFromLS();
                updateCartValue(cartProductLS);
            };
            fetchCartProducts();

            // Fetch and update wish products
            const fetchWishProducts = async () => {
                let wishProductLS = await getWishProductFromLS();
                updateWishValue(wishProductLS);
            };
            fetchWishProducts();

            // Function to handle price range filtering
            const rangeInput = document.querySelectorAll(".range-input input");
            const priceInput = document.querySelectorAll(".price-input input");
            const progress = document.querySelector(".slider .progress");
            const go = document.querySelector(".go");

            // Initialize price range values
            let minPrice = 0;
            let maxPrice = 50000;

            // Function to update slider progress
            function updateSliderProgress() {
                progress.style.left = (rangeInput[0].value / rangeInput[0].max) * 100 + "%";
                progress.style.right = 100 - (rangeInput[1].value / rangeInput[1].max) * 100 + "%";
            }

            // Function to apply price filter
            function applyPriceFilter() {
                const selectedCategory = document.getElementById('productCate').value;
                const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                const selectedColorInput = document.querySelector('input[name="color"]:checked');
                const selectedColor = selectedColorInput ? selectedColorInput.value : null;
                
                if (selectedColor) {
                    showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                } else {
                    showProductContainerPrice(selectedCategory, minPrice, maxPrice);
                }
            }

            // Event listeners for price input fields
            priceInput.forEach((input) => {
                input.addEventListener("input", (e) => {
                    let value = parseInt(input.value) || 0;
                    
                    if (input.classList.contains("input-min")) {
                        if (value < 0) value = 0;
                        if (value > 50000) value = 50000;
                        if (value > parseInt(priceInput[1].value)) {
                            value = parseInt(priceInput[1].value);
                        }
                        minPrice = value;
                        rangeInput[0].value = value;
                    } else {
                        if (value < parseInt(priceInput[0].value)) {
                            value = parseInt(priceInput[0].value);
                        }
                        if (value > 50000) value = 50000;
                        maxPrice = value;
                        rangeInput[1].value = value;
                    }
                    input.value = value;
                    updateSliderProgress();
                });
            });

            // Event listeners for range sliders
            rangeInput.forEach((input) => {
                input.addEventListener("input", (e) => {
                    let minVal = parseInt(rangeInput[0].value);
                    let maxVal = parseInt(rangeInput[1].value);

                    if (minVal > maxVal) {
                        if (e.target.classList.contains("range-min")) {
                            minVal = maxVal;
                        } else {
                            maxVal = minVal;
                        }
                    }

                    minPrice = minVal;
                    maxPrice = maxVal;
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    updateSliderProgress();
                });
            });

            // Event listener for Go button
            go.addEventListener("click", applyPriceFilter);

            // Initialize slider progress
            updateSliderProgress();

            // Function to handle search
            const search = () => {
                const searchVal = document.getElementById('search-item').value.toUpperCase();
                const storeItems = document.getElementById('productContainer');
                const products = document.querySelectorAll('.cards');
                const pname = storeItems.getElementsByTagName('h2');
            
                for (let i = 0; i < pname.length; i++) {
                    let match = products[i].getElementsByTagName('h2')[0];
                    if (match) {
                        let textValue = match.textContent || match.innerHTML;
                        if (textValue.toUpperCase().indexOf(searchVal) > -1) {
                            products[i].style.display = "";
                        } else {
                            products[i].style.display = "none";
                        }
                    }
                }
            }
            
            let searchbar = document.getElementById('search-item');
            searchbar.addEventListener('keyup', () => {
                search();
            });
            
            
            const ratingFilter = document.getElementById('rating-filter');
            const checkboxs = ratingFilter.querySelectorAll('input[type="checkbox"]');
            const checkedValues = [];
        
            checkboxs.forEach(function(checkbox) {
            
              checkbox.addEventListener('change', function() {
                
                const value = this.getAttribute('data-value');
                if (this.checked) {
                  checkedValues.push(value);
                } else {
                  const index = checkedValues.indexOf(value);
                  if (index > -1) {
                    checkedValues.splice(index, 1);
                  }
                }
                console.log(checkedValues.length + " : " + checkedValues);
                if(checkedValues.length === 0)
                {
                    if(cateName === 'All')
                    showProductContainer();
                    else
                    showProductContainerCate(cateName);
                }
                else
                {
                    console.log(checkedValues);
                    showProductContainerRating(cateName, checkedValues);
                }
               
              });
            });

            // Add color filter event listeners
            const colorOptions = document.querySelectorAll('.color-option input[type="radio"]');
            let selectedColor = null;

            colorOptions.forEach(input => {
                input.addEventListener('change', () => {
                    selectedColor = input.value;
                    const selectedCategory = document.getElementById('productCate').value;
                    const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                    const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                    
                    if (selectedCategory.toLowerCase() === 'all') {
                        showProductContainerColor(selectedColor, 'All', minPrice, maxPrice);
                    } else {
                        showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                    }
                });
            });

           }
           else
           {
            const productCate = document.querySelector(".productCate");
            const colorGrid = document.querySelector(".color-grid");
            let cateName = "All";
            
            // Function to add event listeners to category items
            function addCategoryEventListeners() {
                const productCate = document.getElementById('productCate');
                
                productCate.addEventListener('change', () => {
                    const selectedCategory = productCate.value;
                    const minPrice = parseInt(document.querySelector('.input-min').value);
                    const maxPrice = parseInt(document.querySelector('.input-max').value);
                    
                    if (selectedCategory.toLowerCase() === 'all') {
                        cateName = 'All';
                        if (selectedColor) {
                            showProductContainerColor(selectedColor, 'All', minPrice, maxPrice);
                        } else {
                            showProductContainerPrice('All', minPrice, maxPrice);
                        }
                    } else {
                        cateName = selectedCategory;
                        if (selectedColor) {
                            showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                        } else {
                            showProductContainerPrice(selectedCategory, minPrice, maxPrice);
                        }
                    }
                });
            }
            
            // Initialize event listeners
            addCategoryEventListeners();
            
            // Show all products initially
            showProductContainer();
            
            // Fetch and update cart products
            const fetchCartProducts = async () => {
                let cartProductLS = await getCartProductFromLS();
                updateCartValue(cartProductLS);
            };
            fetchCartProducts();
            
            // Fetch and update wish products
            const fetchWishProducts = async () => {
                let wishProductLS = await getWishProductFromLS();
                updateWishValue(wishProductLS);
            };
            fetchWishProducts();
            
            // Function to handle price range filtering
            const rangeInput = document.querySelectorAll(".range-input input");
            const priceInput = document.querySelectorAll(".price-input input");
            const progress = document.querySelector(".slider .progress");
            const go = document.querySelector(".go");

            // Initialize price range values
            let minPrice = 0;
            let maxPrice = 50000;

            // Function to update slider progress
            function updateSliderProgress() {
                progress.style.left = (rangeInput[0].value / rangeInput[0].max) * 100 + "%";
                progress.style.right = 100 - (rangeInput[1].value / rangeInput[1].max) * 100 + "%";
            }

            // Function to apply price filter
            function applyPriceFilter() {
                const selectedCategory = document.getElementById('productCate').value;
                const minPrice = parseInt(document.querySelector('.input-min').value) || 0;
                const maxPrice = parseInt(document.querySelector('.input-max').value) || 50000;
                const selectedColorInput = document.querySelector('input[name="color"]:checked');
                const selectedColor = selectedColorInput ? selectedColorInput.value : null;
                
                if (selectedColor) {
                    showProductContainerColor(selectedColor, selectedCategory, minPrice, maxPrice);
                } else {
                    showProductContainerPrice(selectedCategory, minPrice, maxPrice);
                }
            }

            // Event listeners for price input fields
            priceInput.forEach((input) => {
                input.addEventListener("input", (e) => {
                    let value = parseInt(input.value) || 0;
                    
                    if (input.classList.contains("input-min")) {
                        if (value < 0) value = 0;
                        if (value > 50000) value = 50000;
                        if (value > parseInt(priceInput[1].value)) {
                            value = parseInt(priceInput[1].value);
                        }
                        minPrice = value;
                        rangeInput[0].value = value;
                    } else {
                        if (value < parseInt(priceInput[0].value)) {
                            value = parseInt(priceInput[0].value);
                        }
                        if (value > 50000) value = 50000;
                        maxPrice = value;
                        rangeInput[1].value = value;
                    }
                    input.value = value;
                    updateSliderProgress();
                });
            });

            // Event listeners for range sliders
            rangeInput.forEach((input) => {
                input.addEventListener("input", (e) => {
                    let minVal = parseInt(rangeInput[0].value);
                    let maxVal = parseInt(rangeInput[1].value);

                    if (minVal > maxVal) {
                        if (e.target.classList.contains("range-min")) {
                            minVal = maxVal;
                        } else {
                            maxVal = minVal;
                        }
                    }

                    minPrice = minVal;
                    maxPrice = maxVal;
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    updateSliderProgress();
                });
            });

            // Event listener for Go button
            go.addEventListener("click", applyPriceFilter);

            // Initialize slider progress
            updateSliderProgress();

            // Function to handle search
            const search = () => {
                const searchVal = document.getElementById('search-item').value.toUpperCase();
                const storeItems = document.getElementById('productContainer');
                const products = document.querySelectorAll('.cards');
                const pname = storeItems.getElementsByTagName('h2');
            
                for (let i = 0; i < pname.length; i++) {
                    let match = products[i].getElementsByTagName('h2')[0];
                    if (match) {
                        let textValue = match.textContent || match.innerHTML;
                        if (textValue.toUpperCase().indexOf(searchVal) > -1) {
                            products[i].style.display = "";
                        } else {
                            products[i].style.display = "none";
                        }
                    }
                }
            }
            
            let searchbar = document.getElementById('search-item');
            searchbar.addEventListener('keyup', () => {
                search();
            });
            
            
            const ratingFilter = document.getElementById('rating-filter');
            const checkboxs = ratingFilter.querySelectorAll('input[type="checkbox"]');
            const checkedValues = [];
        
            checkboxs.forEach(function(checkbox) {
            
              checkbox.addEventListener('change', function() {
                
                const value = this.getAttribute('data-value');
                if (this.checked) {
                  checkedValues.push(value);
                } else {
                  const index = checkedValues.indexOf(value);
                  if (index > -1) {
                    checkedValues.splice(index, 1);
                  }
                }
                console.log(checkedValues.length + " : " + checkedValues);
                if(checkedValues.length === 0)
                {
                    if(cateName === 'All')
                    showProductContainer();
                    else
                    showProductContainerCate(cateName);
                }
                else
                {
                    console.log(checkedValues);
                    showProductContainerRating(cateName, checkedValues);
                }
               
              });
            });
           }
          });

          
          