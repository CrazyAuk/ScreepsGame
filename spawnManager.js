/*
 * Module de gestion de 'Spawn' de 'Creep'
 * 
 * Spawn pour Rôles actifs:
 *  - Builder : 1
 *  - Upgrader : 1
 *  - Harvester : 2
 *  - Carrier : 2
 *  - Repairer : 2
 * 
 *  TODO:
 *  - nothing for now
 * 
 */

var spawnManager = {

    run: function(tier) {
        
        //effacement des noms de creeps non utilisé pour vider la mémoire
        for(let name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        for(let name in Game.spawns){
            if (Game.spawns[name].spawning) {
                let spawningCreep = Game.creeps[Game.spawns[name].spawning.name];
                Game.spawns[name].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[name].pos.x + 1, 
                    Game.spawns[name].pos.y, 
                    {align: 'left', opacity: 0.8});
            }
        }
        
        //récupération du nombre de creep par rôles
        let harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        let repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        let carrier = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
        
        if (harvester.length < 2) {
            harvesterSpawn.run(tier);
        } else if (carrier.length < 3) {
            carrierSpawn.run(tier);
        } else if (builder.length < 1) {
            builderSpawn.run(tier);
        } else if (upgrader.length < 1) {
            upgraderSpawn.run(tier);
        } else if (repairer.length < 1) {
            repairerSpawn.run(tier);
        } 
    }
}

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Spawn de Upgrader
 * 
 * Fonctionnement: 
 * Affecte: un nom en fonction du 'tick' de la partie ('Game.time'), un template de 'Bodypart'
 * en fonction du 'Tier' ainsi que le role 'upgrader' .
 * 
 */

var upgraderSpawn = {

    run: function(tier) {

        let bodyTemplate = [];

        switch(tier){
            case 1:
                bodyTemplate = [MOVE, WORK, CARRY];
                break;
            case 2:
                bodyTemplate = [MOVE, MOVE,	MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY];
                break;
            case 3:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                break;
            default:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY, CARRY];
                break;
        }

        let spawner = null;
        
        for(let name in Game.spawns){
            let canSpawn = Game.spawns[name].spawnCreep(bodyTemplate, 'test', { dryRun: true });
            if (canSpawn === 0) {
                let newName = 'Upgrader' + Game.time;
                Game.spawns[name].spawnCreep(bodyTemplate, newName, {memory: {role: 'upgrader'}});
                break;
            } else {
                if (Game.spawns[name].spawning) {
                    let spawningCreep = Game.creeps[Game.spawns[name].spawning.name];
                    Game.spawns[name].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        Game.spawns[name].pos.x + 1, 
                        Game.spawns[name].pos.y, 
                        {align: 'left', opacity: 0.8});
                }
            }
        }
         
        

    }
}

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Spawn de Builder
 * 
 * Fonctionnement: 
 * Affecte: un nom en fonction du 'tick' de la partie ('Game.time'), un template de 'Bodypart'
 * en fonction du 'Tier' ainsi que le role 'builder' .
 * 
 */

var builderSpawn = {

    run: function(tier) {

        let bodyTemplate = [];

        switch(tier){
            case 1:
                bodyTemplate = [MOVE, WORK, CARRY];
                break;
            case 2:
                bodyTemplate = [MOVE, MOVE,	MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY];
                break;
            case 3:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                break;
            default:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY, CARRY];
                break;
        }

        let spawner = null;
        
        for(let name in Game.spawns){
            let canSpawn = Game.spawns[name].spawnCreep(bodyTemplate, 'test', { dryRun: true });
            if (canSpawn === 0) {
                let newName = 'Builder' + Game.time;
                Game.spawns[name].spawnCreep(bodyTemplate, newName, {memory: {role: 'builder', building: null}});
                break;
            } else {
                if (Game.spawns[name].spawning) {
                    let spawningCreep = Game.creeps[Game.spawns[name].spawning.name];
                    Game.spawns[name].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        Game.spawns[name].pos.x + 1, 
                        Game.spawns[name].pos.y, 
                        {align: 'left', opacity: 0.8});
                }
            }
        }
    
        

    }
}

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Spawn de Harvester
 * 
 * Fonctionnement: 
 * Affecte: un nom en fonction du 'tick' de la partie ('Game.time'), un template de 'Bodypart'
 * en fonction du 'Tier' ainsi que le role 'harvester' .
 * 
 */

var harvesterSpawn = {

    run: function(tier) {

        let bodyTemplate = [];

        switch(tier){
            case 1:
                bodyTemplate = [MOVE, WORK, WORK, CARRY];
                break;
            case 2:
                bodyTemplate = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY];
                break;
            case 3:
                bodyTemplate = [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY];
                break;
            default:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY, CARRY];
                break;
        }
        
        for(let name in Game.spawns){
            let canSpawn = Game.spawns[name].spawnCreep(bodyTemplate, 'test', { dryRun: true });
            if (canSpawn === 0) {
                let newName = 'Harvester' + Game.time;
                Game.spawns[name].spawnCreep(bodyTemplate, newName, {memory: {role: 'harvester'}});
                break;
            } else {
                if (Game.spawns[name].spawning) {
                    let spawningCreep = Game.creeps[Game.spawns[name].spawning.name];
                    Game.spawns[name].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        Game.spawns[name].pos.x + 1, 
                        Game.spawns[name].pos.y, 
                        {align: 'left', opacity: 0.8});
                }
            }
        }
    }
}


/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Spawn de Repairer
 * 
 * Fonctionnement: 
 * Affecte: un nom en fonction du 'tick' de la partie ('Game.time'), un template de 'Bodypart'
 * en fonction du 'Tier' ainsi que le role 'Repairer' .
 * 
 */

var repairerSpawn = {

    run: function(tier) {

        let bodyTemplate = [];

        switch(tier){
            case 1:
                bodyTemplate = [MOVE, WORK, CARRY];
                break;
            case 2:
                bodyTemplate = [MOVE, MOVE,	MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY];
                break;
            case 3:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                break;
            default:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK,
                    CARRY, CARRY, CARRY, CARRY, CARRY];
                break;
        }
        
        for(let name in Game.spawns){
            let canSpawn = Game.spawns[name].spawnCreep(bodyTemplate, 'test', { dryRun: true });
            if (canSpawn === 0) {
                let newName = 'Repairer' + Game.time;
                Game.spawns[name].spawnCreep(bodyTemplate, newName, {memory: {role: 'repairer'}});
                break;
            } else {
                if (Game.spawns[name].spawning) {
                    let spawningCreep = Game.creeps[Game.spawns[name].spawning.name];
                    Game.spawns[name].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        Game.spawns[name].pos.x + 1, 
                        Game.spawns[name].pos.y, 
                        {align: 'left', opacity: 0.8});
                }
            }
        }
    }
}

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Spawn de Carrier
 * 
 * Fonctionnement: 
 * Affecte: un nom en fonction du 'tick' de la partie ('Game.time'), un template de 'Bodypart'
 * en fonction du 'Tier' ainsi que le role 'Carrier' .
 * 
 */

var carrierSpawn = {

    run: function(tier) {

        let bodyTemplate = [];

        switch(tier){
            case 1:
                bodyTemplate = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY];
                break;
            case 2:
                bodyTemplate = [MOVE, MOVE,	MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY];
                break;
            case 3:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    CARRY, CARRY];
                break;
            case 4:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
                break;
            default:
                bodyTemplate = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
                break;
        }
        
        for(let name in Game.spawns){
            let canSpawn = Game.spawns[name].spawnCreep(bodyTemplate, 'test', { dryRun: true });
            if (canSpawn === 0) {
                let newName = 'Carrier' + Game.time;
                Game.spawns[name].spawnCreep(bodyTemplate, newName, {memory: {role: 'carrier', transportingTo : {}}});
                break;
            } else {
                if (Game.spawns[name].spawning) {
                    let spawningCreep = Game.creeps[Game.spawns[name].spawning.name];
                    Game.spawns[name].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        Game.spawns[name].pos.x + 1, 
                        Game.spawns[name].pos.y, 
                        {align: 'left', opacity: 0.8});
                }
            }
        }
    }
}

/*---------------------------------------------------------------------------------------------------------------------------------*/

module.exports = spawnManager;