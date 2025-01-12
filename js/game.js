// Alpha v1.1.0

// Initial variables/arrays
let upgradeCosts = {
    1: { food: 25, gold: 50 },
    2: { food: 50, gold: 100 },
    3: { food: 75, gold: 150 },
    4: { food: 125, gold: 225 }, // Gold cost raised by 25
    5: { food: 200, gold: 300 },
    // New levels from Alpha v1.1.0
    6: { food: 300, gold: 450 },
    7: { food: 500, gold: 750 }

    // New levels are coming soon...
};

let productionLevels = {
    // Production quantities reduction in Alpha v1.1.0 (population didn't change)

    farms: {
        1: 10,
        2: 20,
        3: 35,
        4: 50,
        5: 70,
        // New levels from Alpha v1.1.0
        6: 95,
        7: 120

        // New levels are coming soon...
    },
    mines: {
        1: 15,
        2: 30,
        3: 50,
        4: 75,
        5: 100,
        // New levels from Alpha v1.1.0
        6: 125,
        7: 150

        // New levels are coming soon..
    },
    houses: {
        1: 5,
        2: 10,
        3: 15,
        4: 20,
        5: 25,
        // New levels from Alpha v1.1.0
        6: 30,
        7: 35

        // New levels are coming soon...
    }
};

// Changes in structure for more seamless development + new functions added
let buildings = {
    farms: JSON.parse(localStorage.getItem('farms')) || { count: 2, farms1Level: 1, farms2Level: 1, maxCount: 5 },
    mines: JSON.parse(localStorage.getItem('mines')) || { count: 2, mines1Level: 1, mines2Level: 1, maxCount: 5 },
    houses: JSON.parse(localStorage.getItem('houses')) || { count: 2, houses1Level: 1, houses2Level: 1, maxCount: 5 }
};

let gameTime = parseInt(localStorage.getItem('gameTime')) || 0;

// Renamed 'resources' to 'playerData' due to not accurate naming
let playerData = {
    level: parseInt(localStorage.getItem('playerLevel')) || 1,   // Level system to be developed later
    population: parseInt(localStorage.getItem('playerPopulation')) || 10,
    food: parseInt(localStorage.getItem('playerFood')) || 25,
    gold: parseInt(localStorage.getItem('playerGold')) || 50
};

const timerElement = document.getElementById('timer');
const playerLevelIndicator = document.getElementById('player-level');
const populationIndicator = document.getElementById('population');
const foodIndicator = document.getElementById('food');
const goldIndicator = document.getElementById('gold');
const houseCountIndicator = document.getElementById('houses');
const farmCountIndicator = document.getElementById('farms');
const mineCountIndicator = document.getElementById('mines');
const buildingActions = document.getElementById('buildingActions');

const getProduction = (buildingType, level) => {
    return productionLevels[buildingType]?.[level] || 0;
};

const getUpgradeCosts = (level) => {
    return upgradeCosts[level] || null;
};

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    if(timerElement) {
        timerElement.textContent = formatTime(gameTime);
    } else {
        console.error('Timer element not found!');
        return;
    }
}

function gameTick() {
    gameTime += 1;
    updateTimerDisplay();
    if(gameTime % 5 === 0) increaseResources();
}

function calculateProduction(buildingType) {
    let totalProduction = 0;

    if(!buildings[buildingType]) {
        console.error(`Building type ${buildingType} not found in buildings.`);
        return totalProduction;
    }

    for(let i = 1; i <= buildings[buildingType].count; i++) {
        const levelKey = `${buildingType}${i}Level`;
        const level = buildings[buildingType][levelKey];

        if(!level) {
            console.warn(`Level for ${levelKey} is not defined!`);
            continue;
        }

        const baseProduction = getProduction(buildingType, level);
        totalProduction += baseProduction;
    }

    return totalProduction;
}

function calcutatePopulation() {
    const totalHousePopulation = calculateProduction('houses');
    populationIndicator.textContent = totalHousePopulation;
}

function increaseResources() {
    try {
        const farmProduction = calculateProduction('farms');
        const mineProduction = calculateProduction('mines');

        playerData.food += farmProduction;
        playerData.gold += mineProduction;
        updateResources();
    } catch(err) {
        console.error('Error in increaseResources: ', err.message);
    }
}

const timerInterval = setInterval(gameTick, 1000);
window.addEventListener('beforeunload', () => {
    localStorage.setItem('gameTime', gameTime);
    localStorage.setItem('playerLevel', playerData.level);
    localStorage.setItem('playerPopulation', playerData.population);
    localStorage.setItem('playerFood', playerData.food);
    localStorage.setItem('playerGold', playerData.gold);

    localStorage.setItem('farms', JSON.stringify(buildings.farms));
    localStorage.setItem('mines', JSON.stringify(buildings.mines));
    localStorage.setItem('houses', JSON.stringify(buildings.houses));
});

function getUpgradeRequirements(level) {
    const requirements = getUpgradeCosts(level);
    if(!requirements || Object.keys(requirements).length === 0) {
        alert('No further upgrades available!');
        return 'No upgrades available.';
    }

    let requirementText = 'Requires: ';
    if(requirements.food) requirementText += `Food: ${requirements.food} `;
    if(requirements.gold) requirementText += `Gold: ${requirements.gold} `;
    if(requirements.population) requirementText += `Population: ${requirements.population}`;

    return requirementText.trim();
}

function updateResources() {
    try {
        populationIndicator.textContent = playerData.population;
        foodIndicator.textContent = playerData.food;
        goldIndicator.textContent = playerData.gold;
        farmCountIndicator.textContent = buildings.farms.count;
        mineCountIndicator.textContent = buildings.mines.count;
        houseCountIndicator.textContent = buildings.houses.count;
    } catch(err) {
        console.error('Error in updateResources: ', err.message);
    }
}

function buildFarm() {
    const farmNumber = buildings.farms.count + 1;
    buildings.farms[`farms${farmNumber}Level`] = 1;
    buildings.farms.count += 1;
    const requirements = getUpgradeCosts(1);

    if(requirements) {
        playerData.food -= requirements.food;
        playerData.gold -= requirements.gold;
        if(requirements.population) {
            playerData.population -= requirements.population;
        }
    }

    renderBuildingButtons();
    updateResources();
}

function buildMine() {
    const mineNumber = buildings.mines.count + 1;
    buildings.mines[`mines${mineNumber}Level`] = 1;
    buildings.mines.count += 1;
    const requirements = getUpgradeCosts(1);

    if(requirements) {
        playerData.food -= requirements.food;
        playerData.gold -= requirements.gold;
        if(requirements.population) {
            playerData.population -= requirements.population;
        }
    }
    

    renderBuildingButtons();
    updateResources();
}

function buildHouse() {
    const houseNumber = buildings.houses.count + 1;
    buildings.houses[`houses${houseNumber}Level`] = 1;
    buildings.houses.count += 1;
    const requirements = getUpgradeCosts(1);

    if(requirements) {
        playerData.food -= requirements.food;
        playerData.gold -= requirements.gold;
        if(requirements.population) {
            playerData.population -= requirements.population;
        }
    }

    renderBuildingButtons();
    calcutatePopulation();
    updateResources();
}

function upgradeFarm(farmNumber) {
    const farmKey = `farms${farmNumber}Level`;
    const nextLevel = buildings.farms[farmKey] + 1;
    const requirements = getUpgradeCosts(nextLevel);

    if(playerData.food >= requirements.food &&
        playerData.gold >= requirements.gold
        && (!requirements.population || playerData.population >= requirements.population)) {
            playerData.food -= requirements.food;
            playerData.gold -= requirements.gold;

            if(requirements.population) {
            playerData.population -= requirements.population;
        }

        buildings.farms[farmKey] += 1;
        renderBuildingButtons();
        updateResources();
    } else {
        alert('Not enough resources to upgrade!');
    }
}

function upgradeMine(mineNumber) {
    const mineKey = `mines${mineNumber}Level`;
    const nextLevel = buildings.mines[mineKey] + 1;
    const requirements = getUpgradeCosts(nextLevel);

    if(playerData.food >= requirements.food &&
        playerData.gold >= requirements.gold
        && (!requirements.population || playerData.population >= requirements.population)) {
            playerData.food -= requirements.food;
            playerData.gold -= requirements.gold;

            if(requirements.population) {
            playerData.population -= requirements.population;
        }

        buildings.mines[mineKey] += 1;
        renderBuildingButtons();
        updateResources();
    } else {
        alert('Not enough resources to upgrade!');
    }
}

function upgradeHouse(houseNumber) {
    const houseKey = `houses${houseNumber}Level`;
    const nextLevel = buildings.houses[houseKey] + 1;
    const requirements = getUpgradeCosts(nextLevel);

    if(playerData.food >= requirements.food &&
        playerData.gold >= requirements.gold
        && (!requirements.population || playerData.population >= requirements.population)) {
            playerData.food -= requirements.food;
            playerData.gold -= requirements.gold;

            if(requirements.population) {
            playerData.population -= requirements.population;
        }

        buildings.houses[houseKey] += 1;
        renderBuildingButtons();
        calcutatePopulation();
        updateResources();
    } else {
        alert('Not enough resources to upgrade!');
    }
}

function renderBuildingButtons() {
    buildingActions.innerHTML = '';

    function createButton({ text, tooltipText, onClick, isDisabled, extraStyles }) {
        const button = document.createElement('button');
        button.className = 'tooltip';
        button.textContent = text;
        button.disabled = isDisabled;

        if (onClick) {
            button.onclick = onClick;
        }

        if (extraStyles) {
            for (const [key, value] of Object.entries(extraStyles)) {
                button.style[key] = value;
            }
        }

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = tooltipText;

        button.appendChild(tooltip);
        return button;
    }

    function renderBuildingGroup(buildingType, maxCount, count, levels, upgradeFn, buildFn) {
        const groupDiv = document.createElement('div');
        groupDiv.className = `${buildingType}-section`;

        for (let i = 1; i <= count; i++) {
            const currentLevel = levels[`${buildingType}${i}Level`];
            const nextLevel = currentLevel + 1;

            const isMaxLevel = nextLevel > Object.keys(productionLevels[buildingType]).length;
            const text = isMaxLevel
                ? `${buildingType.charAt(0).toUpperCase() + buildingType.slice(1)} ${i} (Max Level)`
                : `Upgrade ${buildingType.charAt(0).toUpperCase() + buildingType.slice(1)} ${i} to Level ${nextLevel}`;
            const tooltipText = isMaxLevel ? 'Max level reached!' : getUpgradeRequirements(nextLevel);

            const extraStyles = isMaxLevel ? { backgroundColor: 'green', color: 'black' } : {};

            const upgradeButton = createButton({
                text,
                tooltipText,
                onClick: isMaxLevel ? null : () => upgradeFn(i),
                isDisabled: isMaxLevel,
                extraStyles,
            });

            groupDiv.appendChild(upgradeButton);
        }

        const buildText = `Build New ${buildingType.charAt(0).toUpperCase() + buildingType.slice(1)}`;
        const buildTooltipText = count >= maxCount ? 'Max count reached!' : getUpgradeRequirements(1);
        const extraStyles = count >= maxCount
            ? { backgroundColor: 'gray', color: 'black' }
            : {};

        const buildButton = createButton({
            text: buildText,
            tooltipText: buildTooltipText,
            onClick: count >= maxCount ? null : buildFn,
            isDisabled: count >= maxCount,
            extraStyles,
        });

        groupDiv.appendChild(buildButton);
        return groupDiv;
    }

    const farmsDiv = renderBuildingGroup('farms', buildings.farms.maxCount, buildings.farms.count, buildings.farms, upgradeFarm, buildFarm);
    const minesDiv = renderBuildingGroup('mines', buildings.mines.maxCount, buildings.mines.count, buildings.mines, upgradeMine, buildMine);
    const housesDiv = renderBuildingGroup('houses', buildings.houses.maxCount, buildings.houses.count, buildings.houses, upgradeHouse, buildHouse);

    buildingActions.appendChild(farmsDiv);
    buildingActions.appendChild(minesDiv);
    buildingActions.appendChild(housesDiv);
}


renderBuildingButtons();
updateTimerDisplay();
updateResources();
