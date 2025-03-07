import products from "./api/products.json";
import { fetchQuantityFromCartLS } from "./fetchQuantityFromCartLS";
import { getCartProductFromLS } from "./getCartProductFromLS";
import { incrementDecrement } from "./incrementDecrement";
import { removeProductFromCart } from "./removeProductFromCart";
import { showToast } from "./showToast";
import { updateCartProductTotal } from "./updateCartProductTotal";
import { updateCartValue } from "./updateCartValue";
// import apply from "./couponApplied"
import coupons from "./api/coupons.json";
import { apply } from "./couponApplied";
import { getWishProductFromLS } from "./getWishProductFromLS";
import { updateWishValue } from "./updateWishListValue";

// import { updateCartProductTotal } from "./updateCartProductTotal";
import { subscribe } from './subscribe.js';
import { isLoggedIn } from "./loginStatus.js";
import { redirectToLogin } from "./redirectToLogin.js";
import { getProductDetailsFromServer } from "./getProductDetailsFromServer.js";
import { handleOrder } from "./handleOrder.js";
import { getUserDetails } from "./getUserDetails.js";
console.log(coupons);
// import coupons from './api/coupons.json';



const couponField = document.querySelector('.coupon-entry');
const couponList = document.getElementById('couponList');


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
  const subscribeButton = document.querySelector('.subscribe');
  if (subscribeButton) {
    subscribeButton.addEventListener('click', (event) => subscribe(event));
  }


  const checkAndStoreCoupon = async (couponCode, appliedCoupons) => {
    try {
      // console.log("vkc price");
  
      // Check if appliedCoupons is null or not valid JSON
      if (!appliedCoupons) {
        appliedCoupons = []; // Initialize as empty array if null or invalid
      } 
  
      if (appliedCoupons.includes(couponCode)) {
        document.querySelector(".coupon-entry").value = "";
        showToast("duplicate", couponCode);
        return false;
      } else {
        appliedCoupons.push(couponCode);
        let userEmail = sessionStorage.getItem('userEmail');
        
        // Make API call to insert coupon code into database
        const response = await fetch('http://localhost:3000/insert-coupon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ couponCode, userEmail})
        });
  
        if (!response.ok) {
          throw new Error('Failed to insert coupon into database');
        }
  
        const { success } = await response.json();
  
        if (success) {
          return true; // Coupon applied successfully and stored locally
        } else {
          // showToast('error', 'Failed to apply coupon'); // Show error toast if database operation failed
          return false;
        }
      }
    } catch (error) {
      console.error('Error applying or inserting coupon:', error);
      showToast('error', 'Failed to apply coupon');
      return false; // Return false in case of error
    }
  };


  function displayCouponList(availableCoupons) {
    couponList.innerHTML = '';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Coupon Code', 'Discount', ''];
    headers.forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.textAlign = 'left';
      th.style.padding = '10px';
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    availableCoupons.forEach(coupon => {
      const row = document.createElement('tr');

      const codeCell = document.createElement('td');
      codeCell.textContent = coupon.coupon_code;
      codeCell.style.padding = '10px';

      const discountCell = document.createElement('td');
      discountCell.textContent = `${coupon.coupon_percentage}% off`;
      discountCell.style.padding = '10px';

      const actionCell = document.createElement('td');
      const applyButton = document.createElement('button');
      applyButton.className = 'apply-coupon-btn';
      applyButton.textContent = 'Use';
      applyButton.style.padding ="10px 20px";
      applyButton.style.borderRadius = "10px";
      applyButton.style.outline = "none";
      applyButton.dataset.code = coupon.coupon_code;
      applyButton.addEventListener('click', () => {
        couponField.value = coupon.coupon_code;
        $('#coupon-suggestion').modal('hide'); // Hide the modal once a coupon is selected
      });
      actionCell.appendChild(applyButton);
      actionCell.style.padding = '10px';

      row.appendChild(codeCell);
      row.appendChild(discountCell);
      row.appendChild(actionCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    couponList.appendChild(table);
  }
 

  document.addEventListener('DOMContentLoaded', async () => {
    if (isLoggedIn()) {
      await handleCouponApplication();
    } else {
      let applyCoupon = document.querySelector(".apply-coupon");
      applyCoupon.addEventListener('click', redirectToLogin);
    }
  });
  
  const handleCouponApplication = async () => {
    let availableCoupons;
    let usedCoupons;
    const userEmail = sessionStorage.getItem('userEmail'); // Assume the user email is stored in sessionStorage
  
    try {
      // Fetch all coupons
      const couponsResponse = await fetch('http://localhost:3000/get-coupons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const couponsData = await couponsResponse.json();
      const coupons = couponsData.coupons;
  
      // Fetch applied coupons for the user
      const appliedCouponsResponse = await fetch('http://localhost:3000/get-applied-coupons-temp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail })
      });
      const appliedCouponsData = await appliedCouponsResponse.json();
      usedCoupons = appliedCouponsData.couponCodes;
  
      // Filter out the used coupons
      availableCoupons = coupons.filter(coupon => !usedCoupons.includes(coupon.coupon_code));
      
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  
    let couponField = document.querySelector('.coupon-entry');
    couponField.addEventListener('focus', displayCouponList(availableCoupons));
  
    let applyCoupon = document.querySelector(".apply-coupon");
    if (applyCoupon) {
      const cartProducts = await getCartProductFromLS();
  
      applyCoupon.addEventListener('click', () => {
        if (cartProducts.length === 0) {
          showToast("empty");
        } else {
          let couponCode = document.querySelector('.coupon-entry').value.trim();
          let cCode = "", cDiscount;
          availableCoupons.forEach((currCoupon) => {
            const { coupon_code, coupon_percentage } = currCoupon;
            if (couponCode === coupon_code) {
              cCode = coupon_code;
              cDiscount = coupon_percentage;
            }
          });
  
          if (cCode !== "") {
            // Apply the discount
            if (checkAndStoreCoupon(couponCode, usedCoupons)) {
              updateCartProductTotal();
              handleCouponApplication();

              document.querySelector(".coupon-entry").value = "";
              showToast("applied", parseInt(cDiscount));
            }
          } else {
            document.querySelector(".coupon-entry").value = "";
            showToast("invalid");
          }
        }
      });
    }
  };
  







// console.log(filterProducts);

// -----------------------------------------------------
// to update the addToCart page
// --------------------------------------------------------

if (isLoggedIn()) {
  document.querySelector('.proceed-to-pay').addEventListener('click', async () => {
    let cartProducts = await getCartProductFromLS();
    console.log(cartProducts);
    if (cartProducts.length === 0) {
      showToast("empty-basket");
    } else {
      try {
        let productIds = cartProducts.map(product => product.product_id);

        // Fetch product details for all products in cart
        const productResponse = await fetch('http://localhost:3000/get-cart-buy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ product_ids: productIds })
        });

        if (!productResponse.ok) {
          throw new Error(`Error fetching product details: ${productResponse.statusText}`);
        }

        const productDetails = await productResponse.json();

        let totalAmount = 0;
        
        cartProducts.forEach(product => {
          const details = productDetails.find(p => p.product_id === product.product_id);
          if (details) {
            const productQuantity = Number(product.product_qty);
            const productMrp = Number(details.product_mrp);
            const productDiscount = Number(details.product_discount);

            if (!isNaN(productQuantity) && !isNaN(productMrp) && !isNaN(productDiscount)) {
              const discountedPrice = productMrp - (productMrp * productDiscount / 100);
              totalAmount += discountedPrice * productQuantity;
            } else {
              console.error(`Invalid quantity or prices for product: ${product.product_id}`);
            }
          } else {
            console.error(`Details not found for product: ${product.product_id}`);
          }
        });

        let userEmail = sessionStorage.getItem('userEmail');
        const appliedCouponsResponse = await fetch('http://localhost:3000/get-applied-coupons-discount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userEmail })
        });

        if (!appliedCouponsResponse.ok) {
          throw new Error(`Error fetching applied coupons: ${appliedCouponsResponse.statusText}`);
        }

        const appliedCouponsData = await appliedCouponsResponse.json();
        const couponDiscountPercentage = appliedCouponsData.discount;
        const discountAmount = (totalAmount * couponDiscountPercentage) / 100;
        const finalAmount = totalAmount - discountAmount;

        const amountInPaise = Math.round(finalAmount * 100); // Convert to paise
        console.log("Total Amount in Paise:", amountInPaise);

        // Create order
        const orderResponse = await fetch('http://localhost:3000/createOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt#${Math.floor(Math.random() * 1000000)}`,
          })
        });

        if (!orderResponse.ok) {
          throw new Error(`Error creating order: ${orderResponse.statusText}`);
        }

        const order = await orderResponse.json();

        const userDetails = await getUserDetails(sessionStorage.getItem('userEmail'));

  const options = {
    key: 'rzp_test_s2VG2G2HwcOQd6', // Replace with your actual key ID from Razorpay Dashboard
    amount: order.amount,
    currency: order.currency,
    name: 'Your Company Name',
    description: 'Purchase Transaction',
    order_id: order.id,
    handler: function (response) {
      // Handle the successful payment here
      console.log(response);
      alert('Payment successful');
      
      handleOrder(userEmail, order.amount, cartProducts); 
      document.querySelector("#productList").remove();
      
      let basket = document.querySelector("#basketSummary");
      
      basket.querySelector(".originalPrice").textContent = "₹0.00";
      basket.querySelector(".saving").textContent = "₹0.00";
      basket.querySelector(".productTax").textContent = "₹0.00";
      basket.querySelector(".productFinalTotal").textContent = "₹0.00";
    },
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
    },
    theme: {
      color: '#3399cc',
    },
  };
        const rzp = new Razorpay(options);

        rzp.on('payment.failed', function (response) {
          console.error(response.error);
          alert('Payment failed. Please try again.');
        });

        rzp.open();
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}


else
 {
  document.querySelector('.proceed-to-pay').addEventListener('click', redirectToLogin);
 }
 
 const fetchAndShowCartProducts = async () => {
  const cartProductLS = await getCartProductFromLS();
  if (cartProductLS.length > 0) {
    const productIds = cartProductLS.map(prod => prod.product_id);
    const filterProducts = await getProductDetailsFromServer(productIds);

    const productsWithQty = filterProducts.map(product => {
      const matchedProduct = cartProductLS.find(cartProd => cartProd.product_id === product.product_id);
      return {
        ...product,
        product_qty: matchedProduct ? matchedProduct.product_qty : 0
      };
    });

    const productList = document.querySelector("#productList");
    const productTemplate = document.querySelector("#productCartTemplate");

    productsWithQty.forEach((curProd) => {
      const { product_id, product_name, product_image, no_of_items, product_mrp, product_qty, product_discount } = curProd;

      let productClone = document.importNode(productTemplate.content, true);

      productClone.querySelector("#cardValue").setAttribute("id", `card${product_id}`);
      productClone.querySelector('.productNameLink').dataset.id = product_id;
      productClone.querySelector('.productNameLink').href = `singleProductPage.html?id=${product_id}`;

      productClone.querySelector(".productName").textContent = product_name;
      if (no_of_items > 0) {
        productClone.querySelector(".category").textContent = "In Stock";
        productClone.querySelector(".category").style.backgroundColor = "#9aedb6";
      } else {
        productClone.querySelector(".category").textContent = "Not Available";
      }

      productClone.querySelector(".productImage").src = product_image[0];
      productClone.querySelector(".productQuantity").textContent = product_qty;

      let finalPrice = product_mrp;
      let singleProductFinalPrice = finalPrice;
      if (product_discount) {
        finalPrice = product_mrp - (product_mrp * product_discount / 100);
        singleProductFinalPrice = finalPrice;
      }
      finalPrice = finalPrice * product_qty;

      productClone.querySelector(".product-price").textContent = "₹" + finalPrice.toFixed(2);

      productClone.querySelector(".stockElement").addEventListener("click", (event) => {
        incrementDecrement(event, product_id, no_of_items,singleProductFinalPrice);
      });

      productClone.querySelector(".remove-to-cart-button").addEventListener("click", () => {
        removeProductFromCart(product_id, sessionStorage.getItem('userEmail'));
        
      });

      productList.appendChild(productClone);
    });
  }
};

if (isLoggedIn()) {
  fetchAndShowCartProducts();
}

// updateCartValue(cartProducts);
// -----------------------------------------------------
// Showing the cartProducts
// --------------------------------------------------------


// -----------------------------------------------------
// calculating the card total in our cartProducts page
// --------------------------------------------------------
 updateCartProductTotal();

 
// let wishProductLS = getWishProductFromLS();
// updateWishValue(wishProductLS);


// coupon.js
