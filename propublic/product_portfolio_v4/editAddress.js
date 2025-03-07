import { isLoggedIn } from "./loginStatus";

document.addEventListener("DOMContentLoaded", async () => {
    if(isLoggedIn())
        {
            const addAddressForm = document.getElementById("addAddressForm");

            // Helper function to get the query parameter by name
            function getQueryParameter(name) {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(name);
            }
        
            const aid = getQueryParameter("aid");
        
            if (!aid) {
                alert("Address ID (aid) not found in the URL.");
                return;
            }
        
            try {
                const response = await fetch(`http://localhost:3000/fetch-address?aid=${aid}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch address information.");
                }
        
                const addressData = await response.json();
        
               console.log();
                // Populate form fields with the fetched address data
                addAddressForm.querySelector("#username").value = addressData.name;
                addAddressForm.querySelector("#phone_no").value = addressData.phone_no;
                addAddressForm.querySelector("#pincode").value = addressData.pincode;
                addAddressForm.querySelector("#houseNo").value = addressData.house_apartment;
                addAddressForm.querySelector("#area").value = addressData.area;
                addAddressForm.querySelector("#landmark").value = addressData.landmark;
                addAddressForm.querySelector("#townCity").value = addressData.town_city;
                addAddressForm.querySelector("#state").value = addressData.state;
        
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while fetching the address information. Please try again.");
            }
        
            addAddressForm.addEventListener("submit", async (event) => {
                event.preventDefault(); 
                
              
                // Collect the form data
                const formData = new FormData(addAddressForm);
                const addressData = {
                    aid: aid, // Include the address ID for updating the address
                    

                    pincode: formData.get("pincode"),
                    houseNo: formData.get("houseNo"),
                    area: formData.get("area"),
                    landmark: formData.get("landmark"),
                    townCity: formData.get("townCity"),
                    state: formData.get("state"),
                    name:formData.get("username"),
                    phone_no:formData.get("phone_no")
                   // Replace with the actual user email
                };
        
                console.log('addressData:', addressData);
        
                try {
                    const response = await fetch(`http://localhost:3000/update-address`, {
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
                        alert("Address updated successfully!");
                        addAddressForm.reset(); // Reset the form
                        window.location.href = "address.html"; // Navigate to address.html
                    } else {
                        // Handle errors
                        console.error("Error:", result.error);
                        alert("Failed to update address. Please try again.");
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
