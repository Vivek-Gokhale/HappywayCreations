export const getWishProductFromLS = async () => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        return [];
    }

    try {
        const response = await fetch('https://happywaycreations.147.93.106.209.nip.io/get-wishlist-products', {
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
