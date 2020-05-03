
import { moveRadius, clearRadius } from './highlights.js';
import { actors, charactersArray, scene } from '../main.js';
import { placeObject } from './gameBoard.js';

var down = false;
let unit = 17 / 16;
let increment = unit / 20;

function keyMove(key, actor, obstacles) {
    console.log(actor.actor.moveLeft);
    let job = actor.actor;
    //console.log(actors.indexOf(actor));

    //while (job.moveLeft > 0) {
        if (down || job.inTransit == true)
            return;

        down = true;

        let xChange = 0;
        let yChange = 0;

        let currentPos = actor.position;
        job.source = new THREE.Vector3(actor.position);
        let endPos = new THREE.Vector3(actor.position);
        console.log(job.source);

        //Determine which direction to move
        switch (key) {
            case 'w':
                endPos.z = endPos.z + unit;
                yChange = 1;
                break;
            case 'a':
                endPos.x = endPos.x + unit;
                xChange = 1;
                break;
            case 's':
                endPos.z = endPos.z - unit;
                yChange = -1;
                break;
            case 'd':
                endPos.x = endPos.x - unit;
                xChange = -1;
                break;
        }

        clearRadius(scene);
        job.moveDelay = 20;
        job.inTransit = true;
        job.destination = endPos;

        job.move(job.xPos + xChange, job.yPos + yChange);
        job.moveLeft -= 1;
        moveRadius(actor.scene, actor, obstacles)
        //moveActor(actor, currentPos, endPos);

        console.log(job.name + " - (" + job.xPos + "," + job.yPos + ")");
    //}

    console.log(job.moveLeft);
    if (job.moveLeft == 0)
        actor = changeCharacter(actors.indexOf(actor));

    if (down)
        return;
}

//used when making sure one key press only performs one movement
function keyLifted() {
    down = false;
    return down;
}

function moveActor(actor, currentPos, endPos) {
    if (actor.actor.moveDelay < 1) {
        //actor.position.set(endPos.x, endPos.y, endPos.z);
        actor.actor.inTransit = false;
        
        actor.actor.destination = null;
        actor.bBox.setFromObject(actor);
        return;
    }

    let xDir = 1;
    if (currentPos.x < endPos.x)
        xDir = 0;

    let xDiff = 0;
    if (currentPos.x != endPos.x)
        xDiff = 1;

    let yDir = 0;
    if (currentPos.z > endPos.z)
        yDir = 1;

    let yDiff = 0;
    if (currentPos.z != endPos.z)
        yDiff = 1;
    actor.actor.moveDelay -= 1;
    actor.position.set(actor.position.x + Math.pow(-1, xDir) * (increment * xDiff), actor.position.y, actor.position.z + Math.pow(-1, yDir) * (increment * yDiff));

    if (actor.actor.moveDelay < 1) {
        console.log(actor.actor.source, actor.actor.destination)
        //placeObject(actor, actor.actor.xPos, actor.actor.yPos, 17)
    }
}

// Changes the seleceted character for the player
function changeCharacter(characterCount) {
    if (characterCount < 9)
        characterCount++;
    else
        characterCount = 0;

    return charactersArray[characterCount];
}

export { keyMove, moveActor, changeCharacter, keyLifted };
