/*
 * Module de gestion de 'Spawn' de 'Creep'
 * 
 * Spawn pour Rôles actifs:
 *  - Builder : 2
 *  - Upgrader : 1
 *  - Harvester : 5
 * 
 * Tier sera à modifier dans le main. A terme le Tier sera géré via le niveau du 'Controler'
 * de la salle principale ou 'Hub'.
 * 
 * TODO: 
 *  - affecter des variables aux nombres de 'Creep' par rôle
 *  - créer une liste de rôle pour l'utiliser dans la récupération du nombre de 'Creep'
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
        
        let spawner = null;
        
        for(let name in Game.spawns){
            let canSpawn = Game.spawns[name].spawnCreep(tier, 'test', { dryRun: true });
            if (canSpawn === 0) {
                spawner = Game.spawns[name];
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
        
        //récupération du nombre de creep par rôles
        let harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        
        if (spawner != null) {
            if (harvester.length < 5) {
                harvesterSpawn.run(spawner,tier);
            } else {
                if (builder.length < 1) {
                    builderSpawn.run(spawner,tier);
                } else {
                    if (upgrader.length === 0) {
                        upgraderSpawn.run(spawner,tier);
                    }
                }
            }
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

    run: function(spawner,tier) {
    
        //var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //console.log('Upgraders: ' + upgrader.length);
            
        let newName = 'Upgrader' + Game.time;
        //console.log('Spawning new upgrader: ' + newName);
        spawner.spawnCreep(tier, newName, {memory: {role: 'upgrader'}});
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

    run: function(spawner,tier) {
    
        //var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Builders: ' + builder.length);
    
        let newName = 'Builder' + Game.time;
        //console.log('Spawning new builder: ' + newName);
        spawner.spawnCreep(tier, newName, {memory: {role: 'builder', building: null}});
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

    run: function(spawner,tier) {
    
        //var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        //console.log('Harvesters: ' + harvesters.length);
    
        let newName = 'Harvester' + Game.time;
        //console.log('Spawning new harvester: ' + newName);
        spawner.spawnCreep(tier, newName, {memory: {role: 'harvester'}});
    }
}

/*---------------------------------------------------------------------------------------------------------------------------------*/

module.exports = spawnManager;