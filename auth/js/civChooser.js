document.addEventListener('DOMContentLoaded', () => {
    const civSelect = document.getElementById('civilizationSelect');
    const civDetails = document.getElementById('civilizationDetails');
    const alertMessage = document.getElementById('alertMessage');

    alertMessage.textContent = 'ATTENTION: You won\'t be able to change your civilization later!';

    fetch('../utils/civilizations.json')
        .then(response => {
            if(!response.ok) throw new Error(`Error fetching civilizations: ${response.statusText}`);

            return response.json();
        })
        .then(data => {
            const civilizations = data.civilizations;

            civilizations.forEach(civ => {
                const option = document.createElement('option');
                option.value = civ.name;
                option.textContent = civ.name;
                civSelect.appendChild(option);
            });

            civSelect.addEventListener('change', (event) => {
                const selectedName = event.target.value;
                const selectedCiv = civilizations.find(civ => civ.name === selectedName);

                if(selectedCiv) {
                    civDetails.innerHTML = `
                        <strong>Selected Civilization: ${selectedCiv.name}</strong><br />
                        <em>Region: ${selectedCiv.region}</em><br />
                        <strong>Buffs: </strong> ${selectedCiv.buffs.join(', ')}<br />
                        <strong>Nerfs: </strong> ${selectedCiv.nerfs.join(', ')}
                    `;
                } else {
                    civDetails.textContent = 'Select a civilization to see details here.';
                }
            });
        })
        .catch(error => {
            console.error('Error loading civilizations: ', error);
            civDetails.textContent = 'Error loading civilizations';
        });

    document.getElementById('civilizationForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedCivilization = civSelect.value;
        if(!selectedCivilization) {
            alert('Please select a civilization!');
            return;
        }

        localStorage.setItem('selectedCivilization', selectedCivilization);
        window.location.href = '../index.html';
    });
});
