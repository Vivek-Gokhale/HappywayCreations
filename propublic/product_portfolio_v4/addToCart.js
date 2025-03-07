// import { getCartProductFromLS } from "./getCartProductFromLS";
import { fetchCartProducts } from "./buttonSetup";
import { getCartProductFromLS } from "./getCartProductFromLS";
import { showToast } from "./showToast";
import { updateCartValue } from "./updateCartValue";




export const addToCart = async (evt, id, userEmail) => {
  
    // let arrLocalStorageProduct = getCartProductFromLS();
    const currentProdElem = document.querySelector(`#card${id}`);
    let quantity = currentProdElem.querySelector(".productQuantity").innerText;
    // let price = currentProdElem.querySelector(".productPrice").innerText;
    // let actualPrice = currentProdElem.querySelector(".productActualPrice").innerText;
    // let taxRate = currentProdElem.querySelector(".tax").value;
    // console.log(id,userEmail,quantity);
    // price = price.replace("₹", "");
    // actualPrice = actualPrice.replace("₹", "");
    // let taxPrice = Number(price * (taxRate / 100)).toFixed(2);

    // let existingProd = arrLocalStorageProduct.find((curProd) => curProd.id === id);

    // if (existingProd && quantity > 1) {
    //     quantity = Number(existingProd.quantity) + Number(quantity);
    //     price = Number(price * quantity);
    //     if (actualPrice !== "") actualPrice = Number(actualPrice * quantity);
    //     else actualPrice = 0;
    //     taxPrice = Number(taxPrice * quantity);
    //     let updatedCart = { id, quantity, price, actualPrice, taxPrice };

    //     updatedCart = arrLocalStorageProduct.map((curProd) => {
    //         return curProd.id === id ? updatedCart : curProd;
    //     });

    //     localStorage.setItem("cartProductLS", JSON.stringify(updatedCart));
    //     // Show toast when product added to the cart
    //     // showToast("add", id);
    // }

    // if (existingProd) {
    //     return false; // Product already exists in local storage
    // }

    // price = Number(price * quantity);
    // if (actualPrice !== "") actualPrice = Number(actualPrice * quantity);
    // else actualPrice = 0;
    // taxPrice = Number(taxPrice * quantity);
    // quantity = Number(quantity);
    // arrLocalStorageProduct.push({ id, quantity, price, actualPrice, taxPrice });
    // localStorage.setItem("cartProductLS", JSON.stringify(arrLocalStorageProduct));

    // updateCartValue(arrLocalStorageProduct);
    // showToast("add", id);

    // Make API call to add product to cart
    
    try {
        const response = await fetch('http://localhost:3000/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, productId: id, quantity })
        });

        if (response.ok) {
            const result = await response.text();
            showToast("add", id);
            
            fetchCartProducts();
            // console.log(result); // Log success message or handle as needed
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add item to cart');
        }
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        // Handle error scenario (e.g., show error message)
    }
};
