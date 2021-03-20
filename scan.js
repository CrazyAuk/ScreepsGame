/*
 * Module scan
 * 
 * Ce module permettera d'effectuer un scan des 'rooms' ayant au moins un creep ou une structure sous contrôle.
 * Il va catographier :
 *  - les sites de constructions
 *  - les 'sources'
 *  - les batiments
 * 
 * TODO:
 *  - faire un module utilitaire
 *  - affecter le point de minage a chaque source
 *  - faire monter de deux niveau les files de constructions et de réparation
 *
 * 
 */

const BUILDINGS_TYPES = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTROLLER, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
    STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_EXTRACTOR, STRUCTURE_LAB,
    STRUCTURE_TERMINAL, STRUCTURE_FACTORY, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER];

const HIGH_PRIORITY = [STRUCTURE_SPAWN, STRUCTURE_LINK, STRUCTURE_CONTROLLER, STRUCTURE_EXTENSION, STRUCTURE_POWER_SPAWN];
const MID_PRIORITY = [STRUCTURE_NUKER,  STRUCTURE_RAMPART, STRUCTURE_TOWER, STRUCTURE_ROAD, STRUCTURE_OBSERVER];
const LOW_PRIORITY = [STRUCTURE_LAB,  STRUCTURE_WALL, STRUCTURE_FACTORY, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_EXTRACTOR, STRUCTURE_TERMINAL];

var scan = {

    run: function() {

       /*Memory.FileDeReparation = {};
        Memory.FileDeReparation.HautePriorité = {};
        Memory.FileDeReparation.MoyennePriorité = {};
        Memory.FileDeReparation.BassePriorité = {};*/
        
        roomScan.run();
        flagScan.run();

    }
}

//------------------------------------------------------------------------------------------------------------------------------------------

var roomScan = {

    run: function() {

        if(!Memory.Rooms) Memory.Rooms = {};

        Memory.FileDeReparation = {};
        Memory.FileDeReparation.HautePriorité = {};
        Memory.FileDeReparation.MoyennePriorité = {};
        Memory.FileDeReparation.BassePriorité = {};

        Memory.FileDeConstruction = {};
        Memory.FileDeConstruction.HautePriorité = {};
        Memory.FileDeConstruction.MoyennePriorité = {};
        Memory.FileDeConstruction.BassePriorité = {};

        let rooms = Game.rooms;
        
        _.forEach(rooms, (room) =>{

            if(!Memory.Rooms[room.name]) Memory.Rooms[room.name] = {};

            if(!Memory.Rooms[room.name].owned) Memory.Rooms[room.name].owned = null;

            //raz de la mémoire de la room
            //delete Memory.Rooms[room.name].Sources;
            delete Memory.Rooms[room.name].Structures;

            sourceScan.run(room.name);
            if(Memory.Rooms[room.name].owned){
                buildingScan.run(room.name);
                constructionScan.run(room.name);
                repairScan.run(room.name);
            }
        });
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------

var sourceScan = {

    run: function(room) {
        
        if(!Memory.Rooms[room].Sources) Memory.Rooms[room].Sources = {};

        let target = {};

        let sourceList = Game.rooms[room].find(FIND_SOURCES);

        _.forEach(sourceList, (source) =>{

            if(typeof Memory.Rooms[room].Sources[source.id] === 'undefined' || Memory.Rooms[room].Sources[source.id] === 'null' ){
                //console.log('typeof passed');
                target = {pos: source.pos, range: 1}
                pathFinded = PathFinder.search(Memory.Flags['Base'].pos, target, {
                
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

                //console.log(JSON.stringify(pathFinded.path.length));

                Memory.Rooms[room].Sources[source.id] = {
                    id: source.id,
                    pos: source.pos,
                    miningPosition : pathFinded.path[pathFinded.path.length - 1],
                    mined: null
                };
            }
        });
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
                switch(BUILDINGS_TYPES[buildingType]) {
                    case STRUCTURE_SPAWN:
                        _.forEach(buildingList, (structure) =>{
                            Memory.Rooms[room].Structures[BUILDINGS_TYPES[buildingType]][structure.id] = {
                                id: structure.id,
                                pos: structure.pos,
                                hits: structure.hits,
                                hitsMax: structure.hitsMax,
                                spawning: structure.spawning,
                                storedEnergy: structure.store.getUsedCapacity(RESOURCE_ENERGY),
                                maxCapacity: structure.store.getCapacity(RESOURCE_ENERGY)
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
                                storedEnergy: structure.store.getUsedCapacity(RESOURCE_ENERGY),
                                maxCapacity: structure.store.getCapacity(RESOURCE_ENERGY)
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
                                storedEnergy: structure.store.getUsedCapacity(RESOURCE_ENERGY),
                                maxCapacity: structure.store.getCapacity(RESOURCE_ENERGY)
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
                                storedEnergy: structure.store.getUsedCapacity(RESOURCE_ENERGY),
                                maxCapacity: structure.store.getCapacity(RESOURCE_ENERGY)
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
                                storedEnergy: structure.store.getUsedCapacity(RESOURCE_ENERGY),
                                maxCapacity: structure.store.getCapacity(RESOURCE_ENERGY)
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
                                storedEnergy: structure.store.getUsedCapacity(RESOURCE_ENERGY),
                                maxCapacity: structure.store.getCapacity(RESOURCE_ENERGY),
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
                                storedEnergy: structure.store.getUsedCapacity(RESOURCE_ENERGY),
                                maxCapacity: structure.store.getCapacity(RESOURCE_ENERGY),
                                mineralType: structure.mineralType,
                                mineralStored: structure.store.getCapacity(structure.mineralType)
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
                        break;
                }   
            }
        }
    } 
}

//------------------------------------------------------------------------------------------------------------------------------------------


var constructionScan = {

    run: function(room) {

        let buildingQueue = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
        let priority = 0;

        _.forEach(buildingQueue, (constructionSites) =>{
    
            if(HIGH_PRIORITY.includes(constructionSites.structureType)) {
                priority = 'high';
                Memory.FileDeConstruction.HautePriorité[constructionSites.id] = {
                    id: constructionSites.id,
                    pos: constructionSites.pos,
                    structureType: constructionSites.structureType,
                    priority : priority
                };
            }else if(MID_PRIORITY.includes(constructionSites.structureType)) {
                priority = 'mid';
                Memory.FileDeConstruction.MoyennePriorité[constructionSites.id] = {
                    id: constructionSites.id,
                    pos: constructionSites.pos,
                    structureType: constructionSites.structureType,
                    priority : priority
                };
            }else if(LOW_PRIORITY.includes(constructionSites.structureType)) {
                priority = 'low';
                Memory.FileDeConstruction.BassePriorité[constructionSites.id] = {
                    id: constructionSites.id,
                    pos: constructionSites.pos,
                    structureType: constructionSites.structureType,
                    priority : priority
                };
            }
            
        });
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------

var repairScan = {

    run: function(room) {

        let repairQueue = {};
        let structureTypeList = Memory.Rooms[room].Structures;

        _.forEach(structureTypeList, (structureType) =>{
            _.forEach(structureType, (structure) =>{
                if((structure.hits/structure.hitsMax)<0.90) repairQueue[structure.id] = structure; 
            });
        });
        
        _.forEach(repairQueue, (structure) =>{
            if(HIGH_PRIORITY.includes(Game.getObjectById(structure.id).structureType)) {
                Memory.FileDeReparation.HautePriorité[structure.id] = structure;
            }else if(MID_PRIORITY.includes(Game.getObjectById(structure.id).structureType)) {
                Memory.FileDeReparation.MoyennePriorité[structure.id] = structure;
            }else if(LOW_PRIORITY.includes(Game.getObjectById(structure.id).structureType)) {
                Memory.FileDeReparation.BassePriorité[structure.id] = structure;
            }
        });
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------

var flagScan = {

    run: function() {

        if(!Memory.Flags) Memory.Flags = {};

        let flags = Game.flags;

        //Vidage de la mémoire flag
        for(let name in Memory.Flags) {
            if(!Game.flags[name]) {
                delete Memory.Flags[name];
                console.log('Clearing non-existing flag memory:', name);
            }
        }

        _.forEach(flags, (flag) =>{

            if(!Memory.Flags[flag.name]) Memory.Flags[flag.name] = flag;

            if(flag.name.includes('distantRoom') || flag.name.includes('Base')){
                Memory.Rooms[flag.pos.roomName].owned = true;
            } else {
                Memory.Rooms[flag.pos.roomName].owned = false;
            }

        });
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------

function nombreMineurMax(room,source) {
    
    let caseVide = 0;
    
    const terrain = new Room.Terrain(room);
    
    for(let x=-1; x<=1; x++){
        for(let y=-1; y<=1; y++){
             if((terrain.get(source.pos.x + x, source.pos.y + y)!=1) && !(x == 0 && y == 0)) caseVide++;
        }
    }
    
    return caseVide;
}
        
module.exports = scan;