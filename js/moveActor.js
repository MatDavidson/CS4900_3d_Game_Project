import { characterRadius } from './highlights.js';
import { actors, charactersArray } from '../main.js';

var down = false;
let unit = 17 / 16;
let increment = unit / 60;

function keyMove(key, actor, obstacles) {
    console.log(actor.actor.moveLeft);
    let job = actor.actor;
    //console.log(actors.indexOf(actor));

    while (job.moveLeft > 0) {
        if (down)
            return;

        down = true;

        let xChange = 0;
        let yChange = 0;

        let currentPos = actor.position;
        let endPos = actor.position;

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

        job.inTransit = true;
        job.destination = endPos;

        job.move(job.xPos + xChange, job.yPos + yChange);
        job.moveLeft -= 1;
        characterRadius(actor.scene, job.xPos, job.yPos, job.moveLeft)
        moveActor(actor, currentPos, endPos);

        console.log(job.name + " - (" + job.xPos + "," + job.yPos + ")");
    }

    console.log(job.moveLeft);
    if (job.movement == 0)
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
    if (currentPos == endPos) {
        actor.actor.inTransit = false;
        actor.actor.destinatin = null;
        actor.bBox.setFromObject(actor);
        return;
    }

    let xDir = 0;
    if (currentPos.x > endPos.x)
        xDir = 1;

    let xDiff = 0;
    if (currentPos.x != endPos.x)
        xDiff = 1;

    let yDir = 0;
    if (currentPos.z > endPos.z)
        yDir = 1;

    let yDiff = 0;
    if (currentPos.z != endPos.z)
        yDiff = 1;

    actor.position.set(currentPos.x + Math.pow(-1, xDir) * increment * xDiff, currentPos.y, currentPos.z + Math.pow(-1, zDir) * increment * zDiff);
}

// Changes the seleceted character for the player
function changeCharacter(characterCount) {
    if (characterCount < 4)
        characterCount++;
    else
        characterCount = 0;

    return charactersArray[characterCount];
}

export { keyMove, moveActor, changeCharacter, keyLifted };