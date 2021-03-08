/*
 * Module de gestion de roles
 * 
 * Rôles actifs:
 *  - Builder : construire aux site de construction en prenant l'energie du stockage
 *  - Upgrader : améliorer le controler en prenant l'energie du stockage
 *  - Harvester : récuperer de l'energie depuis une source et l'amener dans un stockage
 * 
 * Rôles à venir:
 *  - Carrier : transportera les ressources de stockages en stockages ainsi que de recharger les tourelles
 *  - Repairer : réparera les structures endommagées
 *  - Worker : Incluera les rôles 'Builder', 'Upgrader', 'Harvester', 'Carrier', 'Repairer'
 *  - Soldier :
 *      - Infantry : haute défense, dps moyen, corps à corps, capacité de détruire les batiments
 *      - Artillery : basse défense, haut dps, à distance
 *      - Medic : défense moyenne, dps faible, hybride, capacité de soigné
 *  - Scout : scannera les salles pour récuperer de l'information
 *  - Colon : agira en tant que stockage mobile, permettra de construire une colonie rapidement
 * 
 */

var roles = {
    run: function() {

        //let Memory.buildingTask = Game.room.find(FIND_CONSTRUCTION_SITES);

        if (Memory.roles == null){
            Memory.roles = ['harvester', 'builder', 'upgrader', 'repairer'];
        }
        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            //let CPU = Game.cpu.getUsed();
            switch(creep.memory.role){
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    Game.cpu.getUsed();
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepairDrone.run(creep);
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
 * de construire les batiments de la liste 'BuildingTask'. Cette liste sera générée (avec priorités)
 * dans le module de gestion de taches.
 * 
 */

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //création de la liste de construction
        let buildingTask = creep.room.find(FIND_CONSTRUCTION_SITES);

        //bascule entre mode construction et récupération de ressources
        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.building = false;
        } else if(!creep.memory.building){
            creep.memory.building = true;
        }

        //if{..} -> mode construction
        //else{...} -> mode récupération de ressources
	    if(creep.memory.building) {

            let target = {};
            let listHP = [];
            let listMP = [];
            let listBP = [];
            let hautePrio = Memory.Rooms[creep.room.name].FileDeConstruction.HautePriorité;
            let moyennePrio = Memory.Rooms[creep.room.name].FileDeConstruction.MoyennePriorité;
            let bassePrio = Memory.Rooms[creep.room.name].FileDeConstruction.BassePriorité;

            _.forEach(hautePrio, (structure) =>{
                listHP.push(structure.id);
            });
            _.forEach(moyennePrio, (structure) =>{
                listMP.push(structure.id);
            });
            _.forEach(bassePrio, (structure) =>{
                listBP.push(structure.id);
            });

            if(listHP == []){
                target = Game.getObjectById(listHP[0]);
	        } else if(listMP !== []){
                target = Game.getObjectById(listMP[0]);
            } else if(listBP !== []){
                target = Game.getObjectById(listBP[0]);
            }
;
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            
	    } else {
            let container = {};
            let storage = {};
            let nearestStorage = {};
            let roomStorageStructure = {};
            let storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure,index) =>{
                container[index] = Game.getObjectById(structure.id);
            });
            if(storage === {}){
                roomStorageStructure = container;
            } else {
                roomStorageStructure = Object.assign(container, storage);
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
 * Role Upgrader
 * 
 * Fonctionnement: 
 * Le 'Upgrader' récuperrera de l'énergie du stockage (hors spawns et extensions) le plus proche afin
 * d'améliorer le controleur de sa salle. Il sera attribué une salle, on cherche à avoir à minima un
 * 'Upgrader par salle.
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
            let container = {};
            let storage = {};
            let nearestStorage = {};
            let roomStorageStructure = {};
            let storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure,index) =>{
                container[index] = Game.getObjectById(structure.id);
            });
            if(storage === {}){
                roomStorageStructure = container;
            } else {
                roomStorageStructure = Object.assign(container, storage);
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
 * Le 'Harvester' minera de l'énergie d'une source puis viendra la transferer dans un stockage.
 * En priorité, il déposera dans un 'Spawner' ou une 'Extension', si ces derniers sont pleins
 * il viendra déposer dans un 'Container' ou 'Storage' libre. 
 * 
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let target = {};

        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.harvesting = true;
        } else if(!creep.memory.building){
            creep.memory.harvesting = false;
        }

        console.log("Memory.Sources : " + JSON.stringify(Memory.Rooms[creep.room.name].Sources))

        //if{..} -> mode minage de ressources
        //else{...} -> mode transfert de ressources
	    if (creep.memory.harvesting) {
            let sourcesList = Memory.Rooms[creep.room.name].Sources; // BUG ICI
            
            _.forEach(sourcesList, (source) =>{
                if(source.nbMineur < source.nbMineurMax) {
                    target = Game.getObjectById(source.id);
                    source.nbMineur = source.nbMineur + 1;
                    return false;
                }
            });
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {

            let storageAndContainer = [];
            let spawnAndExtension = [];
            let nearestStorage = {};
            let storingStructures = {};

            //console.log(JSON.stringify(Memory.Rooms[creep.room].Structures));

            storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) storageAndContainer.push(structure.id);
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.storage;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) storageAndContainer.push(structure.id);
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.spawn;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) spawnAndExtension.push(structure.id);
            });

            storingStructures = Memory.Rooms[creep.room.name].Structures.extension;
            _.forEach(storingStructures, (structure) =>{
                if(structure.storedEnergy < structure.maxCapacity) spawnAndExtension.push(structure.id);
            });

            if(spawnAndExtension !== []){
                target = spawnAndExtension;
            } else {
                target = storageAndContainer;
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
 * de construire les batiments de la liste 'BuildingTask'. Cette liste sera générée (avec priorités)
 * dans le module de gestion de taches.
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

            let target = {};
            let listHP = [];
            let listMP = [];
            let listBP = [];
            let hautePrio = Memory.Rooms[creep.room.name].FileDeReparation.HautePriorité;
            let moyennePrio = Memory.Rooms[creep.room.name].FileDeReparation.MoyennePriorité;
            let bassePrio = Memory.Rooms[creep.room.name].FileDeReparation.BassePriorité;

            _.forEach(hautePrio, (structure) =>{
                listHP.push(structure.id);
            });
            _.forEach(moyennePrio, (structure) =>{
                listMP.push(structure.id);
            });
            _.forEach(bassePrio, (structure) =>{
                listBP.push(structure.id);
            });

            if(listHP === []){
                target = Game.getObjectById(listHP[0]);
	        } else if(listMP === []){
                target = Game.getObjectById(listMP[0]);
            } else if(listBP !== []){
                target = Game.getObjectById(listBP[0]);
            }

            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

	    } else {
            let container = {};
            let storage = {};
            let nearestStorage = {};
            let roomStorageStructure = {};
            let storingStructures = Memory.Rooms[creep.room.name].Structures.container;
            _.forEach(storingStructures, (structure,index) =>{
                container[index] = Game.getObjectById(structure.id);
            });
            if(storage === {}){
                roomStorageStructure = container;
            } else {
                roomStorageStructure = Object.assign(container, storage);
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

module.exports = roles;