const buildingLogic = new BuildingLogic();

let gameTime = parseInt(localStorage.getItem('gameTime')) || 0;
let resources = {
    level: 1,
    population: 10,
    food: 20,
    gold: 50,
    buildings: {
        farms: { count: 2, farm1Level: 1, farm2Level: 1 },
        mines: { count: 2, mine1Level: 1, mine2Level: 1 },
        houses: { count: 2, house1Level: 1, house2Level: 1 },
        maxCount: 5
    }
};

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');

    if(timerElement) {
        timerElement.textContent = formatTime(gameTime);
    } else {
        console.error('Timer element not found!');
    }
}

function gameTick() {
    gameTime += 1;
    updateTimerDisplay();
    if(gameTime % 3600 === 0) {
        increaseResources();
    }
}

const timerInterval = setInterval(gameTick, 1000);
window.addEventListener('beforeunload', () => { localStorage.setItem('gameTime', gameTime); });

function logAction(message) {
    const logEntries = document.getElementById('logEntries');

    if(!logEntries) {
        console.error('Log entries container not found!');
        return;
    }

    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logEntries.prepend(logEntry);
}

function getUpgradeRequirements(level) {
    const requirements = buildingLogic.getUpgradeCosts(level);
    if(!requirements) return 'No further upgrades available.';

    let requirementText = 'Requires: ';
    if(requirements.food) requirementText += `Food: ${requirements.food} `;
    if(requirements.gold) requirementText += `Gold: ${requirements.gold} `;
    if(requirements.population) requirementText += `population: ${requirements.population}`;

    return requirementText.trim();
}

function calculateProduction(buildingType) {
    let totalProduction = 0;

    if(!resources.buildings[buildingType]) {
        console.error(`Building type ${buildingType} not found in resources!`);
        return totalProduction;
    }

    for(let i = 1; i <= resources.buildings[buildingType].count; i++) {
        const level = resources.buildings[buildingType][`${buildingType}${i}Level`];

        if(!level) {
            console.warn(`Level for ${buildingType} ${i} is not defined.`);
            continue;
        }

        const baseProduction = buildingLogic.getProduction(buildingType, level);
        totalProduction += baseProduction;
    }

    console.log(`Total production for ${buildingType}: ${totalProduction}`);
    return totalProduction;
}

function increaseResources() {
    try {
        const farmProduction = calculateProduction('farms');
        const mineProduction = calculateProduction('mines');

        resources.food += farmProduction;
        resources.gold += mineProduction;

        logAction(`Resources increased: Food: +${farmProduction}, Gold: +${mineProduction}`);
        updateResources();
    } catch(error) {
        console.error('Error in increaseResources: ', error.message);
    }
}

function updateResources() {
    try {
        document.getElementById('population').textContent = resources.population;
        document.getElementById('food').textContent = resources.food;
        document.getElementById('gold').textContent = resources.gold;
        document.getElementById('farms').textContent = resources.buildings.farms.count;
        document.getElementById('mines').textContent = resources.buildings.mines.count;
        document.getElementById('houses').textContent = resources.buildings.houses.count;
    } catch(err) {
        console.error('Error in updateResources: ', err.message);
    }
}

function buildFarm() {
    const farmNumber = resources.buildings.farms.count + 1;
    resources.buildings.farms[`farm${farmNumber}Level`] = 1;
    resources.buildings.farms.count += 1;

    if(resources.buildings.farms.count === resources.buildings.maxCount) {
        return alert('You reached the max number of this building!');
    }

    logAction(`New Farm ${farmNumber} built at Level 1.`);
    renderBuildingButtons();
    updateResources();
}

function buildMine() {
    const mineNumber = resources.buildings.mines.count + 1;
    resources.buildings.mines[`mine${mineNumber}Level`] = 1;
    resources.buildings.mines.count += 1;

    if(resources.buildings.mines.count === resources.buildings.maxCount) {
        return alert('You reached the max number of this building!');
    }

    logAction(`New Mine ${mineNumber} built at Level 1.`);
    renderBuildingButtons();
    updateResources();
}

function buildHouse() {
    const houseNumber = resources.buildings.houses.count + 1;
    resources.buildings.houses[`house${houseNumber}Level`] = 1;
    resources.buildings.houses.count += 1;

    if(resources.buildings.houses.count === resources.buildings.maxCount) {
        return alert('You reached the max number of this building!');
    }

    logAction(`New House ${houseNumber} built at Level 1.`);
    renderBuildingButtons();
    updateResources();
}

function upgradeFarm(farmNumber) {
    const farmKey = `farm${farmNumber}Level`;
    const nextLevel = resources.buildings.farms[farmKey] + 1;
    const requirements = buildingLogic.getUpgradeCosts(nextLevel);

    if(
        resources.food >= requirements.food &&
        resources.gold >= requirements.gold &&
        (!requirements.population || resources.population >= requirements.population)
    ) {
        resources.food -= requirements.food;
        resources.gold -= requirements.gold;
        if(requirements.population) {
            resources.population -= requirements.population;
        }

        resources.buildings.farms[farmKey] += 1;
        logAction(`Farm ${farmNumber} upgraded to Level ${nextLevel}`);
        renderBuildingButtons();
        updateResources();
    } else {
        alert('Not enough resources to upgrade!');
    }
}

function upgradeMine(mineNumber) {
    const mineKey = `mine${mineNumber}Level`;
    const nextLevel = resources.buildings.mines[mineKey] + 1;
    const requirements = buildingLogic.getUpgradeCosts(nextLevel);

    if(
        resources.food >= requirements.food &&
        resources.gold >= requirements.gold &&
        (!requirements.population || resources.population >= requirements.population)
    ) {
        resources.food -= requirements.food;
        resources.gold -= requirements.gold;
        if(requirements.population) {
            resources.population -= requirements.population;
        }

        resources.buildings.mines[mineKey] += 1;
        logAction(`Mine ${mineNumber} upgraded to Level ${nextLevel}`);
        renderBuildingButtons();
        updateResources();
    } else {
        alert('Not enough resources to upgrade!');
    }
}

function upgradeHouse(houseNumber) {
    const houseKey = `house${houseNumber}Level`;
    const nextLevel = resources.buildings.houses[houseKey] + 1;
    const requirements = buildingLogic.getUpgradeCosts(nextLevel);

    if(
        resources.food >= requirements.food &&
        resources.gold >= requirements.gold &&
        (!requirements.population || resources.population >= requirements.population)
    ) {
        resources.food -= requirements.food;
        resources.gold -= requirements.gold;
        if(requirements.population) {
            resources.population -= requirements.population;
        }

        resources.buildings.houses[houseKey] += 1;
        logAction(`House ${houseNumber} upgraded to Level ${nextLevel}`);
        renderBuildingButtons();
        updateResources();
    } else {
        alert('Not enough resources to upgrade!');
    }
}

function renderBuildingButtons() {
    const buildingActions = document.getElementById('buildingActions');
    buildingActions.innerHTML = '';


    for(let i = 1; i <= resources.buildings.farms.count; i++) {
        const currentLevel = resources.buildings.farms[`farm${i}Level`];
        const nextLevel = currentLevel + 1;
        const upgradeFarmButton = document.createElement('button');
        upgradeFarmButton.className = 'tooltip';
        upgradeFarmButton.textContent = `Upgrade Farm ${i} to Level ${nextLevel}`;
        upgradeFarmButton.onclick = () => upgradeFarm(i);

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = getUpgradeRequirements(nextLevel);
        upgradeFarmButton.appendChild(tooltip);

        buildingActions.appendChild(upgradeFarmButton);
    }

    for(let i = 1; i <= resources.buildings.mines.count; i++) {
        const currentLevel = resources.buildings.mines[`mine${i}Level`];
        const nextLevel = currentLevel + 1;
        const upgradeMineButton = document.createElement('button');
        upgradeMineButton.className = 'tooltip';
        upgradeMineButton.textContent = `Upgrade Mine ${i} to Level ${nextLevel}`;
        upgradeMineButton.onclick = () => upgradeMine(i);

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = getUpgradeRequirements(nextLevel);
        upgradeMineButton.appendChild(tooltip);

        buildingActions.appendChild(upgradeMineButton);
    }

    for(let i = 1; i <= resources.buildings.houses.count; i++) {
        const currentLevel = resources.buildings.houses[`house${i}Level`];
        const nextLevel = currentLevel + 1;
        const upgradeHouseButton = document.createElement('button');
        upgradeHouseButton.className = 'tooltip';
        upgradeHouseButton.textContent = `Upgrade House ${i} to Level ${nextLevel}`;
        upgradeHouseButton.onclick = () => upgradeHouse(i);

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = getUpgradeRequirements(nextLevel);
        upgradeHouseButton.appendChild(tooltip);

        buildingActions.appendChild(upgradeHouseButton);
    }

    const buildFarmButton = document.createElement('button');
    buildFarmButton.className = 'tooltip';
    buildFarmButton.textContent = 'Build New Farm';
    buildFarmButton.onclick = buildFarm;

    const buildFarmTooltip = document.createElement('span');
    buildFarmTooltip.className = 'tooltiptext';
    buildFarmTooltip.textContent = getUpgradeRequirements(1);
    buildFarmButton.appendChild(buildFarmTooltip);

    buildingActions.appendChild(buildFarmButton);


    const buildMineButton = document.createElement('button');
    buildMineButton.className = 'tooltip';
    buildMineButton.textContent = 'Build New Farm';
    buildMineButton.onclick = buildMine;

    const buildMineTooltip = document.createElement('span');
    buildMineTooltip.className = 'tooltiptext';
    buildMineTooltip.textContent = getUpgradeRequirements(1);
    buildMineButton.appendChild(buildMineTooltip);

    buildingActions.appendChild(buildMineButton);


    const buildHouseButton = document.createElement('button');
    buildHouseButton.className = 'tooltip';
    buildHouseButton.textContent = 'Build New Farm';
    buildHouseButton.onclick = buildHouse;

    const buildHouseTooltip = document.createElement('span');
    buildHouseTooltip.className = 'tooltiptext';
    buildHouseTooltip.textContent = getUpgradeRequirements(1);
    buildHouseButton.appendChild(buildHouseTooltip);

    buildingActions.appendChild(buildHouseButton);
}

renderBuildingButtons();
updateResources();
updateTimerDisplay();
