import { getWishProductFromLS } from "./getWishProductFromLS";

export const fetchWishlistProductIds = async (userEmail) => {
  try {
    const productObjects = await getWishProductFromLS(userEmail); // Assuming getWishProductFromLS is defined and takes userEmail as parameter

    // Extract product_id fields from the array of objects
    const productIds = productObjects.map(obj => obj.product_id);
   
    return productIds || [];
  } catch (error) {
    console.error('Error fetching wishlist product IDs:', error.message);
    return []; // Return an empty array in case of any error
  }
};
