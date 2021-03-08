/*
 * Module de 'Rooms'
 * 
 * 
 * 
 * TODO: 
 *  - affecter des variables aux nombres de 'Creep' par rôle
 *  - créer une liste de rôle pour l'utiliser dans la récupération du nombre de 'Creep'
 * 
 */

const BUILDINGS_TYPES = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTROLLER, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
    STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_EXTRACTOR, STRUCTURE_LAB,
    STRUCTURE_TERMINAL, STRUCTURE_FACTORY, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER];

const HIGH_PRIORITY = [STRUCTURE_SPAWN, STRUCTURE_LINK, STRUCTURE_CONTROLLER, STRUCTURE_EXTENSION, STRUCTURE_POWER_SPAWN];
const MID_PRIORITY = [STRUCTURE_NUKER, STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_TOWER, STRUCTURE_OBSERVER];
const LOW_PRIORITY = [STRUCTURE_LAB, STRUCTURE_FACTORY, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_ROAD, STRUCTURE_EXTRACTOR, STRUCTURE_TERMINAL];

var scan = {

    run: function() {
        
        roomScan.run();
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------

var sourceScan = {

    run: function(room) {
        
        if(!Memory.Rooms[room].Sources) Memory.Rooms[room].Sources = {};
        let sourceList = Game.rooms[room].find(FIND_SOURCES);
        
        _.forEach(sourceList, (source) =>{
            let nbMineurMax = nombreMineurMax(room,source);

            Memory.Rooms[room].Sources[source.id] = {
                id: source.id,
                pos: source.pos,
                energy: source.energy,
                energyCapacity: source.energyCapacity,
                nbMineurMax : nbMineurMax,
                nbMineur: 0
            };
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

var roomScan = {

    run: function() {

        delete Memory.Rooms;
        Memory.Rooms = {};

        let rooms = Game.rooms;
        
        _.forEach(rooms, (index,room) =>{
            if(!Memory.Rooms[room]) {Memory.Rooms[room] = {};}
            buildingScan.run(room);
            sourceScan.run(room);
            constructionScan.run(room);
            repairScan.run(room);
        });
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------

var constructionScan = {

    run: function(room) {

        Memory.Rooms[room].FileDeConstruction = {};
        Memory.Rooms[room].FileDeConstruction.HautePriorité = {};
        Memory.Rooms[room].FileDeConstruction.MoyennePriorité = {};
        Memory.Rooms[room].FileDeConstruction.BassePriorité = {};

        let buildingQueue = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
        let priority = 0;

        _.forEach(buildingQueue, (constructionSites) =>{
            if(HIGH_PRIORITY.includes(constructionSites.structureType)) {
                priority = 'high';
                Memory.Rooms[room].FileDeConstruction.HautePriorité[constructionSites.id] = {
                    id: constructionSites.id,
                    pos: constructionSites.pos,
                    structureType: constructionSites.structureType,
                    priority : priority
                };
            }else if(MID_PRIORITY.includes(constructionSites.structureType)) {
                priority = 'mid';
                Memory.Rooms[room].FileDeConstruction.MoyennePriorité[constructionSites.id] = {
                    id: constructionSites.id,
                    pos: constructionSites.pos,
                    structureType: constructionSites.structureType,
                    priority : priority
                };
            }else if(LOW_PRIORITY.includes(constructionSites.structureType)) {
                priority = 'low';
                Memory.Rooms[room].FileDeConstruction.BassePriorité[constructionSites.id] = {
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

        Memory.Rooms[room].FileDeReparation = {};
        Memory.Rooms[room].FileDeReparation.HautePriorité = {};
        Memory.Rooms[room].FileDeReparation.MoyennePriorité = {};
        Memory.Rooms[room].FileDeReparation.BassePriorité = {};

        let repairQueue = {};
        let structureTypeList = Memory.Rooms[room].Structures;

        _.forEach(structureTypeList, (structureType) =>{
            _.forEach(structureType, (structure) =>{
                if((structure.hits/structure.hitsMax)<0.90) repairQueue[structure.id] = structure; 
            });
        });
        
        _.forEach(repairQueue, (structure) =>{
            if(HIGH_PRIORITY.includes(Game.getObjectById(structure.id).structureType)) {
                Memory.Rooms[room].FileDeReparation.HautePriorité[structure.id] = structure;
            }else if(MID_PRIORITY.includes(Game.getObjectById(structure.id).structureType)) {
                Memory.Rooms[room].FileDeReparation.MoyennePriorité[structure.id] = structure;
            }else if(LOW_PRIORITY.includes(Game.getObjectById(structure.id).structureType)) {
                Memory.Rooms[room].FileDeReparation.BassePriorité[structure.id] = structure;
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