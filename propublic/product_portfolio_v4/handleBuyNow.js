export const handleBuyNow = async (userEmail, productId, productQty, amount) => {
    console.log(userEmail + " : " + productId + " : " + productQty + " : " + amount);
  
    try {
      const response = await fetch('http://localhost:3000/handle-buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail, productId, productQty, amount })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Order handled successfully:', result);
        
      } else {
        console.error('Error handling order:', result);
        alert('Failed to place order: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while placing the order');
    }
  };
  