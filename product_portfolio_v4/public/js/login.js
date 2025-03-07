document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginform');
    const modalMessage = document.getElementById('modalMessage');
    const modal = document.getElementById('messageModal');
    const closeModal = document.querySelector('.close');

    // Rate limiting variables
    const MAX_ATTEMPTS = 5; // Maximum login attempts
    const BLOCK_TIME = 1 * 60 * 1000; // Block time in milliseconds (1 minute)

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        // Validate input fields
        if (!email || !password) {
            showModal('Email and password cannot be empty');
            return;
        }

        // Rate limiting logic
        const loginAttempts = JSON.parse(sessionStorage.getItem('loginAttempts')) || { count: 0, blockUntil: null };
        const now = new Date().getTime();

        if (loginAttempts.blockUntil && now < loginAttempts.blockUntil) {
            const remainingTime = Math.ceil((loginAttempts.blockUntil - now) / 1000);
            showModal(`Too many failed attempts. Please try again after ${remainingTime} seconds.`);
            return;
        }

        try {
            const response = await fetch('https://happywaycreations.147.93.106.209.nip.io/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Reset login attempts on successful login
                sessionStorage.removeItem('loginAttempts');
                showModal('Login successful');
                
                // Store login state and user info
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);
                
                // Redirect to the desired page after login
                const redirectTo = sessionStorage.getItem('redirectAfterLogin') || result.redirectTo || '/';
                window.location.href = redirectTo;
            } else {
                handleFailedAttempt();
            }
        } catch (error) {
            console.error('Error during login:', error);
            handleFailedAttempt();
        }
    });

    function handleFailedAttempt() {
        showModal('Username or password is incorrect');

        // Update login attempts
        const loginAttempts = JSON.parse(sessionStorage.getItem('loginAttempts')) || { count: 0, blockUntil: null };
        const now = new Date().getTime();

        if (loginAttempts.blockUntil && now > loginAttempts.blockUntil) {
            // Reset attempts if block period has passed
            loginAttempts.count = 0;
            loginAttempts.blockUntil = null;
        }

        loginAttempts.count += 1;

        if (loginAttempts.count >= MAX_ATTEMPTS) {
            loginAttempts.blockUntil = now + BLOCK_TIME;
            showModal(`Too many failed attempts. You are blocked for ${BLOCK_TIME / (60 * 1000)} minutes.`);
        }

        sessionStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
    }

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    // Close the modal when the "X" is clicked
    closeModal.onclick = () => {
        modal.style.display = 'none';
    }

    // Close the modal if the user clicks outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});
