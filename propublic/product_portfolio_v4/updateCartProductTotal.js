import { getCartProductFromLS } from "./getCartProductFromLS";
import { isLoggedIn } from "./loginStatus";

export const updateCartProductTotal = async () => {
  if (isLoggedIn()) {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const localCartProducts = await getCartProductFromLS();
      if (localCartProducts.length === 0) {
        document.querySelector(".originalPrice").textContent = `₹0.00`;
        document.querySelector(".productFinalTotal").textContent = `₹0.00`;
        document.querySelector(".saving").textContent = `₹0.00`;
        document.querySelector(".productTax").textContent = `₹0.00`;
        return;
      }
      const productIds = localCartProducts.map(product => product.product_id);

      // Fetch product details
      const productDetailsResponse = await fetch('http://localhost:3000/get-product-cart-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productIds })
      });

      if (!productDetailsResponse.ok) {
        throw new Error('Failed to fetch product details');
      }

      const { products } = await productDetailsResponse.json();

      // Fetch applied coupons for the user
      const appliedCouponsResponse = await fetch('http://localhost:3000/get-applied-coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail })
      });

      if (!appliedCouponsResponse.ok) {
        throw new Error('Failed to fetch applied coupons');
      }

      const { couponCodes } = await appliedCouponsResponse.json();
      
      // Fetch coupon details
      const couponDetailsResponse = await fetch('http://localhost:3000/get-coupons-applied', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ couponCodes })
      });

      if (!couponDetailsResponse.ok) {
        throw new Error('Failed to fetch coupon details');
      }

      const { coupons } = await couponDetailsResponse.json();
      console.log("my coupons" + coupons);
      let productOriginalPrice = document.querySelector(".originalPrice");
      let productFinalTotal = document.querySelector(".productFinalTotal");
      let youSave = document.querySelector(".saving");
      let taxes = document.querySelector(".productTax");

      let totalProductPrice = 0;
      let totalProductActualPrice = 0;
      let totalProductTaxPrice = 0;

      localCartProducts.forEach(cartProduct => {
        const productDetail = products.find(product => product.product_id === cartProduct.product_id);
        if (productDetail) {
          const productQty = Number(cartProduct.product_qty);
          const productMRP = Number(productDetail.product_mrp);
          const productDiscount = Number(productDetail.product_discount);
          const productTax = Number(productDetail.tax);

          const discountedPrice = productMRP - (productMRP * (productDiscount / 100));
          const productPrice = discountedPrice * productQty;
          const actualPrice = productMRP * productQty;
          const taxPrice = (discountedPrice * (productTax / 100)) * productQty;

          totalProductPrice += productPrice;
          totalProductActualPrice += actualPrice;
          totalProductTaxPrice += taxPrice;
        }
      });

      // Calculate additional savings from coupons
      let additionalDiscount = 0;
      coupons.forEach(coupon => {
        const couponDiscount = Number(coupon.coupon_percentage);
        additionalDiscount += (totalProductPrice * (couponDiscount / 100));
      });

      const totalSavings = (totalProductActualPrice - totalProductPrice) + additionalDiscount;
      const finalTotal = totalProductPrice - additionalDiscount;

      // Ensure to handle cases where products are not found or arrays are empty
      productOriginalPrice.textContent = `₹${totalProductActualPrice.toFixed(2)}`;
      taxes.textContent = `₹${totalProductTaxPrice.toFixed(2)}`;
      youSave.textContent = `₹${totalSavings.toFixed(2)}`;
      productFinalTotal.textContent = `₹${finalTotal.toFixed(2)}`;

    } catch (error) {
      console.error('Error updating cart product total:', error);
    }
  }
};
