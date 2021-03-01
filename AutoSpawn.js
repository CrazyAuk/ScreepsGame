/*
 * Module autospawn management
 * 
 * Fonctions 
 * 
 */

var spawnManager = {

    run: function(tier) {
        
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        
        for(var name in Game.spawns){
            let canSpawn = Game.spawns[name].spawnCreep(tier, 'test', { dryRun: true });
            if (canSpawn === 0) {
                var spawner = Game.spawns[name];
                break;
            }
        }
        
        let harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        
        if(harvester.length < 3) {
            harvesterSpawn.run(spawner,tier);
        }else{
            if(builder.length < 2) {
                builderSpawn.run(spawner,tier);
            }else{
                if(upgrader.length < 1) {
                    upfraderSpawn.run(spawner,tier);
                }
            }
        }
        
        if(Game.spawns[spawner].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns[spawner].spawning.name];
            spawner.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawner].pos.x + 1, 
                Game.spawns[spawner].pos.y, 
                {align: 'left', opacity: 0.8});
        }
     
    }
};


var upgraderSpawn = {

    run: function(spawner,tier) {
    
        //var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //console.log('Upgraders: ' + upgrader.length);
            
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns[spawner].spawnCreep(tier, newName, {memory: {role: 'upgrader'}});
    }
};

var builderSpawn = {

    run: function(spawner,tier) {
    
        //var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Builders: ' + builder.length);
    
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[spawner].spawnCreep(tier, newName, {memory: {role: 'builder'}});
    }
};

var harvesterSpawn = {

    run: function(spawner,tier) {
    
        //var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        //console.log('Harvesters: ' + harvesters.length);
    
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[spawner].spawnCreep(tier, newName, {memory: {role: 'harvester'}});
        
    }
};

module.exports = spawnManager;