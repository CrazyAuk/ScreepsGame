var roleHarvester = require('roleManager');
var roleUpgrader = require('roleManager');
var roleBuilder = require('roleManager');
var spawnManager = require('autoSpawn');
var harvesterAutoSpawn = require('autoSpawn');
var builderAutoSpawn = require('autoSpawn');
var upgraderAutoSpawn = require('autoSpawn');
 
const T1 = [WORK,CARRY,MOVE];
const T2 = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];

module.exports.loop = function () {
    
    spawnManager.run(T1);
    
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