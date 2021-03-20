/*
 * Module de construction automatique
 * 
 * Construction automatiques:
 *  - Road : entre source et 'storage' ou 'spawn'
 *  - Container : aux positions libres autour d'une 'source'
 * 
 * Construction automatiques à venir:
 *  - Tower : sera placée autour d'un flag 'defensePoint'
 *
 */

autoBuildRoad = function(room) {
        
    const terrain = new Room.Terrain(room.name);
    let positions = [];
    let spawn = [];
    let pathFinded = {};

    console.log("autobuild start");

    let sourcesList = Memory.Rooms[room.name].Sources;
    _.forEach(sourcesList, (source) =>{
        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                if((terrain.get(source.pos.x + x, source.pos.y + y)!=1) && !(x == 0 && y == 0)) {
                    positions.push(new RoomPosition(source.pos.x + x, source.pos.y + y, room.name));
                }
            }
        }
    });

    storingStructures = Memory.Rooms[room.name].Structures.spawn;
    _.forEach(storingStructures, (structure) =>{
        test = spawn.push(Game.getObjectById(structure.id));
    });

    _.forEach(positions, (pos) =>{
        pathFinded = PathFinder.search(pos, Game.getObjectById(spawn[0].id), {
            
            plainCost: 2,
            swampCost: 10,
      
            roomCallback: function() {
      
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
      
              return costs;
            },
        }
      );
    
        _.forEach(pathFinded, (pathObj) =>{
            for(let index = 0; index < pathObj.length - 1; index++) {
                if(pathObj[index].createConstructionSite(STRUCTURE_ROAD) !== OK) console.log('Cannot build on position x: ' + pathObj[index].x + ', y: ' + pathObj[index].y)
            }
        });
    });

    console.log("autobuild done"); 
}

//------------------------------------------------------------------------------------------------------------------------------------------

autoBuildContainer = function(room) {

    console.log("autobuild start");
        
    const terrain = new Room.Terrain(room.name);

    let pos = {} 

    let sourcesList = Memory.Rooms[room.name].Sources;
    _.forEach(sourcesList, (source) =>{
        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                if((terrain.get(source.pos.x + x, source.pos.y + y)!=1) && !(x == 0 && y == 0)) {
                    pos = new RoomPosition(source.pos.x + x, source.pos.y + y, room.name);
                    if(pos.createConstructionSite(STRUCTURE_CONTAINER) !== OK) console.log('Cannot build on position x: ' + (source.pos.x + x) + ', y: ' + (source.pos.y + y))
                }
            }
        }
    });
    console.log("autobuild done");
}

//------------------------------------------------------------------------------------------------------------------------------------------

module.exports = autoBuildRoad;
module.exports = autoBuildContainer;