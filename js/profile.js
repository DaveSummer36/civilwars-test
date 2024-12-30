const profileModal = document.getElementById('profileModal');
const closeButton = document.getElementById('close-button');
const logoutButton = document.getElementById('logoutButton');

const randomGuestId = Math.floor(Math.random() * 100000000);
const user = JSON.parse(localStorage.getItem('loggedInUser'));
const chosenCiv = localStorage.getItem('selectedCivilization');

const username = user.username;
const email = user.email;
const civilization = chosenCiv;
const level = 1;
const xp = 0;
const playerTag = user.playerTag || randomGuestId;

document.getElementById('profileUsername').textContent = username || `Guest ${playerTag}`;
document.getElementById('profileEmail').textContent = email;
document.getElementById('profileCiv').textContent = civilization;
document.getElementById('profileLevel').textContent = level;
document.getElementById('profileXP').textContent = `${xp} / 50`;
document.getElementById('playerTag').textContent = playerTag;

document.getElementById('profileButton').addEventListener('click', () => {
    profileModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
        profileModal.style.display === 'none';
    }
});

logoutButton.onclick = () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '../auth/login.html';
};