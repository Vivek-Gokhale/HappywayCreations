export const isAlreadyReviewed = async (orderId, productId) => {
   
    let userEmail = sessionStorage.getItem('userEmail');
    
    if (!userEmail) {
        console.error('User email not found in session storage');
        return false;
    }

    try {
        // Check if the record exists in product_review table
        const response = await fetch('http://localhost:3000/checkProductReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, productId, orderId })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch product review status');
        }
        
        const data = await response.json();
        console.log("pid " + productId + ", oid " + orderId + " : " + data.exists);
        // console.log();
        return data.exists; // Assuming the API returns { exists: true/false }
        
    } catch (error) {
        console.error('Error checking review status:', error);
        return false;
    }
};
