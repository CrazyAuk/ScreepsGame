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
        if (Memory.roles == null){
            Memory.roles = ['harvester', 'builder', 'upgrader'];
        }
        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
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
            }
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
	        creep.say('🚧 build');
            let target = buildingTask[0];
            if(target != null) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
	        }
	    } else {
            creep.say('🔄 pickup');
            let roomStorageStructure = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_CONTAINER) && 
                        (structure.store.getFreeCapacity(RESOURCE_ENERGY) != structure.store.getCapacity(RESOURCE_ENERGY)) ;
                }
            });
            if (roomStorageStructure != null) {
                let nearestStorage = creep.pos.findClosestByPath(roomStorageStructure);
                if (creep.withdraw(nearestStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestStorage, {visualizePathStyle: {stroke: '#ffffff'}});
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
	        creep.say('🚧 upgrade');
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    } else {
            creep.say('🔄 pickup');
            let roomStorageStructure = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_CONTAINER) && 
                        (structure.store.getFreeCapacity(RESOURCE_ENERGY) != structure.store.getCapacity(RESOURCE_ENERGY)) ;
                }
            });
            if (roomStorageStructure != null) {
                let nearestStorage = creep.pos.findClosestByPath(roomStorageStructure);
                if (creep.withdraw(nearestStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestStorage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
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

        let targets = null;

        //if{..} -> mode minage de ressources
        //else{...} -> mode transfert de ressources
	    if (creep.store.getFreeCapacity() > 0) {
            creep.say('⚡ harvest');
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            //si aucun 'Spawn' et aucune 'Extension' ne sont pas plein(e)
            if(targets.length == 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE ||
                                structure.structureType == STRUCTURE_CONTAINER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }
            if (targets.length > 0) {
                creep.say('🔄 tranfer');
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

/*---------------------------------------------------------------------------------------------------------------------------------*/

module.exports = roles;