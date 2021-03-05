var roleManager = require('roleManager');
var spawnManager = require('spawnManager');
var taskManager = require('taskManager');
var scanTest = require ('scan');

const BODYTYPE_TIER_1 = [WORK,CARRY,MOVE];
const BODYTYPE_TIER_2 = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];

module.exports.loop = function () {
    
    spawnManager.run(BODYTYPE_TIER_1);
    roleManager.run();
    scanTest.run();
}