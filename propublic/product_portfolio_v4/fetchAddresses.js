import { isLoggedIn } from "./loginStatus";
import { removeAddress } from "./removeAddress";

async function fetchAddresses(userEmail) {
    try {
        const response = await fetch('http://localhost:3000/get-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail: userEmail }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function populateAddressTemplate(address) {
    const addressTemplate = document.querySelector('#addressTemplate');
    const addressContainer = document.querySelector('.addressContainer');

    const clone = document.importNode(addressTemplate.content, true);
    // console.log(address.isDefault + "is this");
    if(address.is_default === 1)
        {
            clone.querySelector('.isDefault').innerHTML = "<b style='color : grey'>Default</b>";   
        }
    if(address.is_default === 0)
        {
            clone.querySelector(".set-default").innerHTML = "<a href='#' class='card-link'>Set as Default</a>";
            clone.querySelector(".set-default").addEventListener('click', (event) => {
                // event.preventDefault();
                const addressId = address.aid;
                const userEmail = sessionStorage.getItem('userEmail');
        
                fetch('http://localhost:3000/set-default-address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userEmail, addressId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Default address set successfully');
                        window.location.reload();
                        // Optionally, refresh the address list or update the UI
                    } else {
                        alert('Error setting default address');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });

                 
        }
    clone.querySelector('.card-title').innerHTML = `<b>${address.name}</b>`;
    clone.querySelector('.addressRow1').textContent = `${address.house_apartment}, ${address.area}`;
    
    clone.querySelector('.city').textContent = address.town_city;
    clone.querySelector('.state').textContent = `${address.state},`;
    clone.querySelector('.pincode').textContent = address.pincode;
    clone.querySelector('.phone').textContent = address.phone_no;
    const card = clone.querySelector(".card");
    if (!card) return;

    card.setAttribute("id", `card${address.aid}`);
    clone.querySelector(".edit-address").href = `editAddress.html?aid=${address.aid}`;
    clone.querySelector(".remove-address").addEventListener('click', ()=>{
        if(address.is_default === 1)
            {
                alert("You need to set Default address before removing this");
            }
        else
            {
                if(removeAddress(address.aid))
                    {
                            card.remove();
                    }
            }
       
    });
    addressContainer.appendChild(clone);
}

async function displayAddresses(userEmail) {
    const responseData = await fetchAddresses(userEmail);
    console.log(responseData);

    if (responseData && responseData.user && responseData.addresses && responseData.addresses.length > 0) {
        responseData.addresses.forEach(address => {
            const combinedAddress = {
                ...address,
                ...responseData.user
            };
            populateAddressTemplate(combinedAddress);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userEmail = sessionStorage.getItem('userEmail');  // Replace with actual user email
    if(isLoggedIn())
        {
            displayAddresses(userEmail);
        }
    else
    {
        window.location.href = "index.html";
    }
   
});
