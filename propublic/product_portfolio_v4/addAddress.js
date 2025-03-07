import { isLoggedIn } from "./loginStatus";

document.addEventListener("DOMContentLoaded", () => {
    if(isLoggedIn()){
        const addAddressForm = document.getElementById("addAddressForm");

        addAddressForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent the form from submitting the traditional way
            
            let userEmail = sessionStorage.getItem('userEmail');
            console.log('userEmail from sessionStorage:', userEmail);
    
            if (!userEmail) {
                alert("User email is not available in session storage.");
                return;
            }
    
            // Collect the form data
            const formData = new FormData(addAddressForm);
            const addressData = {
                pincode: formData.get("pincode"),
                houseNo: formData.get("houseNo"),
                area: formData.get("area"),
                landmark: formData.get("landmark"),
                townCity: formData.get("townCity"),
                state: formData.get("state"),
                name:formData.get("username"),
                phone_no:formData.get("phone_no"),
                userEmail: userEmail, // Replace with the actual user email
            };
    
          
    
            try {
                const response = await fetch("http://localhost:3000/add-address", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(addressData)
                });
    
                const result = await response.json();
                console.log('Server response:', result);
    
                if (response.ok) {
                    // Handle successful response
                    alert("Address added successfully!");
                    addAddressForm.reset(); // Reset the form
                    window.location.href = "address.html"
                    
                } else {
                    // Handle errors
                    console.error("Error:", result.error);
                    alert("Failed to add address. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            }
        });
    }
    else
    {
        window.location.href = "index.html";
    }
        
   
});
