export function showToast(operation, id) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.style.border = "none";
    toast.style.backgroundColor = "#1E712A";
    toast.style.color = "white";
    toast.style.fontSize = "18px";
  // Set the text content of the toast based on the operation
  if (operation === "add") {
   
    // toast.style.border=none;
    toast.textContent = `Product added to cart.`;
  }else if(operation === "wish")
    {
      toast.textContent = `Product added to wishlist`;
    } 
  else if(operation === "empty")
    {
      
    // toast.style.border=none;
    toast.textContent = `Oops ! Basket is empty`;
    } 
    else if(operation === "payment")
      {
     
    // toast.style.border=none;
    toast.textContent = `Oops ! Basket is empty`;
      }
    else if(operation === "subscribed")
      {
        toast.textContent = `Subscription successful`;
      }
        else if(operation === "already-subscribed")
          {
            toast.textContent = `Already Subscribed`;
          }
        else if(operation === "subscribed-failed")
          {
            toast.textContent = `Subscription failed. Please try again.`;
          }
    else if(operation === "applied")
      {
        toast.textContent = `Coupon applied! You saved ${id}%`;
      }
    else if(operation === "invalid")
      {
        toast.textContent = `Invalid Coupon`;
      }
    else if(operation === "duplicate")
      {
        toast.textContent =  `${id} is already used`;
      }
  else if(operation == "removed"){
    
    toast.textContent = `Product removed`;
  }
  else if(operation == "removed"){
    
    toast.textContent = `Product removed`;
  }else if(operation == "empty-basket")
    {
      toast.textContent = `Basket is empty`;
    }

  document.body.appendChild(toast);

  // Automatically remove the toast after a few seconds
  setTimeout(() => {
    toast.remove();
  }, 2000);
}
