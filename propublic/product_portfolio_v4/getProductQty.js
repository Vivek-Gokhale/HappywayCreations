export const getProductQuantity = ()=>{
    const quantityElement = document.querySelector('.productQuantity');
    if (quantityElement) {
        return parseInt(quantityElement.textContent);
    }
    return 1; // Return 0 if element is not found or content is not a number
}
