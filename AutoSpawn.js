/*
 * Module autospawn management
 * 
 * Fonctions 
 * 
 */

var AutoSpawn = {

    run: function(tier) {
     
    

    }
}

var upgrader = {

    run: function(spawner,tier) {
    
        var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('Upgraders: ' + upgrader.length);
    
        var canSpawn = Game.spawns[spawner].spawnCreep(tier, 'test', { dryRun: true });
        
        if (canSpawn == 0) {
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }
            
            if(upgrader.length < 1) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns[spawner].spawnCreep(tier, newName, 
                    {memory: {role: 'upgrader'}});
            }
            
            if(Game.spawns[spawner].spawning) { 
                var spawningCreep = Game.creeps[spawner.spawning.name];
                sapwner.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[spawner].pos.x + 1, 
                    Game.spawns[spawner].pos.y, 
                    {align: 'left', opacity: 0.8});
            }
        }
    }
};

var builderAutoSpawn = {

    run: function(spawner,tier) {
    
        var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        console.log('Builders: ' + builder.length);
    
        var canSpawn = Game.spawns[spawner].spawnCreep(tier, 'test', { dryRun: true });
        
        if (canSpawn == 0) {
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }
            
            if(builder.length < 2) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns[spawner].spawnCreep(tier, newName, 
                    {memory: {role: 'builder'}});
            }
            
            if(Game.spawns[spawner].spawning) { 
                var spawningCreep = Game.creeps[spawner.spawning.name];
                Game.spawns[spawner].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[spawner].pos.x + 1, 
                    Game.spawns[spawner].pos.y, 
                    {align: 'left', opacity: 0.8});
            }
        }
    }
}

var harvesterAutoSpawn = {

    run: function(spawner,tier) {
    
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        console.log('Harvesters: ' + harvesters.length);
    
        var canSpawn = Game.spawns[spawner].spawnCreep(tier, 'test', { dryRun: true });
        
        if (canSpawn == 0) {
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }
            
            if(harvesters.length < 3) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                Game.spawns[spawner].spawnCreep(tier, newName, 
                    {memory: {role: 'harvester'}});
            }
            
            if(Game.spawns[spawner].spawning) { 
                var spawningCreep = Game.creeps[Game.spawns[spawner].spawning.name];
                sapwner.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[spawner].pos.x + 1, 
                    Game.spawns[spawner].pos.y, 
                    {align: 'left', opacity: 0.8});
            }
        }
    }
}
