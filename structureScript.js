var towerScript = {

    run: function() {

        let target = [];
        let listHP = [];
        let listMP = [];
        let listBP = [];

        let towerStructures = {};

        let rooms = Game.rooms;
        
        _.forEach(rooms, (room) =>{
            
            if(typeof Memory.Rooms[room.name].Structures.tower !== 'undefined' && Memory.Rooms[room.name].Structures.tower !== 'null' ){

                towerStructures = Memory.Rooms[room.name].Structures.tower;

                let creeps = Game.rooms[room.name].find(FIND_HOSTILE_CREEPS);
                if(creeps.length !== 0) {
                    _.forEach(creeps, (creep) =>{            
                        _.forEach(towerStructures, (structure) =>{
                            Game.getObjectById(structure.id).attack(creep);
                        });
                    }); 
                } else {

                    let hautePrio = Memory.FileDeReparation.HautePriorité;
                    let moyennePrio = Memory.FileDeReparation.MoyennePriorité;
                    let bassePrio = Memory.FileDeReparation.BassePriorité;

                    let list = {};

                    _.forEach(hautePrio, (structure) =>{
                        listHP.push(structure.id);
                    });
                    _.forEach(moyennePrio, (structure) =>{
                        listMP.push(structure.id);
                    });
                    _.forEach(bassePrio, (structure) =>{
                        listBP.push(structure.id);
                    });

                    if(listHP.length === 0){
                        list = listHP;
                    } else if(listMP.length !== 0){
                        list = listMP;
                    } else if(listBP.length === 0) {
                        list = listBP;
                    }

                    _.forEach(towerStructures, (structure) =>{
                        for(let index = 0; index < list.length; index++){
                            if(Game.getObjectById(list[index]).pos.roomName === structure.pos.roomName){
                                target = Game.getObjectById(list[index]);
                                break;
                            }
                        }
                        if(structure.storedEnergy > (structure.maxCapacity/2)) Game.getObjectById(structure.id).repair(target);
                    });
                }
            }
            
        });
    }
}

module.exports = towerScript;