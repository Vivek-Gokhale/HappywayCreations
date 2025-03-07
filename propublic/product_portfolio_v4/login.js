document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginform');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login successful');
            // Redirect to the desired page after login
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') || result.redirectTo || '/';
            window.location.href = redirectTo;

        } else {
            alert(result.error || 'Login failed');
        }
    });
});
