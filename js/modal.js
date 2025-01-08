const releaseModal = document.getElementById('releaseModal');
const closeRMButton = document.getElementById('closeRM-button');

document.getElementById('releaseModalP').addEventListener('click', () => {
    releaseModal.style.display = 'block';
});

closeRMButton.addEventListener('click', () => {
    releaseModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if(event.target === releaseModal) {
        releaseModal.style.display === 'none';
    }
});