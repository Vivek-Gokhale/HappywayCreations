// Function to fetch user details
export async function getUserDetails(userEmail) {
    try {
        const response = await fetch('http://localhost:3000/getUserDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        
        // Display user details if we're on the profile page
        if (window.location.pathname.includes('profile.html')) {
            displayUserProfile(data);
        }
        
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function to display user profile
function displayUserProfile(userData) {
    if (userData && userData.user) {
        const user = userData.user;
        document.getElementById('userName').textContent = user.name || 'Not provided';
        document.getElementById('userEmail').textContent = user.email || 'Not provided';
        document.getElementById('userPhone').textContent = user.phone || 'Not provided';
    }
}

// Initialize profile if we're on the profile page
if (window.location.pathname.includes('profile.html')) {
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        getUserDetails(userEmail);
    }
}
  
  