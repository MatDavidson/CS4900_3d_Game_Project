import { boardGen } from './js/gameBoard.js';
import { createCamera, addCameraControls } from './js/camera.js';
import { createModels } from './js/modelMaker.js';
import { VanillaRandomHeightMap } from './js/heightMap.js';
import { addButtons, getCurrentHP } from './js/HUD.js';
import { keyMove, keyLifted, moveActor, pathMove } from './js/moveActor.js';
import { moveRadius, characterRadius, clearCharRadius, clearEnemyRadius, clearSelectedHighlight, addSelectedHighlight } from './js/highlights.js';
import { getPath } from './js/astar.js';
import { enemyTurn } from './js/enemies.js';

//set window size
var height = window.innerHeight;
var width = window.innerWidth;

//create renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.append(renderer.domElement);

//create scene
var scene = new THREE.Scene();
scene.background = new THREE.Color("#C0C0C0");

//Generate height map and obstacles array 
var heightMap = new VanillaRandomHeightMap(4).map;
let mapVerts = heightMap.length;
var obstacles = [...Array(mapVerts - 1)].map((_, i) => [...Array(mapVerts - 1)].map((_, i) => 0));
var highlights = [...Array(mapVerts - 1)].map((_, i) => [...Array(mapVerts - 1)].map((_, i) => null));
var nodes = [...Array(16)].map((_, i) => [...Array(16)].map((_, j) => null));
scene.nodes = nodes;
scene.highlights = highlights;
scene.obstacles = obstacles;

//call method from worldGeneration.js
boardGen(scene, heightMap, obstacles, highlights, nodes);

//changed camera for title plane adjustment - see camera.js
var camera = createCamera(width, height, renderer, scene);

scene.add(camera);
//removed for title screen plane - readded for merging
var controls = addCameraControls(camera, renderer);

//loadCat();

var charactersArray = [];
var enemiesArray = [];

var clock = new THREE.Clock();
const manager = new THREE.LoadingManager();
manager.onLoad = init;
var mixers = []; //hold all animation mixers
var actors = []; //hold all models
var bBoxes = []; //hold all bounding boxes

createModels(manager, scene, heightMap, obstacles, mixers, actors, bBoxes);

//function that places the player characters and enemy characters in the appropriate arrays
function populateArrays(actors, charactersArray, enemiesArray) {
    for (var i = 0; i < actors.length; i++) {
        if (actors[i].actor.name.includes("Enemy"))
            enemiesArray.push(actors[i]);
        else
            charactersArray.push(actors[i]);
    }
}

var currentActor;

var currentEnemy;
var selectHighlightEnemy;

function init() {
    populateArrays(actors, charactersArray, enemiesArray);
    currentActor = charactersArray[0];
    addSelectedHighlight(scene, currentActor);
    getCurrentHP(currentActor);

    currentEnemy = enemiesArray[0];
    addSelectedHighlight(scene, currentEnemy);

    addButtons(charactersArray, enemiesArray);

    moveRadius(scene, currentActor, obstacles);

    animate();
}

window.addEventListener('keypress', keySwitch, false);
window.addEventListener('keyup', keyLifted, false);

function keySwitch(event) {
    switch (event.key) {
        case 'w':
        case 'a':
        case 's':
        case 'd':            
            keyMove(event.key, currentActor, obstacles);
            break;
        //adding swap implementation
        case 'r':
            changeCharacter(charactersArray.indexOf(currentActor));
            //console.log(currentActor);
            break;
    }
}

var mouse = new THREE.Vector2();

var raycaster = new THREE.Raycaster();
//set the raycaster

//Check this example for reference: https://threejs.org/examples/#webgl_interactive_lines
//event handler when clicking an enemy to attack (or possibly a teammate to heal?)
document.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(event) {
    if(!playerTurn)
        return;

    event.preventDefault();

    raycaster.setFromCamera(mouse, camera);

    //set the mouse location to be accurate based on window size
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    //raycaster direction for testing
    //console.log(raycaster.ray.direction);

    //make the raycaster visible
    //scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000));

    //console.log(boundingBoxArray);

    //allows you to select a character to move them or an enemy to attack
    for (let i = 0; i < actors.length; i++) {
        if (raycaster.ray.intersectsBox(bBoxes[i])) {
            if (bBoxes[i].name.includes("Player")) {
                console.log(bBoxes[i].name);

                clearSelectedHighlight(scene, currentActor);
                currentActor = bBoxes[i].model;
                getCurrentHP(currentActor);
                clearCharRadius(scene);
                console.log(currentActor);
                moveRadius(scene, currentActor, obstacles);
                addSelectedHighlight(scene, currentActor);
            }
            else {
                clearEnemyRadius(scene);
                clearSelectedHighlight(scene, currentEnemy);
                currentEnemy = bBoxes[i].model;
                getCurrentHP(currentEnemy);
                addSelectedHighlight(scene, currentEnemy);

                if(!currentActor.actor.inTransit && currentActor.actor.path != null){
                    currentActor.actor.path = getPath(currentActor, currentEnemy.actor.xPos, currentEnemy.actor.yPos);

                    for(let i = 0; i < currentActor.actor.path.length; i++){
                        console.log("(" + currentActor.actor.path[i].yPos + "," + currentActor.actor.path[i].xPos);
                    }

                    pathMove(currentActor, currentActor.actor.path.pop(), obstacles, scene);
                }
            }
        }
    }
    console.log(currentEnemy);
    console.log(currentActor);    
}

//Some global game flags 
var playerTurn = true;

function animate() {
    //update bounding boxes
    //updateBoundingBoxes();
    requestAnimationFrame(animate);

    if(playerTurn){
        if(currentActor.actor.path != null){
            if(currentActor.actor.moveLeft>0 && currentActor.actor.path.length>0 && !currentActor.actor.inTransit)
                pathMove(currentActor, currentActor.actor.path.pop(), obstacles, scene);
            if(currentActor.actor.moveLeft == 0)
                currentActor.actor.path = null;
        }
        if (currentActor.actor.inTransit === true) {
            moveActor(currentActor, currentActor.actor.source, currentActor.actor.destination);
            console.log("Moving...");
        }
    }
    else{
        if(currentEnemy.actor.path != null){
            if(currentEnemy.actor.target != null && currentEnemy.actor.inRange(currentEnemy.actor.target.actor) && !currentEnemy.actor.inTransit){
                currentEnemy.actor.attack(currentEnemy.actor.target.actor);
                currentEnemy.actor.path = null;
                nextEnemy();
            }
            if(currentEnemy.actor.moveLeft>0 && currentEnemy.actor.path.length>0 && !currentEnemy.actor.inTransit)
                pathMove(currentEnemy, currentEnemy.actor.path.pop(), obstacles, scene);
            if(currentEnemy.actor.moveLeft == 0 && !currentEnemy.actor.inTransit){
                currentEnemy.actor.path = null;
                nextEnemy();
            }
        }
        if (currentEnemy.actor.inTransit === true) {
            moveActor(currentEnemy, currentEnemy.actor.source, currentEnemy.actor.destination);
            console.log("Moving...");
        }
    }
    // Rerenders the scene  
    render();

    //console.log(camera.position);
    controls.update();
}

function render() {

    var delta = clock.getDelta();

    for (const mixer of mixers) {
        mixer.update(delta);
    }

    for (const actor of actors) {
        actor.actor.update();
    }

    renderer.render(scene, camera);
    //labelRenderer.render( scene, camera );
}

// Changes the seleceted character for the player
function changeCharacter(characterCount) {
    console.log(characterCount);
    if (characterCount < charactersArray.length-1)
        characterCount++;
    else
        characterCount = 0;

    clearCharRadius(scene);
    clearSelectedHighlight(scene, currentActor);
    currentActor = charactersArray[characterCount];
    addSelectedHighlight(scene, currentActor);
    moveRadius(scene, currentActor, obstacles);

    getCurrentHP(currentActor);
}

function endPlayerTurn(){
    playerTurn = false;
    clearCharRadius(scene);
    clearSelectedHighlight(scene, currentActor);

    currentEnemy = enemiesArray[0];
    addSelectedHighlight(scene, currentEnemy);
    moveRadius(scene, currentEnemy, obstacles);
    enemyTurn(currentEnemy);
}

function nextEnemy(){
    let count = enemiesArray.indexOf(currentEnemy);
    if(count ==enemiesArray.length-1){
        playerTurn = true;
        for(let i = 0; i < enemiesArray.length; i++){
            enemiesArray[i].actor.moveLeft = enemiesArray[i].actor.movement;
        }
        clearCharRadius(scene);
        clearSelectedHighlight(scene, currentEnemy);
        changeCharacter(charactersArray.length);
    }
    else{
        clearCharRadius(scene);
        clearSelectedHighlight(scene, currentEnemy);
        currentEnemy = enemiesArray[enemiesArray.indexOf(currentEnemy) + 1];
        addSelectedHighlight(scene, currentEnemy);
        moveRadius(scene, currentEnemy, obstacles);
        enemyTurn(currentEnemy);
    }
}

function actorDefeated(actor){
    if (actor.actor.name.includes("Enemy"))
        enemiesArray.splice(enemiesArray.indexOf(actor));
    else{
        charactersArray.splice(charactersArray.indexOf(actor));
        for(let i = 0; i < enemiesArray.length; i++){
            if(enemiesArray[i].actor.target == actor)
                enemiesArray[i].actor.target = null;
        }
    }
    actors.splice(actors.indexOf(actor));
    let box = actor.bBox;
    bBoxes.splice(bBoxes.indexOf(box));

    scene.remove( actor);
    
}


export {
    scene, changeCharacter, charactersArray, enemiesArray, playerTurn,
    currentActor, obstacles,
    currentEnemy,
    //controls
    actors, endPlayerTurn, actorDefeated, nextEnemy
};