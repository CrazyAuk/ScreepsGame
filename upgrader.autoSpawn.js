/*
 * Module AutoSpawn for upgrader
 * 
 * If the count of upgrader is above 1, spawners will produce another upgrader
 * 
 */

var upgraderAutoSpawn = {
    
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

module.exports = upgraderAutoSpawn;