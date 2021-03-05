/*
 * Module de gestion des taches
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


var taskManager = {

    run: function() {

        buildingTask.run();
    }
}


var buildingTask = {

    run: function() {
        
        let constructionFile = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
        Memory.buildTask = {TaskName: constructionFile.id};
        
        //for()
        
        //let Memory.buildingTask = {memory: {ID: ''}};

        

    }
}

module.exports = taskManager;