import { fetchWishlistProductIds } from './fetchWishlistProductIds'; // Adjust the path as necessary
import { isLoggedIn } from './loginStatus';

export const checkWishlistStatus = async (productId, wishListIcon) => {
  if (!isLoggedIn()) {
    return false; // Not logged in, wishlist status cannot be checked
  }
  
  
  try {
    const productIds = await fetchWishlistProductIds(); // Fetch wishlist product IDs
    console.log(productIds);
    // Check if productId exists in the productIds array
    const isInWishlist = productIds.includes(productId);
    // console.log(productId +" : "+isInWishlist);
    if(isInWishlist)
      {
        wishListIcon.classList.replace('fa-regular', 'fa-solid');
        wishListIcon.style.color = 'red';
      }
    return isInWishlist; // Return true if productId exists in wishlist, false otherwise
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false; // Return false in case of any error
  }
};
