/*
 * Module AutoSpawn for harvester
 * 
 * If the count of harvester is above 3, spawners will produce another harvester
 * 
 */

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
};

module.exports = harvesterAutoSpawn;