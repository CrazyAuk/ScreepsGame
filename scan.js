//let structures = _.set(Memory.Rooms, room, {building: 1});

var scan = {

    run: function() {
        
        if(!Memory.Rooms) {Memory.Rooms = {};}
        if(!Memory.Test) {Memory.Test = {};}
        
        //sourceScan.run();
        //buildingScan.run();
        roomScan.run();
        //creepScan.run();
    }
}

//---------------------------------------------------------------- TODO --------------------------------------------------------------------

var sourceScan = {

    run: function() {
        Memory.MyRoom.source = null;
        let constructionFile = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
        //for(let )
        console.log('hello');
        Memory.buildTask = {TaskName: constructionFile.id};
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------
var buildingScan = {

    run: function(room) {
        
        let buildings = Game.rooms[room].find(FIND_STRUCTURES);
        if(!Memory.Rooms[room].Structures) {Memory.Rooms[room].Structures = {};}
        
        const buildingType = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTROLLER, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
            STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_EXTRACTOR, STRUCTURE_LAB,
            STRUCTURE_TERMINAL, STRUCTURE_FACTORY, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER
        ];
        
        for(let i in buildingType) {
            let test = _.filter(buildings, (structure) => structure.structureType == buildingType[i]);
            if(test[0] != null) {
                if(!Memory.Rooms[room].Structures[buildingType[i]]) {Memory.Rooms[room].Structures[buildingType[i]] = {};}
                let ID = null;
                switch(buildingType[i]) {
                    case STRUCTURE_SPAWN:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                spawning: value.spawning,
                                storedEnergy: value.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: value.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_EXTENSION:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                storedEnergy: value.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: value.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_CONTROLLER:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                level: value.level,
                                progress: value.progress,
                                progressTotal: value.progressTotal,
                                ticksToDowngrade: value.ticksToDowngrade,
                                upgradeBlocked: value.upgradeBlocked
                            };
                        });
                        break;
                    case STRUCTURE_ROAD:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax
                            };
                        });
                        break;
                    case STRUCTURE_WALL:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax
                            };
                        });
                        break;
                    case STRUCTURE_RAMPART:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax
                            };
                        });
                        break;
                    case STRUCTURE_TOWER:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                storedEnergy: value.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: value.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_CONTAINER:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                storedEnergy: value.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: value.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_STORAGE:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                storedEnergy: value.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: value.store[RESOURCE_ENERGY].getCapacity
                            };
                        });
                        break;
                    case STRUCTURE_LINK:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                storedEnergy: value.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: value.store[RESOURCE_ENERGY].getCapacity,
                                cooldown: value.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_EXTRACTOR:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                cooldown: value.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_LAB:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                cooldown: value.cooldown,
                                storedEnergy: value.store[RESOURCE_ENERGY].getUsedCapacity,
                                maxCapacity: value.store[RESOURCE_ENERGY].getCapacity,
                                mineralType: value.mineralType,
                                mineralStored: value.store[value.mineralType].getCapacity(value.mineralType)
                            };
                        });
                        break;
                    case STRUCTURE_TERMINAL:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                cooldown: value.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_FACTORY:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax,
                                cooldown: value.cooldown
                            };
                        });
                        break;
                    case STRUCTURE_OBSERVER:
                        _.forEach(test, (value,index) =>{
                            ID = value.id;
                            Memory.Rooms[room].Structures[buildingType[i]][ID] = {
                                id: value.id,
                                pos: value.pos,
                                hits: value.hits,
                                hitsMax: value.hitsMax
                            };
                        });
                        break;
                }   
            }
        }
    } 
}

//------------------------------------------------------------------------------------------------------------------------------------------

var roomScan = {

    run: function() {
        
        let Rooms = Game.rooms;
        //Memory.Rooms = Rooms;
        console.log("room : " + JSON.stringify(Rooms));
        _.forEach(Rooms, (index,value) =>{
            //console.log('Room : ' + index);
            //console.log('Value : ' + value);
            if(!Memory.Rooms[value]) {Memory.Rooms[value] = {};}
            buildingScan.run(value);
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