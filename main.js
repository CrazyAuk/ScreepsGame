var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var harvesterAutoSpawn = require('harvester.autoSpawn');
var builderAutoSpawn = require('builder.autoSpawn');
var upgraderAutoSpawn = require('upgrader.autoSpawn');
 
const T1 = [WORK,CARRY,MOVE];
const T2 = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];

module.exports.loop = function () {
    
    for(var name in Game.spawns) {
        harvesterAutoSpawn.run(name,T1);
        builderAutoSpawn.run(name,T1);
        upgraderAutoSpawn.run(name,T1);
    }
    
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}