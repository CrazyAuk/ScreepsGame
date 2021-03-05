var roleManager = require('roleManager');
var spawnManager = require('spawnManager');
var taskManager = require('taskManager');
var analyse = require('analyse');
var sourceAnalyse = require('analyse');
var roomAnalyse = require('analyse');
var scanTest = require ('scan');

const BODYTYPE_TIER_1 = [WORK,CARRY,MOVE];
const BODYTYPE_TIER_2 = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];

module.exports.loop = function () {
    
    spawnManager.run(BODYTYPE_TIER_2);
    roleManager.run();
    //taskManager.run();
    
    //analyse.run();
    //sourceAnalyse.run();
    //roomAnalyse.run();
    
    
    scanTest.run();
}