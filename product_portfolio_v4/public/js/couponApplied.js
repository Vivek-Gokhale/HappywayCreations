
export const apply = (discount)=>{
    
    let finalProductPriceElement = document.querySelector(".productFinalTotal");
  
    let currentPrice = parseFloat(finalProductPriceElement.textContent.replace('₹', ''));

    let saving = document.querySelector(".saving");
  
    let savingPrice = parseFloat(saving.textContent.replace('₹', ''));
    
    
    let discountAmount = (discount / 100) * currentPrice;
    
    let newTotalPrice = currentPrice - discountAmount;
    saving.textContent = `₹${(savingPrice+discountAmount).toFixed(2)}`;
    
    finalProductPriceElement.textContent = `₹${newTotalPrice.toFixed(2)}`;
}