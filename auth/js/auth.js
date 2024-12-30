const registrationForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const chosenCiv = localStorage.getItem('selectedCivilization') || null;

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generatePlayerTag() {
    const characters = 'aAáÁbBcCdDeEéÉfFgGhHiIíÍjJkKlLmMnNoOóÓöÖőŐpPqQrRsStTuUúÚüÜűŰvVwWxXyYzZ0123456789';
    let playerTag = '#';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        playerTag += characters[randomIndex];
    }

    return playerTag;
}


function register() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const confirmEmail = document.getElementById('confirmEmail').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const age = parseInt(document.getElementById('age').value, 10);

    if (!username || !email || !confirmEmail || !password || !confirmPassword || !age) {
        alert('All fields are required to fill!');
        return;
    }

    if (!isEmailValid(email)) {
        alert('Invalid email format!');
        return;
    }

    if (email !== confirmEmail) {
        alert('Emails do not match!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.username === username || user.email === email);

    if (userExists) {
        alert('A user with this username already exists.');
        return;
    }

    const newUser = {
        username,
        email,
        password,
        age,
        playerTag: generatePlayerTag()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Redirecting to login page...');
    window.location.href = 'DaveSummer36.github.io/civilwars-test/auth/login.html';
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find((u) => u.username === username && u.password === password);

        if (!user) {
            alert('Invalid username or password!');
            return;
        }

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Login successful! Redirecting to CivilWars!');
        if(chosenCiv === null || !chosenCiv) window.location.href = './civilization_chooser.html';
        else window.location.href = '../index.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    if(isMobile) window.location.href = './mobile.html';
});
