/*
 * Module autospawn management
 * 
 * Fonctions 
 * 
 */

var spawnManager = {

    run: function(tier) {
        
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
            }
        }
        
        let harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        
        if (spawner != null) {
            if (harvester.length < 3) {
                harvesterSpawn.run(spawner,tier);
            } else {
                if (builder.length < 2) {
                    builderSpawn.run(spawner,tier);
                } else {
                    if (upgrader.length === 0) {
                        upgraderSpawn.run(spawner,tier);
                    }
                }
            }
            if (spawner.spawning) {
                let spawningCreep = Game.creeps[spawner.spawning.name];
                spawner.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawner.pos.x + 1, 
                    spawner.pos.y, 
                    {align: 'left', opacity: 0.8});
            }
        }
     
    }
}


var upgraderSpawn = {

    run: function(spawner,tier) {
    
        //var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //console.log('Upgraders: ' + upgrader.length);
            
        let newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        spawner.spawnCreep(tier, newName, {memory: {role: 'upgrader'}});
    }
}

var builderSpawn = {

    run: function(spawner,tier) {
    
        //var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Builders: ' + builder.length);
    
        let newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        spawner.spawnCreep(tier, newName, {memory: {role: 'builder'}});
    }
}

var harvesterSpawn = {

    run: function(spawner,tier) {
    
        //var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        //console.log('Harvesters: ' + harvesters.length);
    
        let newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        spawner.spawnCreep(tier, newName, {memory: {role: 'harvester'}});
        
    }
}

module.exports = spawnManager;