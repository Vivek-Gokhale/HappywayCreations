document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.login');

    if (loginButton) {
        loginButton.addEventListener('click', (event) => {

            event.preventDefault();
            const currentUrl = window.location.href;
            sessionStorage.setItem('redirectAfterLogin', currentUrl);
            window.location.href = 'login.html';
        });
    }
});
