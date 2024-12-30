document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('loggedInUser');

    if(!isLoggedIn) window.location.href = './auth/login';
});
