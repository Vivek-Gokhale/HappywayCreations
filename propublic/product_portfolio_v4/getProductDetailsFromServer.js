export const getProductDetailsFromServer = async (productIds) => {
    try {
        const response = await fetch('http://localhost:3000/get-product-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productIds })
        });

        if (response.ok) {
            const productDetails = await response.json();
            return productDetails;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch product details');
        }
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        return [];
    }
};
