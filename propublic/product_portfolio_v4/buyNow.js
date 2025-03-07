// import { handleBuyNow } from "./handleBuyNow";

import { deduceSingleProdQtyFromDB } from "./deduceSingleProdQtyFromDB";
import { getUserDetails } from "./getUserDetails";
import { handleBuyNow } from "./handleBuyNow";



export const buyNow = async (event, id, qty, card) => {
    const quantity = parseInt(qty);

    if (!id || !quantity) {
        alert('Invalid product details');
        return;
    }

    try {
        // Fetch product details from the server using the new endpoint
        const productResponse = await fetch('http://localhost:3000/buy-now', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: id, quantity })
        });

        if (!productResponse.ok) {
            throw new Error(`Error fetching product details: ${productResponse.statusText}`);
        }

        const product = await productResponse.json();

        const { product_mrp, product_discount } = product;
        const discountedPrice = product_mrp - (product_mrp * product_discount / 100);
        const amount = Math.round(discountedPrice * quantity * 100); // total amount in paise, ensure integer
        console.log("final amount " + amount);

        // Create order
        const orderResponse = await fetch('http://localhost:3000/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount, // total amount in paise
                currency: 'INR',
                receipt: `receipt#${Math.floor(Math.random() * 1000000)}`,
            })
        });

        if (!orderResponse.ok) {
            throw new Error(`Error creating order: ${orderResponse.statusText}`);
        }

        const order = await orderResponse.json();
        const userDetails = await getUserDetails(sessionStorage.getItem('userEmail'));
        // Payment options
        const options = {
            key: 'rzp_test_s2VG2G2HwcOQd6',
            amount: order.amount,
            currency: order.currency,
            name: 'Your Company Name',
            description: 'Purchase Transaction',
            order_id: order.id,
            handler: function (response) {
                // Handle the successful payment here
                console.log(response);
                handleBuyNow(sessionStorage.getItem('userEmail'),id, qty, order.amount);
                alert('Payment successful');
                console.log(card);
                let stock = Number(card.textContent);
                card.textContent = `${stock - qty}`;
                deduceSingleProdQtyFromDB(id, qty);
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
        rzp.open();
    } catch (error) {
        console.error('Error:', error.message);
    }
};
