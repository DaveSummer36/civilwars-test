document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('loggedInUser');

    if(!isLoggedIn) window.location.href = 'DaveSummer36.github.io/civilwars-test/auth/login.html';
});
