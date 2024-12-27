let levelUpgradeCosts = {
    1: { food: 25, gold: 50 },
    2: { food: 50, gold: 100 },
    3: { food: 75, gold: 150 },
    4: { food: 125, gold: 200 },
    5: { food: 200, gold: 300 }

    // New levels to be added...
};

let productionLevels = {
    farms: {
        1: 15,
        2: 25,
        3: 40,
        4: 55,
        5: 75

        // New levels to be added...
    },
    mines: {
        1: 20,
        2: 35,
        3: 60,
        4: 80,
        5: 100

        // New levels to be added...
    },
    houses: {
        1: 5,
        2: 10,
        3: 15,
        4: 20,
        5: 25

        // New levels to be added...
    }
};

let resources = {
    level: 1,
    population: 10,
    food: 25,
    gold: 50,
    buildings: {
        farms: { count: 2, farms1Level: 1, farms2Level: 1, maxCount: 5 },
        mines: { count: 2, mines1Level: 1, mines2Level: 1, maxCount: 5 },
        houses: { count: 2, houses1Level: 1, houses2Level: 1, maxCount: 5 }
    }
};

const targetDate = new Date('December 30, 2024 10:00:00').getTime();

const getProduction = (buildingType, level) => {
    return productionLevels[buildingType]?.[level] || 0;
};

const getUpgradeCosts = (level) => {
    return levelUpgradeCosts[level] || null;
};

let gameTime = parseInt(localStorage.getItem('gameTime')) || 0;

function logAction(message) {
    const logEntries = document.getElementById('logEntries');

    if(!logEntries) {
        console.error('Log entries not found!');
        return;
    }

    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logEntries.prepend(logEntry);
}

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

function updateCountDown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60* 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownText = distance > 0
        ? `is coming in ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds!`
        : `is to be implemented!`;

    document.getElementById('countdown-text').textContent = countdownText;

    if(distance >= 0) clearInterval(timer);
}

const timer = setInterval(updateCountDown, 1000);

function gameTick() {
    gameTime += 1;
    updateTimerDisplay();
    if(gameTime % 60 === 0) {
        increaseResources();
    }
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
            console.warn(`Level for ${buildingType}${i} is not defined`);
            continue;
        }

        const baseProduction = getProduction(buildingType, level);
        totalProduction += baseProduction;
    }

    return totalProduction;
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

function increaseResources() {
    try {
        const farmProduction = calculateProduction('farms');
        const mineProduction = calculateProduction('mines');

        resources.food += farmProduction;
        resources.gold += mineProduction;

        logAction(`Resources increased: Food: ${farmProduction}, Gold: ${mineProduction}`);
        updateResources();
    } catch(err) {
        console.error('Error in increaseResources: ', err.message);
    }
}

const timerInterval = setInterval(gameTick, 1000);
window.addEventListener('beforeunload', () => { localStorage.setItem('gameTime', gameTime); });

function getUpgradeRequirements(level) {
    const requirements = getUpgradeCosts(level);
    if(!requirements) return 'No further upgrades available!';

    let requirementText = 'Requires: ';
    if(requirements.food) requirementText += `Food: ${requirements.food} `;
    if(requirements.gold) requirementText += `Gold: ${requirements.gold} `;
    if(requirements.population) requirementText += `Population: ${requirements.population}`;

    return requirementText.trim();
}

function buildFarm() {
    const farmNumber = resources.buildings.farms.count + 1;
    resources.buildings.farms[`farms${farmNumber}Level`] = 1;
    resources.buildings.farms.count += 1;
    logAction(`New Farm ${farmNumber} built at Level 1.`);
    renderBuildingButtons();
    updateResources();
}

function buildMine() {
    const mineNumber = resources.buildings.mines.count + 1;
    resources.buildings.mines[`mines${mineNumber}Level`] = 1;
    resources.buildings.mines.count += 1;
    logAction(`New Mine ${mineNumber} built at Level 1.`);
    renderBuildingButtons();
    updateResources();
}

function buildHouse() {
    const houseNumber = resources.buildings.houses.count + 1;
    resources.buildings.houses[`houses${houseNumber}Level`] = 1;
    resources.buildings.houses.count += 1;
    logAction(`New House ${houseNumber} built at Level 1.`);
    renderBuildingButtons();
    updateResources();
}

function upgradeFarm(farmNumber) {
    const farmKey = `farms${farmNumber}Level`;
    const nextLevel = resources.buildings.farms[farmKey] + 1;
    const requirements = getUpgradeCosts(nextLevel);

    if(resources.food >= requirements.food && resources.gold >= requirements.gold && (!requirements.population || resources.population >= requirements.population)) {
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
    const mineKey = `mines${mineNumber}Level`;
    const nextLevel = resources.buildings.mines[mineKey] + 1;
    const requirements = getUpgradeCosts(nextLevel);

    if(resources.food >= requirements.food && resources.gold >= requirements.gold && (!requirements.population || resources.population >= requirements.population)) {
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
    const houseKey = `houses${houseNumber}Level`;
    const nextLevel = resources.buildings.houses[houseKey] + 1;
    const requirements = getUpgradeCosts(nextLevel);

    if(resources.food >= requirements.food && resources.gold >= requirements.gold && (!requirements.population || resources.population >= requirements.population)) {
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
        const currentLevel = resources.buildings.farms[`farms${i}Level`];
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
        const currentLevel = resources.buildings.mines[`mines${i}Level`];
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
        const currentLevel = resources.buildings.houses[`houses${i}Level`];
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

    if(resources.buildings.farms.count == resources.buildings.farms.maxCount) {
        buildFarmButton.disabled = true;
    }


    const buildMineButton = document.createElement('button');
    buildMineButton.className = 'tooltip';
    buildMineButton.textContent = 'Build New Mine';
    buildMineButton.onclick = buildMine;

    const buildMineTooltip = document.createElement('span');
    buildMineTooltip.className = 'tooltiptext';
    buildMineTooltip.textContent = getUpgradeRequirements(1);
    buildMineButton.appendChild(buildMineTooltip);

    buildingActions.appendChild(buildMineButton);

    if(resources.buildings.mines.count == resources.buildings.mines.maxCount) {
        buildMineButton.disabled = true;
    }


    const buildHouseButton = document.createElement('button');
    buildHouseButton.className = 'tooltip';
    buildHouseButton.textContent = 'Build New House';
    buildHouseButton.onclick = buildHouse;

    const buildHouseTooltip = document.createElement('span');
    buildHouseTooltip.className = 'tooltiptext';
    buildHouseTooltip.textContent = getUpgradeRequirements(1);
    buildHouseButton.appendChild(buildHouseTooltip);

    buildingActions.appendChild(buildHouseButton);

    if(resources.buildings.houses.count == resources.buildings.houses.maxCount) {
        buildHouseButton.disabled = true;
    }
}

renderBuildingButtons();
updateTimerDisplay();
updateResources();
updateCountDown();
