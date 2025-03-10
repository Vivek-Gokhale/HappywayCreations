export const deduceSingleProdQtyFromDB = async (id, qty) => {
    try {
      const response = await fetch('https://happywaycreations.147.93.106.209.nip.io/update-single-product-quantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, qty })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log(`Product ID ${id} quantity updated successfully:`, result);
      } else {
        console.error(`Error updating product ID ${id} quantity:`, result);
      }
    } catch (error) {
      console.error(`Error updating product ID ${id} quantity:`, error);
    }
  };
  