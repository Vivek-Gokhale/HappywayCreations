const userEmail = sessionStorage.getItem('userEmail');
    loadProfile(userEmail);

    async function loadProfile(email) {
        try {
            const response = await fetch(`http://localhost:3000/user-details?email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const userDetails = await response.json();

            // Fill the form with the fetched data
            document.getElementById('useremail').value = userDetails.user_email;
            document.getElementById('firstname').value = userDetails.first_name;
            document.getElementById('lastname').value = userDetails.last_name;
            document.getElementById('phone').value = userDetails.user_phone_no;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }


    document.getElementById('editButton').addEventListener('click', async (evt) => {
        evt.preventDefault();
        const email = document.getElementById('useremail').value;
        const firstName = document.getElementById('firstname').value;
        const lastName = document.getElementById('lastname').value;
        const phone = document.getElementById('phone').value;

        const userData = {
            user_email: email,
            first_name: firstName,
            last_name: lastName,
            user_phone_no: phone
        };

        try {
            const response = await fetch('http://localhost:3000/update-user-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    });

