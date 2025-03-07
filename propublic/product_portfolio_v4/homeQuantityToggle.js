export const homeQuantityToggle = (evt, id , stock)=>{
    const currentCardElement= document.querySelector(`#card${id}`);
    const productQuantity = currentCardElement.querySelector(".productQuantity");
    let quantity = parseInt(productQuantity.getAttribute('data-quantity')) || 1;
    if(evt.target.className === "cartIncrement")
        {
            if(quantity < stock)
                {
                    quantity += 1;
                }
            else if(quantity === stock){
                quantity = stock;
            }
        }

        if(evt.target.className === "cartDecrement")
            {
                if(quantity > 1)
                    {
                        quantity -= 1;
                    }
            }
        productQuantity.innerText = quantity;
        productQuantity.setAttribute('data-quantity', quantity);
        return quantity;
        
}