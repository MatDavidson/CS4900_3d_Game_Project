
import { moveRadius, clearCharRadius, clearEnemyRadius, clearSelectedHighlight, addSelectedHighlight } from './highlights.js';
import { actors, charactersArray, changeCharacter, scene } from '../main.js';
import { isOccupied } from './layer1.js';
import { placeObject } from './gameBoard.js';

var down = false;
let unit = 17 / 16;
let increment = unit / 30;
var north = 2*Math.PI;
var south = Math.PI;
var east = 1.5*Math.PI;
var west = .5*Math.PI;
var caster = new THREE.Raycaster(new THREE.Vector3(0,0,0), down); 

function keyMove(key, actor, obstacles) {
    console.log(actor.actor.moveLeft);
    let job = actor.actor;
    //console.log(actors.indexOf(actor));

    if(job.moveLeft > 0) {
    //while(job.moveLeft > 0){
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

        clearCharRadius(scene);
        clearSelectedHighlight(scene, actor);
        job.moveDelay = 30;
        job.inTransit = true;
        let action = actor.mixer.clipAction( actor.animations[9]); //Walk
        actor.action = action;
        action.play();
        job.destination = endPos;

        console.log(endPos);

        obstacles[job.yPos][job.xPos] = 0;
        job.move(job.xPos + xChange, job.yPos + yChange);
        //findHeight(actor);
        obstacles[job.yPos][job.xPos] = 2;
        job.moveLeft -= 1;
        moveRadius(actor.scene, actor, obstacles)
        addSelectedHighlight(scene, actor);

        //moveActor(actor, currentPos, endPos);

        console.log(job.name + " - (" + job.xPos + "," + job.yPos + ")");
    }

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
        //console.log(actor);
        actor.bBox.setFromObject(actor);
        if (actor.actor.moveLeft == 0 && actor.actor.hasAttacked){
            changeCharacter(charactersArray.indexOf(actor));
        }
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

function findHeight(actor){
    let x = actor.actor.xPos;
    let y = actor.actor.yPos;
    let floor = scene.getObjectByName("floorMesh");
    let dummy = scene.getObjectByName("dummy");

    placeObject(dummy, x, y, 17);
    console.log("Dummy Box Position: " + x + "," + y);
    
    //place the raycaster at the same location as the model
    caster.set(new THREE.Vector3(dummy.position), down);
    let intersects = caster.intersectObjects(scene.children);
    
    let height = 0;
    while(intersects.length < 1){
        caster.set(dummy.position, down);
        dummy.position.y += .05;
        height += 0.05;
        intersects = caster.intersectObjects(scene.children);
    }
}

export { keyMove, moveActor, keyLifted };
