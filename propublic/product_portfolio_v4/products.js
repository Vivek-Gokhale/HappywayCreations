import { showProductContainer, showProductContainerCate, showProductContainerCateWithDiscount, showProductContainerColor, showProductContainerPrice, showProductContainerRating } from "./productPageCards";
import { getCartProductFromLS } from "./getCartProductFromLS";
import { updateCartValue } from "./updateCartValue";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { updateWishValue } from "./updateWishListValue";


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
                        
                    } else {
                        option.selected = false;
                    }
                });
            }

            async function fetchCategories() {
                try {
                    const response = await fetch('http://localhost:3000/categories'); // Replace with your API endpoint
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const categories = await response.json();
            
                    // Populate the combobox with categories
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.category_name;
                        option.innerHTML = `&emsp;${category.category_name}`;
                        option.classList.add('cate');
                        productCate.appendChild(option);
                    });
            
                    // Call function to add event listeners to new items
                    addCategoryEventListeners();
                    updateSelectedOption(cateName);
            
                } catch (error) {
                    console.error('Failed to fetch categories:', error);
                }
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
                            input.value = color; // Assuming the color value is directly provided
            
                            const colorCircle = document.createElement('div');
                            colorCircle.classList.add('color-circle');
                            colorCircle.style.backgroundColor = color.toLowerCase(); // Use the color name as background color
            
                            label.appendChild(input);
                            label.appendChild(colorCircle);
            
                            colorGrid.appendChild(label);
            
                            // Add event listener to the radio button
                            input.addEventListener('change', () => {
                              
                                showProductContainerColor(input.value, cateName);
                            });
                        });
                    }
            
                } catch (error) {
                    console.error('Failed to fetch colors:', error);
                }
            }
            
            
            
            
            // Function to add event listeners to category items
            function addCategoryEventListeners() {
                let cate = document.querySelectorAll(".cate");
                
                cate.forEach((currCate) => {
                      
                    currCate.addEventListener('click', () => {
                       
                        if (currCate.value == 'All') {
                            cateName = 'All';
                            showProductContainer();
                            fetchColors(cateName);
                        } else {
                            cateName = currCate.value;
                            showProductContainerCate(currCate.value);
                            fetchColors(cateName);
                        }
                    });
                });
            }
            
            // Call fetchCategories function
            fetchCategories();
            fetchColors(cateName);
            
            // showProductContainerCate(cateName);
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
const checkboxes = document.querySelectorAll('.price-label input');

function updateSelectedRange() {
    let minSelected = Number.POSITIVE_INFINITY;
    let maxSelected = Number.NEGATIVE_INFINITY;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const min = parseInt(checkbox.getAttribute('data-min'));
            const max = parseInt(checkbox.getAttribute('data-max'));
            if (min < minSelected) minSelected = min;
            if (max > maxSelected) maxSelected = max;
        }
    });

    if (minSelected === Number.POSITIVE_INFINITY || maxSelected === Number.NEGATIVE_INFINITY) {
        if (cateName == "All") {
            showProductContainer();
        } else {
            showProductContainerCate(cateName);
        }
    } else {
        showProductContainerPrice(cateName, minSelected, maxSelected);
    }
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectedRange);
});

// Initialize the selected range on page load
updateSelectedRange();

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


const go = document.querySelector(".go");
        const rangeInput = document.querySelectorAll(".range-input input"),
            priceInput = document.querySelectorAll(".price-input input"),
            range = document.querySelector(".slider .progress");
        let priceGap = 1000;

        priceInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minPrice = parseInt(priceInput[0].value),
                    maxPrice = parseInt(priceInput[1].value);

                if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
                    if (e.target.className === "input-min") {
                        rangeInput[0].value = minPrice;
                        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";

                    } else {
                        rangeInput[1].value = maxPrice;
                        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                    }
                }
            });
        });

        rangeInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minVal = parseInt(rangeInput[0].value),
                    maxVal = parseInt(rangeInput[1].value);

                if (maxVal - minVal < priceGap) {
                    if (e.target.className === "range-min") {
                        rangeInput[0].value = maxVal - priceGap;
                       
                    } else {
                        rangeInput[1].value = minVal + priceGap;
                        
                    }
                  

                } else {
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                   
                }
            });
        });

        go.addEventListener("click", () => {
            const minSelected = rangeInput[0].value;
            const maxSelected = rangeInput[1].value;
           

            showProductContainerPrice(cateName, minSelected, maxSelected);
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

            async function fetchCategories() {
                try {
                    const response = await fetch('http://localhost:3000/categories'); // Replace with your API endpoint
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const categories = await response.json();
            
                    // Populate the combobox with categories
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.category_name;
                        option.innerHTML = `&emsp;${category.category_name}`;
                        option.classList.add('cate');
                        productCate.appendChild(option);
                    });
            
                    // Call function to add event listeners to new items
                    addCategoryEventListeners();
                    updateSelectedOption(cateName);
            
                } catch (error) {
                    console.error('Failed to fetch categories:', error);
                }
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
                            input.value = color; // Assuming the color value is directly provided
            
                            const colorCircle = document.createElement('div');
                            colorCircle.classList.add('color-circle');
                            colorCircle.style.backgroundColor = color.toLowerCase(); // Use the color name as background color
            
                            label.appendChild(input);
                            label.appendChild(colorCircle);
            
                            colorGrid.appendChild(label);
            
                            // Add event listener to the radio button
                            input.addEventListener('change', () => {
                              
                                showProductContainerColor(input.value, cateName);
                            });
                        });
                    }
            
                } catch (error) {
                    console.error('Failed to fetch colors:', error);
                }
            }
            
            
            
            
            // Function to add event listeners to category items
            function addCategoryEventListeners() {
                let cate = document.querySelectorAll(".cate");
                
                cate.forEach((currCate) => {
                      
                    currCate.addEventListener('click', () => {
                       
                        if (currCate.value == 'All') {
                            cateName = 'All';
                            showProductContainer();
                            fetchColors(cateName);
                        } else {
                            cateName = currCate.value;
                            showProductContainerCate(currCate.value);
                            fetchColors(cateName);
                        }
                    });
                });
            }
            
            // Call fetchCategories function
            fetchCategories();
            fetchColors(cateName);
            // showProductContainerCate(cateName);
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
const checkboxes = document.querySelectorAll('.price-label input');

function updateSelectedRange() {
    let minSelected = Number.POSITIVE_INFINITY;
    let maxSelected = Number.NEGATIVE_INFINITY;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const min = parseInt(checkbox.getAttribute('data-min'));
            const max = parseInt(checkbox.getAttribute('data-max'));
            if (min < minSelected) minSelected = min;
            if (max > maxSelected) maxSelected = max;
        }
    });

    if (minSelected === Number.POSITIVE_INFINITY || maxSelected === Number.NEGATIVE_INFINITY) {
        if (cateName == "All") {
            showProductContainer();
        } else {
            // showProductContainerCate(cateName);
        }
    } else {
        showProductContainerPrice(cateName, minSelected, maxSelected);
    }
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectedRange);
});

// Initialize the selected range on page load
updateSelectedRange();

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


const go = document.querySelector(".go");
        const rangeInput = document.querySelectorAll(".range-input input"),
            priceInput = document.querySelectorAll(".price-input input"),
            range = document.querySelector(".slider .progress");
        let priceGap = 1000;

        priceInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minPrice = parseInt(priceInput[0].value),
                    maxPrice = parseInt(priceInput[1].value);

                if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
                    if (e.target.className === "input-min") {
                        rangeInput[0].value = minPrice;
                        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";

                    } else {
                        rangeInput[1].value = maxPrice;
                        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                    }
                }
            });
        });

        rangeInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minVal = parseInt(rangeInput[0].value),
                    maxVal = parseInt(rangeInput[1].value);

                if (maxVal - minVal < priceGap) {
                    if (e.target.className === "range-min") {
                        rangeInput[0].value = maxVal - priceGap;
                       
                    } else {
                        rangeInput[1].value = minVal + priceGap;
                        
                    }
                  

                } else {
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                   
                }
            });
        });

        go.addEventListener("click", () => {
            const minSelected = rangeInput[0].value;
            const maxSelected = rangeInput[1].value;
           

            showProductContainerPrice(cateName, minSelected, maxSelected);
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
           else
           {
            const productCate = document.querySelector(".productCate");
            const colorGrid = document.querySelector(".color-grid");
            let cateName = "All";
            
            async function fetchCategories() {
                try {
                    const response = await fetch('http://localhost:3000/categories'); // Replace with your API endpoint
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const categories = await response.json();
            
                    // Populate the combobox with categories
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.category_name;
                        option.innerHTML = `&emsp;${category.category_name}`;
                        option.classList.add('cate');
                        productCate.appendChild(option);
                    });
            
                    // Call function to add event listeners to new items
                    addCategoryEventListeners();
            
                } catch (error) {
                    console.error('Failed to fetch categories:', error);
                }
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
                            input.value = color; // Assuming the color value is directly provided
            
                            const colorCircle = document.createElement('div');
                            colorCircle.classList.add('color-circle');
                            colorCircle.style.backgroundColor = color.toLowerCase(); // Use the color name as background color
            
                            label.appendChild(input);
                            label.appendChild(colorCircle);
            
                            colorGrid.appendChild(label);
            
                            // Add event listener to the radio button
                            input.addEventListener('change', () => {
                              
                                showProductContainerColor(input.value, cateName);
                            });
                        });
                    }
            
                } catch (error) {
                    console.error('Failed to fetch colors:', error);
                }
            }
            
            
            
            
            // Function to add event listeners to category items
            function addCategoryEventListeners() {
                let cate = document.querySelectorAll(".cate");
                
                cate.forEach((currCate) => {
                    currCate.addEventListener('click', () => {
                        if (currCate.value == 'All') {
                            cateName = 'All';
                            showProductContainer();
                            fetchColors(cateName);
                        } else {
                            cateName = currCate.value;
                            showProductContainerCate(currCate.value);
                            fetchColors(cateName);
                        }
                    });
                });
            }
            
            // Call fetchCategories function
            fetchCategories();
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
            const checkboxes = document.querySelectorAll('.price-label input');
            
            function updateSelectedRange() {
                let minSelected = Number.POSITIVE_INFINITY;
                let maxSelected = Number.NEGATIVE_INFINITY;
            
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        const min = parseInt(checkbox.getAttribute('data-min'));
                        const max = parseInt(checkbox.getAttribute('data-max'));
                        if (min < minSelected) minSelected = min;
                        if (max > maxSelected) maxSelected = max;
                    }
                });
            
                if (minSelected === Number.POSITIVE_INFINITY || maxSelected === Number.NEGATIVE_INFINITY) {
                    if (cateName == "All") {
                        showProductContainer();
                    } else {
                        showProductContainerCate(cateName);
                    }
                } else {
                    showProductContainerPrice(cateName, minSelected, maxSelected);
                }
            }
            
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateSelectedRange);
            });
            
            // Initialize the selected range on page load
            updateSelectedRange();
            
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
            
            
            const go = document.querySelector(".go");
                    const rangeInput = document.querySelectorAll(".range-input input"),
                        priceInput = document.querySelectorAll(".price-input input"),
                        range = document.querySelector(".slider .progress");
                    let priceGap = 1000;
            
                    priceInput.forEach((input) => {
                        input.addEventListener("input", (e) => {
                            let minPrice = parseInt(priceInput[0].value),
                                maxPrice = parseInt(priceInput[1].value);
            
                            if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
                                if (e.target.className === "input-min") {
                                    rangeInput[0].value = minPrice;
                                    range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
            
                                } else {
                                    rangeInput[1].value = maxPrice;
                                    range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                                }
                            }
                        });
                    });
            
                    rangeInput.forEach((input) => {
                        input.addEventListener("input", (e) => {
                            let minVal = parseInt(rangeInput[0].value),
                                maxVal = parseInt(rangeInput[1].value);
            
                            if (maxVal - minVal < priceGap) {
                                if (e.target.className === "range-min") {
                                    rangeInput[0].value = maxVal - priceGap;
                                   
                                } else {
                                    rangeInput[1].value = minVal + priceGap;
                                    
                                }
                              
            
                            } else {
                                priceInput[0].value = minVal;
                                priceInput[1].value = maxVal;
                                range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                                range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                               
                            }
                        });
                    });
            
                    go.addEventListener("click", () => {
                        const minSelected = rangeInput[0].value;
                        const maxSelected = rangeInput[1].value;
                       
            
                        showProductContainerPrice(cateName, minSelected, maxSelected);
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
          