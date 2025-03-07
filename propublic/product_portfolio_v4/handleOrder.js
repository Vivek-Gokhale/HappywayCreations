export const handleOrder = async (userEmail, amount, cartProducts) => {
    // console.log(userEmail + " : " + amount +;
    
    try {
      const response = await fetch('http://localhost:3000/handle-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail, amount })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Order handled successfully:', result);
        deduceQtyFromDB(cartProducts);
        
      } else {
        console.error('Error handling order:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deduceQtyFromDB = async (cartProducts) => {
    try {
      const response = await fetch('http://localhost:3000/update-product-quantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartProducts })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Product quantities updated successfully:', result);
      } else {
        console.error('Error updating product quantities:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
