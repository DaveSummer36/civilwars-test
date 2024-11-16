class BuildingLogic {
    constructor() {
        this.levelUpgradeCosts = {
            1: { food: 25, gold: 50 },
            2: { food: 50, gold: 100 },
            3: { food: 75, gold: 150 },
            4: { food: 150, gold: 300 },
            5: { food: 250, gold: 500 }
        
            // New levels come later...
        };
        
        this.productionLevels = {
            farms: {
                1: 15,
                2: 25,
                3: 40,
                4: 55,
                5: 75
        
                // New levels come later...
            },
            mines: {
                1: 20,
                2: 35,
                3: 60,
                4: 80,
                5: 100
        
                // New levels come later...
            },
            houses: {
                1: 5,
                2: 10,
                3: 15,
                4: 20,
                5: 25
        
                // New levels come later...
            }
        };
    }

    getProduction(buildingType, level) {
        return this.productionLevels[buildingType]?.[level] || 0;
    }

    getUpgradeCosts(level) {
        return this.levelUpgradeCosts[level] || null;
    }
}

window.BuildingLogic = BuildingLogic;