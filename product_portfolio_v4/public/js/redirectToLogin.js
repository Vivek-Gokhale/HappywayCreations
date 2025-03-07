export const redirectToLogin = (event) => {
    event.preventDefault();
    const currentUrl = window.location.href;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    window.location.href = 'login.html';
};
