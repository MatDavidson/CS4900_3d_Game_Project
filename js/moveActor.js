var down;
let unit = 17/16;
let increment = unit/60;

function keyMove(key, actor, obstacles){
    if(down)
        return;
    down = true;

    let currentPos = actor.position;
    let endPos = actor.position;

    //Determine which direction to move
    switch(key){
        case 'w':
            endPos.z = endPos.z + unit;
            break;
        case 'a':
            endPos.x = endPos.x + unit;
            break;
        case 's':
            endPos.z = endPos.z - unit;
            break;
        case 'd':
            endPos.x = endPos.x - unit;
            break;
    }
    actor.actor.inTransit = true;
    actor.actor.destination = endPos;
    moveActor(actor, currentPos, endPos);
    
    down = false;
}

function moveActor(actor, currentPos, endPos){
    if(currentPos == endPos){
        actor.actor.inTransit = false;
        return;
    }

    let xDir = 0;
    if(currentPos.x > endPos.x)
        xDir = 1;

    let xDiff = 0;
    if(currentPos.x != endPos.x)
        xDiff = 1;

    let yDir = 0;
    if(currentPos.z > endPos.z)
        yDir = 1;

    let yDiff = 0;
    if(currentPos.z != endPos.z)
        yDiff = 1;

    actor.position.set(currentPos.x + Math.pow(-1, xDir)*increment*xDiff, currentPos.y, currentPos.z + Math.pow(-1, zDir)*increment*zDiff);
}
export{keyMove};