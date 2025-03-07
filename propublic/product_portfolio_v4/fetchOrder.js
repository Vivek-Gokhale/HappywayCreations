import { isAlreadyReviewed } from "./checkAlreadyReviewed";
import { isLoggedIn } from "./loginStatus";

document.addEventListener("DOMContentLoaded", async function () {
  async function fetchUserOrders(email) {
    try {
      const response = await fetch("http://localhost:3000/getUserOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user orders");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error; // Rethrow the error to handle it further
    }
  }

  function formatDate(dateString) {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .replace(/ /g, "-");
  }

  function formatAmount(amountInPaisa) {
    return (amountInPaisa / 100).toFixed(2);
  }

  async function loadOrders() {
    const email = sessionStorage.getItem("userEmail");
    if (!email) {
      console.error("No email found in session storage.");
      return;
    }

    try {
      const data = await fetchUserOrders(email);
      const { orders, products } = data;

      const orderContainer = document.querySelector(".order-container");
      const orderTemplate = document.getElementById("order-template");
      const orderItemTemplate = document.getElementById("order-item-template");

      for (const order of orders) {
        const orderClone = document.importNode(orderTemplate.content, true);
        orderClone.querySelector(".order-date").textContent = formatDate(
          order.order_date
        );
        orderClone.querySelector(".order-status").textContent =
          order.delivery_status;

        orderClone.querySelector(".order-total").textContent = `${formatAmount(
          order.total_amount
        )}`;
        orderClone.querySelector(".order-id").textContent = order.order_id;

        const orderProducts = orderClone.querySelector(".order-products");
        const productIds = JSON.parse(order.product_ids);
        const productQtys = order.product_qtys;

        for (const [index, productId] of productIds.entries()) {
          const product = products.find((p) => p.product_id === productId);
          if (product) {
            const productClone = document.importNode(
              orderItemTemplate.content,
              true
            );
            // Use index to access the first image
            productClone.querySelector(".product-image").src =
              product.product_image[1] || product.product_image[0];
            productClone.querySelector(".product-name").textContent =
              product.product_name;

            productClone.querySelector(".product-quantity").textContent =
              productQtys[index];

            productClone.querySelector(
              ".order-item"
            ).id = `card${product.product_id}`;

            productClone.querySelector(
              "a"
            ).href = `singleProductPage.html?id=${product.product_id}`;

            const reviewHolder = productClone.querySelector("#reviewHolder");

            // Debug log to check the parameters passed to isAlreadyReviewed
            console.log("Checking review for Order ID:", order.order_id, "Product ID:", product.product_id);

            if (order.delivery_status === "Completed") {
              const alreadyReviewed = await isAlreadyReviewed(order.order_id, product.product_id);
              if (!alreadyReviewed) {
                const button = document.createElement("button");
                button.className = "review";
                button.textContent = "Write product review";
                button.addEventListener("click", () => {
                  window.location.href = `createReview.html?pid=${product.product_id}&oid=${order.order_id}`;
                });
                reviewHolder.appendChild(button);
              } else {
                const message = document.createElement("p");
                message.className = "already-reviewed";
                message.innerHTML =
                  "<i class='fa-solid fa-circle-check fa-lg'></i> Already reviewed";
                reviewHolder.appendChild(message);
              }
            }

            orderProducts.appendChild(productClone);
          }
        }

        if (order.delivery_status === "Delivered") {
          orderClone.querySelector(".order-status").style.backgroundColor =
            "#9aedb6";
        }

        orderContainer.appendChild(orderClone);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  }

  if (isLoggedIn()) {
    loadOrders();
  } else {
    window.location.href = "index.html";
  }
});
