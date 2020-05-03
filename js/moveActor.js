
import { moveRadius, clearRadius } from './highlights.js';
import { actors, charactersArray, scene } from '../main.js';
import { isOccupied } from './layer1.js';

var down = false;
let unit = 17 / 16;
let increment = unit / 30;
var north = 2*Math.PI;
var south = Math.PI;
var east = 1.5*Math.PI;
var west = .5*Math.PI;

function keyMove(key, actor, obstacles) {
    console.log(actor.actor.moveLeft);
    let job = actor.actor;
    //console.log(actors.indexOf(actor));

    if(job.moveLeft > 0) {
        if (down || job.inTransit == true)
            return;

        down = true;

        let xChange = 0;
        let yChange = 0;

        job.source = new THREE.Vector3(actor.position);
        let endPos = new THREE.Vector3(actor.position);
        console.log(job.source);

        //Determine which direction to move
        switch (key) {
            case 'w':
                endPos.z = endPos.z + unit;
                yChange = 1;
                actor.rotation.y = north;
                break;
            case 'a':
                endPos.x = endPos.x + unit;
                xChange = 1;
                actor.rotation.y = west;
                break;
            case 's':
                endPos.z = endPos.z - unit;
                yChange = -1;
                actor.rotation.y = south;
                break;
            case 'd':
                endPos.x = endPos.x - unit;
                xChange = -1;
                actor.rotation.y = east;
                break;
        }

        if(job.xPos + xChange > 16 || job.xPos + xChange < 0 || job.yPos + yChange > 16 || job.yPos + yChange < 0)
            return;

        if(isOccupied(obstacles, job.yPos + yChange, job.xPos + xChange))
            return;

        clearRadius(scene);
        job.moveDelay = 30;
        job.inTransit = true;
        let action = actor.mixer.clipAction( actor.animations[9]); //Walk
        actor.action = action;
        action.play();
        job.destination = endPos;

        obstacles[job.yPos][job.xPos] = 0;
        job.move(job.xPos + xChange, job.yPos + yChange);
        obstacles[job.yPos][job.xPos] = 2;
        job.moveLeft -= 1;
        moveRadius(actor.scene, actor, obstacles)
        //moveActor(actor, currentPos, endPos);

        console.log(job.name + " - (" + job.xPos + "," + job.yPos + ")");
    }

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
        actor.action.stop();
        actor.action = actor.mixer.clipAction( actor.animations[1]); //Idle
        actor.action.play();
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
