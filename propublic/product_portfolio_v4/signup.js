document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('#signupform');
    const authButton = document.querySelector('button .auth');

    // Helper function to update button to logout
    const updateButtonToLogout = () => {
        authButton.classList.add('logout');
        authButton.classList.remove('auth');
        authButton.href = '#';
        authButton.textContent = 'LOG OUT';

        authButton.addEventListener('click', handleLogout);
    };

    // Helper function to handle logout
    const handleLogout = async (event) => {
        event.preventDefault();

        // Perform any necessary logout logic here, like clearing session or localStorage
        await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent
        });

        alert('Logged out successfully');

        // Update button to login state
        authButton.classList.add('auth');
        authButton.classList.remove('logout');
        authButton.href = 'login.html';
        authButton.textContent = 'LOG IN';
    };

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const firstName = document.getElementById('FirstName').value;
        const lastName = document.getElementById('LastName').value;
        const phoneNo = document.getElementById('Phone_no').value;

        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, firstName, lastName, phoneNo })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Sign up successful');
            // Redirect to the desired page after successful sign up
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            window.location.href = '/';
            updateButtonToLogout();
        } else {
            alert(result.error || 'Sign up failed');
        }
    });
});
