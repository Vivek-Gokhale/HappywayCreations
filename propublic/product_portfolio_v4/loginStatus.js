export const isLoggedIn = () => {
    // You can change this logic based on your authentication mechanism
    return sessionStorage.getItem('isLoggedIn') === 'true';
};