var roleManager = require('roleManager');
var spawnManager = require('spawnManager');

const T1 = [WORK,CARRY,MOVE];
const T2 = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];

module.exports.loop = function () {
    
    spawnManager.run(T1);
    roleManager.run();
}