document.addEventListener("DOMContentLoaded", function () {
  const acceptButtons = document.querySelectorAll(".accept-order");
  acceptButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const orderId = this.dataset.orderId;
      fetch("update_order_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId, status: "accepted" }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Order accepted successfully");
            location.reload();
          } else {
            alert("Failed to accept order");
          }
        });
    });
  });

  const completeButtons = document.querySelectorAll(".complete-order");
  completeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const orderId = this.dataset.orderId;
      fetch("update_order_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId, status: "completed" }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Order marked as completed");
            location.reload();
          } else {
            alert("Failed to mark order as completed");
          }
        });
    });
  });
});
