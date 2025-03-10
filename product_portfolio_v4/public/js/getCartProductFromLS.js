export const getCartProductFromLS = async () => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        return [];
    }

    try {
        const response = await fetch('https://happywaycreations.147.93.106.209.nip.io/get-cart-products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail })
        });

        if (response.ok) {
            const cartProducts = await response.json();
            console.log(cartProducts);
            return cartProducts;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch cart products');
        }
    } catch (error) {
        console.error('Error fetching cart products:', error.message);
        return [];
    }
};
