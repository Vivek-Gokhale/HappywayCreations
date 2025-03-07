export const getWishProductFromLS = async () => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        return [];
    }

    try {
        const response = await fetch('http://localhost:3000/get-wishlist-products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail })
        });

        if (response.ok) {
            const wishProducts = await response.json();
            return wishProducts;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch wishlist products');
        }
    } catch (error) {
        console.error('Error fetching wishlist products:', error.message);
        return [];
    }
};
