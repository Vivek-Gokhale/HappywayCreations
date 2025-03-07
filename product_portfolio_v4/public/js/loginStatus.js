export const isLoggedIn = () => {
    // You can change this logic based on your authentication mechanism
    return sessionStorage.getItem('isLoggedIn') === 'true';
};

export const setLoggedIn = (value) => {
    sessionStorage.setItem('isLoggedIn', value);
};

export const logout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    window.location.href = 'login.html';
};