//let structures = _.set(Memory.Rooms, room, {building: 1});

const BUILDINGS_TYPES = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTROLLER, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
    STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_EXTRACTOR, STRUCTURE_LAB,
    STRUCTURE_TERMINAL, STRUCTURE_FACTORY, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER
];

var scan = {

    run: function() {
        
        if(!Memory.Rooms) Memory.Rooms = {};
        if(!Memory.Test) Memory.Test = {};
        
        //sourceScan.run();
        //buildingScan.run();
        roomScan.run();
        //creepScan.run();
    }
}

//---------------------------------------------------------------- TODO --------------------------------------------------------------------

var sourceScan = {

    run: function(room) {
        
        if(!Memory.Rooms[room].Sources) Memory.Rooms[room].Structures = {};
        let sourceList = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
        
        //for(let )
        console.log('hello');
        Memory.buildTask = {TaskName: constructionFile.id};
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------
var buildingScan = {

    run: function(room) {
        
        if(!Memory.Rooms[room].Structures) Memory.Rooms[room].Structures = {};
        let buildings = Game.rooms[room].find(FIND_STRUCTURES);
        
        for(let buildingType in BUILDINGS_TYPES) {
            let buildingList = _.filter(buildings, (structure) => structure.structureType == BUILDINGS_TYPES[buildingType]);
            if(buildingList[0] != null) {
                if(!Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]]) {Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]] = {};}
                switch(buildingType) {
                    case STRUCTURE_SPAWN:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                spawning: structure.spawning,
                                storedEnergy: structure.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: structure.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_EXTENSION:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                storedEnergy: structure.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: structure.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_CONTROLLER:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                level: structure.level,
                                progress: structure.progress,
                                progressTotal: structure.progressTotal,
                                ticksToDowngrade: structure.ticksToDowngrade,
                                upgradeBlocked: structure.upgradeBlocked
                            };
                        });
                        break;
                    case STRUCTURE_ROAD:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax
                            };
                        });
                        break;
                    case STRUCTURE_WALL:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax
                            };
                        });
                        break;
                    case STRUCTURE_RAMPART:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax
                            };
                        });
                        break;
                    case STRUCTURE_TOWER:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                storedEnergy: structure.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: structure.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_CONTAINER:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                storedEnergy: structure.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: structure.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_STORAGE:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                storedEnergy: structure.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: structure.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_LINK:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                storedEnergy: structure.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: structure.store[RESOURCE_ENERGY].getCapacity,
                                cooldown: structure.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_EXTRACTOR:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                cooldown: structure.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_LAB:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                cooldown: structure.cooldown,
                                storedEnergy: structure.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: structure.store[RESOURCE_ENERGY].getCapacity,
                                mineralType: structure.mineralType,
                                mineralStored: structure.store[structure.mineralType].getCapacity(structure.mineralType)
                            };
                        });
                        break;
                    case STRUCTURE_TERMINAL:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                cooldown: structure.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_FACTORY:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                cooldown: structure.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_OBSERVER:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax
                            };
                        });
                        break;
                    default:
                        bread;
                }   
            }
        }
    } 
}

//------------------------------------------------------------------------------------------------------------------------------------------

var roomScan = {

    run: function() {
        
        let rooms = Game.rooms;
        
        _.forEach(rooms, (index,room) =>{
            if(!Memory.Rooms[room]) {Memory.Rooms[room] = {};}
            buildingScan.run(room);
        });
    }
}

//---------------------------------------------------------------- TODO --------------------------------------------------------------------

var creepScan = {

    run: function() {
        
        console.log('creep');
        Memory.test.creep = null;
    }
}
        
module.exports = scan;