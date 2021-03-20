var roleManager = require('roleManager');
var spawnManager = require('spawnManager');
var scanTest = require ('scan');
var towerScript = require('structureScript');

module.exports.loop = function () {
    
    let CPU = 0;
    let totalCPU = 0;
    let tier = Memory.Rooms['W7S46'].Structures.controller['5bbcac849099fc012e635996'].level;

    console.log('Current game tick is '  + Game.time);
    console.log('Current Tier is '  + tier);

    CPU = Game.cpu.getUsed();
    scanTest.run();
    console.log('CPU used for scan : ' + (Game.cpu.getUsed()-CPU));
    totalCPU = totalCPU + Game.cpu.getUsed()-CPU;

    CPU = Game.cpu.getUsed();
    spawnManager.run(tier-1);
    console.log('CPU used for spawn : ' + (Game.cpu.getUsed()-CPU));
    totalCPU = totalCPU + Game.cpu.getUsed()-CPU;

    CPU = Game.cpu.getUsed();
    roleManager.run();
    console.log('CPU used for role : ' + (Game.cpu.getUsed()-CPU));
    totalCPU = totalCPU + Game.cpu.getUsed()-CPU;

    CPU = Game.cpu.getUsed();
    towerScript.run();
    console.log('CPU used for tower : ' + (Game.cpu.getUsed()-CPU));
    totalCPU = totalCPU + Game.cpu.getUsed()-CPU;

    console.log('Total CPU used for tick ' + Game.time + ' : ' + totalCPU);

    
    console.log('CPU bucket: ' + Game.cpu.bucket);
    
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    
}


// ================================================================================================================================================
//                                                                PROTOTYPES
// ================================================================================================================================================

// ---------------------------------------------------------------- ROOMS -------------------------------------------------------------------------

//Contruit des 'road' entre une 'source' et le premier 'spawn'

Room.prototype.autoBuildRoad = function(sourceId) {
                
    source = Game.getObjectById(sourceId);
    const terrain = new Room.Terrain(this.name);
    
    let position = [];
    let pathFinded = {};
 
    console.log("autobuild start");

    position = Memory.Rooms[this.name].Sources[sourceId].miningPosition;
   
    console.log(position);

    pathFinded = PathFinder.search(position, Memory.Flags['Base'].pos, {
        
        plainCost: 4,
        swampCost: 20,
    
        roomCallback: function(roomName) {
    
            let room = Game.rooms[roomName];
            // In this example `room` will always exist, but since 
            // PathFinder supports searches which span multiple rooms 
            // you should be careful!
            
            if (!room) return;
            
    
                let costs = new PathFinder.CostMatrix;
                
                room.find(FIND_STRUCTURES).forEach(function(struct) {
                if (struct.structureType === STRUCTURE_ROAD) {
                    // Favor roads over plain tiles
                    
                    costs.set(struct.pos.x, struct.pos.y, 1);
                } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)) {
                    // Can't walk through non-walkable buildings
                    costs.set(struct.pos.x, struct.pos.y, 0xff);
                }
                });
                
                room.find(FIND_CONSTRUCTION_SITES).forEach(function(struct) {
                if (struct.structureType === STRUCTURE_ROAD) {
                    // Favor roads over plain tiles
                    costs.set(struct.pos.x, struct.pos.y, 1);
                } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)) {
                    // Can't walk through non-walkable buildings
                    costs.set(struct.pos.x, struct.pos.y, 0xff);
                }
                });
        
                return costs;
        },
    });
    
    for(let index = 0; index < pathFinded.path.length - 1; index++) {
        if(pathFinded.path[index].createConstructionSite(STRUCTURE_ROAD) !== OK) {
            console.log('Cannot build on position x: ' + pathFinded.path[index].x + ', y: ' + pathFinded.path[index].y)
        }
    }

console.log("autobuild done"); 

};

//Construit un 'container' à coté de chaque source de la room

Room.prototype.autoBuildContainer = function() {

console.log("autobuild start");
    
const terrain = new Room.Terrain(this.name);

let pos = {} 

let sourcesList = Memory.Rooms[this.name].Sources;
_.forEach(sourcesList, (source) =>{
    for(let x = -1; x <= 1; x++){
        for(let y = -1; y <= 1; y++){
            if((terrain.get(source.pos.x + x, source.pos.y + y)!=1) && !(x == 0 && y == 0)) {
                pos = new RoomPosition(source.pos.x + x, source.pos.y + y, this.name);
                if(pos.createConstructionSite(STRUCTURE_CONTAINER) !== OK) console.log('Cannot build on position x: ' + (source.pos.x + x) + ', y: ' + (source.pos.y + y))
                break;
            }
        }
        break;
    }
});

console.log("autobuild done");
}