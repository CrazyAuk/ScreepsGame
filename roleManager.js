/*
 * Module de gestion de roles
 * 
 * Rôles actifs:
 *  - Builder : construire aux site de construction en prenant l'energie du stockage
 *  - Upgrader : améliorer le controler en prenant l'energie du stockage
 *  - Harvester : récuperer de l'energie depuis une source et l'amener dans un stockage
 *  - Repairer : réparera les structures endommagées
 *  - Carrier : transportera les ressources des 'container' dans un autre stockages avec priorisation:
 *              'spawn' -> 'extension' -> 'tower' -> 'storage'
 * 
 * Rôles à venir:
 *  - Soldier :
 *      - Infantry : haute défense, dps moyen, corps à corps, capacité de détruire les batiments
 *      - Artillery : basse défense, haut dps, à distance
 *      - Medic : défense moyenne, dps faible, hybride, capacité de soigné
 *  - Scout : scannera les salles pour récuperer de l'information
 *  - Colon : agira en tant que stockage mobile avec un bodypart 'CLAIM', permettra de construire une colonie rapidement
 * 
 * TODO:
 *  - optimiser déplacement du 'carrier'
 *  - optimiser déplacement du 'builder'
 *  - optimiser déplacement du 'repairer'
 *  - optimiser déplacement du 'upgrader'
 *  - ajout des nouveau rôles
 * 
 */

var roles = {
    run: function() {

        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            let CPU = Game.cpu.getUsed();
            switch(creep.memory.role){
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepairDrone.run(creep);
                    break;
                case 'carrier':
                    roleCarrier.run(creep);
                    break;
                case 'scout':
                    roleScout.run(creep);
                    break;
            }
            //console.log('CPU used for ' + Game.creeps[name] + ' : ' + (Game.cpu.getUsed()-CPU));
        }
    }
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role Builder
 * 
 * Fonctionnement: 
 * Le 'Builder' récuperrera de l'énergie du stockage (hors spawns et extensions) le plus proche afin
 * de construire les batiments de la liste 'FilDeConstruction'. Cette liste sera générée (avec priorités)
 * dans le module de scan et sera stockée en mémoire.
 * 
 */

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //bascule entre mode construction et récupération de ressources
        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.building = false;
        } else if(!creep.memory.building){
            creep.memory.building = true;
        }

        //if{..} -> mode construction
        //else{...} -> mode récupération de ressources
	    if(creep.memory.building) {

            let target = [];
            let listHP = [];
            let listMP = [];
            let listBP = [];
            let hautePrio = Memory.FileDeConstruction.HautePriorité;
            let moyennePrio = Memory.FileDeConstruction.MoyennePriorité;
            let bassePrio = Memory.FileDeConstruction.BassePriorité;

            _.forEach(hautePrio, (structure) =>{
                listHP.push(structure.id);
            });
            _.forEach(moyennePrio, (structure) =>{
                listMP.push(structure.id);
            });
            _.forEach(bassePrio, (structure) =>{
                listBP.push(structure.id);
            });

            if(listHP.length !== 0){
                target = Game.getObjectById(listHP[0]);
	        } else if(listMP.length !== 0){
                target = Game.getObjectById(listMP[0]);
            } else if(listBP.length !== 0){
                target = Game.getObjectById(listBP[0]);
            }

            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            
	    } else {

            let storage = [];
            let roomStorageStructure = [];

            storingStructures = Memory.Rooms['W7S46'].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy > 0) test = storage.push(Game.getObjectById(structure.id));
            });

            if(storage.length !== 0){
                roomStorageStructure = storage[0];
                if (creep.withdraw(roomStorageStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(roomStorageStructure);
                }  
            }
        }
	}
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role Upgrader
 * 
 * Fonctionnement: 
 * Le 'Upgrader' récuperrera de l'énergie du stockage (hors spawns et extensions) le plus proche afin
 * d'améliorer le controleur de sa salle. Il sera attribué à une salle, on cherche à avoir à minima un
 * 'Upgrader' par salle.
 * 
 */

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //bascule entre le mode 'upgrade' et récupération de ressources 
        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.upgrading = false;
        } else if(!creep.memory.upgrading){
            creep.memory.upgrading = true;
        }

        //if{..} -> mode 'upgrade'
        //else{...} -> mode récupération de ressources
	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
	    } else {
	        
            let container = [];
            let storage = [];
            let nearestStorage = [];
            let roomStorageStructure = [];

            storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy >= creep.store.getCapacity()) test = container.push(Game.getObjectById(structure.id));
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy > 0) test = storage.push(Game.getObjectById(structure.id));
            });

            if(storage.length !== 0){
                roomStorageStructure = storage;
            } else if(container.length !== 0) {
                roomStorageStructure = container;
            }

            nearestStorage = creep.pos.findClosestByPath(roomStorageStructure, {
                filter: (structure) => {return (structure.store.getFreeCapacity(RESOURCE_ENERGY) != structure.store.getCapacity(RESOURCE_ENERGY))}
            });
            
            if (creep.withdraw(nearestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestStorage);
            }
        }   
	}
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role Harvester
 * 
 * Fonctionnement: 
 * Le 'Harvester' minera de l'énergie d'une source puis viendra la transferer dans un stockage. Un 'container' sera placé en fonction
 * du nombre de place libre autour d'une source. Chaque 'Harvester' s'affectera à une place libre afin de miner. 
 * 
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let target = [];
        let harvestedSource = {};

        if(creep.ticksToLive <= 5) {
            Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = false;
            creep.suicide();
        } 

        //if{...} -> mode minage de ressources
        //else{...} -> mode tranfert de ressources
        if(creep.store[RESOURCE_ENERGY] !== creep.store.getCapacity()){
            if(!creep.memory.workingOn) {
                let sourcesList = Memory.Rooms[creep.room.name].Sources;
                _.forEach(sourcesList, (source) =>{
                    if(!source.mined) {
                        harvestedSource = Game.getObjectById(source.id);
                        return false;
                    }
                });
                creep.memory.workingOn = harvestedSource.id;
                if (typeof Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined !== 'undefined' ||
                        Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined  === null) {
                    Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = true;
                } else {
                    Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = null;
                    Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = true;
                }
            }
            creep.memory.harvesting = true;
        } else if(creep.memory.harvesting){
            creep.memory.harvesting = false;
        }

        //if{...} -> mode minage de ressources
        //else{...} -> mode transfert de ressources
	    if (creep.memory.harvesting) {
            harvestedSource = Game.getObjectById(creep.memory.workingOn);
            if (creep.harvest(harvestedSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(harvestedSource);
            }
        } else {
            
            let container = [];
            let storage = [];
            let spawn = [];

            let nearestStorage = [];
            let storingStructures = {};

            storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) test = container.push(Game.getObjectById(structure.id));
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) test = storage.push(Game.getObjectById(structure.id));
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.spawn;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) test = spawn.push(Game.getObjectById(structure.id));
            });

            if(container.length !== 0){
                target = container;
            } else if(spawn.length !== 0){
                target = spawn;
            } else if(storage.length !== 0) {
                target = storage;
            }
            
            nearestStorage = creep.pos.findClosestByPath(target);

            if (creep.transfer(nearestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestStorage);
            }
        }
	}
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role RepairDrone
 * 
 * Fonctionnement: 
 * Le 'RepairDrone' récuperrera de l'énergie du stockage (hors spawns et extensions) le plus proche afin
 * de reparer les batiments de la liste 'FileDeReparation'. Cette liste sera générée (avec priorités)
 * dans le module de scan et enregistrée en mémoire.
 * 
 */

var roleRepairDrone = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //bascule entre mode réparation et récupération de ressources
        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.repairing = false;
        } else if(!creep.memory.building){
            creep.memory.repairing = true;
        }

        //if{..} -> mode réparation
        //else{...} -> mode récupération de ressources
	    if(creep.memory.repairing) {

            let target = [];
            let listHP = [];
            let listMP = [];
            let listBP = [];
            
            let hautePrio = Memory.FileDeReparation.HautePriorité;
            let moyennePrio = Memory.FileDeReparation.MoyennePriorité;
            let bassePrio = Memory.FileDeReparation.BassePriorité;

            _.forEach(hautePrio, (structure) =>{
                listHP.push(structure.id);
            });
            _.forEach(moyennePrio, (structure) =>{
                listMP.push(structure.id);
            });
            _.forEach(bassePrio, (structure) =>{
                listBP.push(structure.id);
            });

            if(listHP.length !== 0){
                target = Game.getObjectById(listHP[0]);
            } else if(listMP.length !== 0){
                target = Game.getObjectById(listMP[0]);
            } else if(listBP.length !== 0) {
                target = Game.getObjectById(listBP[0]);
            }

            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

	    } else {
            
            let container = [];
            let storage = [];
            let nearestStorage = [];
            let roomStorageStructure = [];

            storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy >= creep.store.getCapacity()) test = container.push(Game.getObjectById(structure.id));
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy > 0) test = storage.push(Game.getObjectById(structure.id));
            });

            if(storage.length !== 0){
                roomStorageStructure = storage;
            } else if(container.length !== 0) {
                roomStorageStructure = container;
            }

            nearestStorage = creep.pos.findClosestByPath(roomStorageStructure, {
                filter: (structure) => {return (structure.store.getFreeCapacity(RESOURCE_ENERGY) != structure.store.getCapacity(RESOURCE_ENERGY))}
            });
            
            if (creep.withdraw(nearestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestStorage);
            }   
        }
	}
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role Carrier
 * 
 * Fonctionnement: 
 * Le 'Carrier' transportera l'énergie des 'conteiner' autour d'une source vers un autre stockage.
 * En priorité, il déposera dans un 'spawner' ou une 'extension', si ces derniers sont pleins
 * il viendra déposer dans un 'storage' libre. 
 * 
 */

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let nearestStorage = [];
        let roomStorageStructure = [];
        let storingStructures = {};
        let nearestTarget = {};
        
        //bascule entre mode tranport et récupération de ressources
        if(creep.store[RESOURCE_ENERGY] === 0){
            creep.memory.transporting = false;
        } else if(!creep.memory.transporting){
            creep.memory.transporting = true;
        }

        //if{..} -> mode tranport
        //else{...} -> mode récupération de ressources
        if(creep.memory.transporting){

            //if(!creep.memory.transportingTo) creep.memory.transportingTo = {};

            if(_.isEmpty(creep.memory.transportingTo)){

                let container = [];
                let storage = [];
                let spawn = [];
                let extension = [];
                let tower = [];

                let target = [];

                storingStructures = Memory.Rooms[creep.room.name].Structures.spawn;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity) test = spawn.push(Game.getObjectById(structure.id));
                });

                storingStructures = Memory.Rooms[creep.room.name].Structures.extension;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity) test = extension.push(Game.getObjectById(structure.id));
                });

                storingStructures = Memory.Rooms[creep.room.name].Structures.tower;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity * 0.80) test = tower.push(Game.getObjectById(structure.id));
                });

                storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity) test = storage.push(Game.getObjectById(structure.id));
                });

                if(tower.length !==0) {
                    target = tower;
                } else if(extension.length !==0) {
                    target = extension;
                } else if(spawn.length !== 0) {
                    target = spawn;
                } else if((storage.length !==0) && (container.length === 0)) {
                    target = storage;
                }

                nearestTarget = creep.pos.findClosestByPath(target);
                creep.memory.transportingTo = nearestTarget.id
                
            } else {

                nearestTarget = Game.getObjectById(creep.memory.transportingTo);

                if (creep.transfer(nearestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestTarget);
                } else {
                    creep.memory.transportingTo = {};
                }

            }

        } else {

            let container = [];
            let storage = [];

            storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy >= creep.store.getCapacity()) test = container.push(Game.getObjectById(structure.id));
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy > 0) test = storage.push(Game.getObjectById(structure.id));
            });

            if(container.length !== 0){
                roomStorageStructure = container;
            } else if(storage.length !== 0) {
                roomStorageStructure = storage;
            }

            nearestStorage = creep.pos.findClosestByPath(roomStorageStructure, {
                filter: (structure) => {return (structure.store.getFreeCapacity(RESOURCE_ENERGY) != structure.store.getCapacity(RESOURCE_ENERGY))}
            });
            
            if (creep.withdraw(nearestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestStorage);
            } 
        }
    }
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role Scout
 * 
 * Fonctionnement: 
 * Le 'Carrier' transportera l'énergie des 'conteiner' autour d'une source vers un autre stockage.
 * En priorité, il déposera dans un 'spawner' ou une 'extension', si ces derniers sont pleins
 * il viendra déposer dans un 'storage' libre. 
 * 
 */

var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //bascule entre mode scouting et attente
        //console.log(JSON.stringify(creep.pos));
        //console.log(JSON.stringify(Memory.Flags['scout'].pos));
        if(creep.pos === Game.flags['distantRoom 1'].pos){
            creep.memory.scouting = false;
        } else {
            creep.memory.scouting = true;
            
        }

        //console.log('creep.memory.scouting: ' + creep.memory.scouting);

        //if{..} -> mode scouting
        //else{...} -> mode attente
        if(creep.memory.scouting){

            creep.moveTo(Game.flags['distantRoom 1']);

            //console.log('scouting');

            
        } else {

            //console.log('not scouting');

        }
    }
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role Transporter
 * 
 * Fonctionnement: 
 * Le 'Transporter' transportera l'énergie des mineurs de sources externes jusqu'au 'link' de la 'Base'. 
 * 
 */

var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let nearestStorage = [];
        let roomStorageStructure = [];
        let storingStructures = {};
        let nearestTarget = {};
        
        //bascule entre mode tranport et récupération de ressources
        if(creep.store[RESOURCE_ENERGY] === 0){
            creep.memory.transporting = false;
        } else if(!creep.memory.transporting){
            creep.memory.transporting = true;
        }

        //if{..} -> mode tranport
        //else{...} -> mode récupération de ressources
        if(creep.memory.transporting){

            //if(!creep.memory.transportingTo) creep.memory.transportingTo = {};

            if(_.isEmpty(creep.memory.transportingTo)){

                let container = [];
                let storage = [];
                let spawn = [];
                let extension = [];
                let tower = [];

                let target = [];

                storingStructures = Memory.Rooms[creep.room.name].Structures.spawn;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity) test = spawn.push(Game.getObjectById(structure.id));
                });

                storingStructures = Memory.Rooms[creep.room.name].Structures.extension;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity) test = extension.push(Game.getObjectById(structure.id));
                });

                storingStructures = Memory.Rooms[creep.room.name].Structures.tower;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity * 0.80) test = tower.push(Game.getObjectById(structure.id));
                });

                storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
                _.forEach(storingStructures, (structure) =>{
                    if(structure.storedEnergy < structure.maxCapacity) test = storage.push(Game.getObjectById(structure.id));
                });

                if(tower.length !==0) {
                    target = tower;
                } else if(extension.length !==0) {
                    target = extension;
                } else if(spawn.length !== 0) {
                    target = spawn;
                } else if((storage.length !==0) && (container.length === 0)) {
                    target = storage;
                }

                nearestTarget = creep.pos.findClosestByPath(target);
                creep.memory.transportingTo = nearestTarget.id;

            } else {
                nearestTarget = Game.getObjectById(creep.memory.transportingTo);
                if (creep.transfer(nearestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestTarget);
                } else {
                    creep.memory.transportingTo = {};
                }
            }

        } else {

            let container = [];
            let storage = [];

            storingStructures = Memory.Rooms[creep.room.name].Structures.container;

            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy >= creep.store.getCapacity()) test = container.push(Game.getObjectById(structure.id));
            });
            storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy > 0) test = storage.push(Game.getObjectById(structure.id));
            });
            if(container.length !== 0){
                roomStorageStructure = container;
            } else if(storage.length !== 0) {
                roomStorageStructure = storage;
            }

            nearestStorage = creep.pos.findClosestByPath(roomStorageStructure, {
                filter: (structure) => {return (structure.store.getFreeCapacity(RESOURCE_ENERGY) != structure.store.getCapacity(RESOURCE_ENERGY))}
            });
            
            if (creep.withdraw(nearestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestStorage);
            } 
        }
    }
};

/*---------------------------------------------------------------------------------------------------------------------------------*/
/*
 * Role DistantHarvester
 * 
 * Fonctionnement: 
 * Le 'Harvester' minera de l'énergie d'une source puis viendra la transferer dans un stockage. Un 'container' sera placé en fonction
 * du nombre de place libre autour d'une source. Chaque 'Harvester' s'affectera à une place libre afin de miner. 
 * 
 */

var roleDistantHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let target = [];
        let harvestedSource = {};

        if(creep.ticksToLive <= 5) {
            Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = false;
            creep.suicide();
        } 

        //if{...} -> mode minage de ressources
        //else{...} -> mode tranfert de ressources
        if(creep.store[RESOURCE_ENERGY] !== creep.store.getCapacity()){
            if(!creep.memory.workingOn) {
                let sourcesList = Memory.Rooms[creep.room.name].Sources;
                _.forEach(sourcesList, (source) =>{
                    if(!source.mined) {
                        harvestedSource = Game.getObjectById(source.id);
                        return false;
                    }
                });
                creep.memory.workingOn = harvestedSource.id;
                if (typeof Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined !== 'undefined' ||
                        Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined  === null) {
                    Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = true;
                } else {
                    Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = null;
                    Memory.Rooms[creep.room.name].Sources[creep.memory.workingOn].mined = true;
                }
            }
            creep.memory.harvesting = true;
        } else if(creep.memory.harvesting){
            creep.memory.harvesting = false;
        }

        //if{...} -> mode minage de ressources
        //else{...} -> mode transfert de ressources
	    if (creep.memory.harvesting) {
            harvestedSource = Game.getObjectById(creep.memory.workingOn);
            if (creep.harvest(harvestedSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(harvestedSource);
            }
        } else {
            
            let container = [];
            let storage = [];
            let spawn = [];

            let nearestStorage = [];
            let storingStructures = {};

            storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) test = container.push(Game.getObjectById(structure.id));
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) test = storage.push(Game.getObjectById(structure.id));
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.spawn;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) test = spawn.push(Game.getObjectById(structure.id));
            });

            if(container.length !== 0){
                target = container;
            } else if(spawn.length !== 0){
                target = spawn;
            } else if(storage.length !== 0) {
                target = storage;
            }
            
            nearestStorage = creep.pos.findClosestByPath(target);

            if (creep.transfer(nearestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestStorage);
            }
        }
	}
};

module.exports = roles;