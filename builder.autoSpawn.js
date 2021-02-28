/*
 * Module AutoSpawn for builders
 * 
 * If the count of builder is above 2, spawners will produce another builder
 * 
 */

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
};

module.exports = builderAutoSpawn;