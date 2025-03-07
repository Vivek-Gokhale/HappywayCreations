
import { getWishProductFromLS } from "./getWishProductFromLS";

export const fetchQuantityFromWishLS = (id, price)=>{
    let wishProducts = getWishProductFromLS();
    let existingProduct = wishProducts.find((currProd)=> currProd.id === id);
    let quantity = 1;
    if(existingProduct){
        quantity = existingProduct.quantity;
        price = existingProduct.price;
    }
    return {quantity, price};
}