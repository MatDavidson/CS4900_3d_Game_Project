import { boardGen } from './js/gameBoard.js';
import { createCamera, addCameraControls } from './js/camera.js';
import { createModels } from './js/modelMaker.js';
// import { keyLifted, movePlayer, changeCharacter, } from './js/objectGeneration.js';
import { HeightMap, VanillaRandomHeightMap } from './js/heightMap.js';
// import {Melee, Defender, Ranged} from './js/actors.js';
import { addButtons, onEndTurnClick } from './js/HUD.js';
import { keyMove, keyLifted, moveActor } from './js/moveActor.js';
import { moveRadius, characterRadius, clearRadius } from './js/highlights.js';
// import { CSS2DRenderer, CSS2DObject } from './js/CSS2DRenderer.js';


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




//create title screen scene
// var planeGeometry = new THREE.PlaneGeometry(50, 50);
// var planeTexture = new THREE.TextureLoader().load('textures/rabbit-9.jpg');
// var planeMaterial = new THREE.MeshBasicMaterial({ map: planeTexture });
// planeMaterial.side = THREE.DoubleSide;
// var titlePlane = new THREE.Mesh(planeGeometry, planeMaterial);
// titlePlane.position.set(-1, 1.5, -3.75);
// //var rotateVector = new THREE.Vector3(-1, 0, -1);
// //titlePlane.rotateOnWorldAxis(rotateVector, Math.PI);
// // titlePlane.rotateZ = 2 * Math.PI;
// titlePlane.lookAt(camera.position);

//blocked for merging
//scene.add( titlePlane );

scene.add(camera);
//removed for title screen plane - readded for merging
var controls = addCameraControls(camera, renderer);

//loadCat();

var meleeBox;
var rangedBox;
var defenderBox;

const mapTopZ = 7.5;
const mapRightX = -7.5;
const mapBottomZ = -7.5;
const mapLeftX = 7.5;

//var manager = new THREE.LoadingManager();
//var characterCount = 0;

//var managerEnemies = new THREE.LoadingManager();
//var enemyCount = 0;

var charactersArray = [];
var enemiesArray = [];

var boundingBoxArray = [];
var boxHelperMelee;
var boxHelperRanged;
var boxHelperDefender;

boundingBoxArray.push(boxHelperMelee, boxHelperRanged, boxHelperDefender);

var clock = new THREE.Clock();
const manager = new THREE.LoadingManager();
manager.onLoad = init;
var mixers = []; //hold all animation mixers
var actors = []; //hold all models
var bBoxes = []; //hold all bounding boxes

//grab button functionality
//addTitle();

//var labelRenderer;

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

//console.log(currentActor);
// var playerDiv = document.createElement('div');
// playerDiv.className = 'label';

function init() {
    populateArrays(actors, charactersArray, enemiesArray);
    currentActor = charactersArray[0];
    currentEnemy = enemiesArray[0];
    //console.log(currentActor);

    //trying to add health labels above characters
    // playerDiv.textContent = "";
    // playerDiv.textContent = currentActor.actor.hitPts;
    // var playerLabel = new THREE.CSS2DObject(  );
    // playerLabel.position.set( 0, 1, 0 );
    // currentActor.add( playerLabel );

    // labelRenderer = new THREE.CSS2DRenderer();
    // labelRenderer.setSize( window.innerWidth, window.innerHeight );
    // labelRenderer.domElement.style.position = 'absolute';
    // labelRenderer.domElement.style.top = '0px';
    // document.body.appendChild( labelRenderer.domElement );


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

//maybe this will help? https://discourse.threejs.org/t/2d-plots-overlayed-on-3d-scene/172
// using sprites causes issues relating to the raycaster - on hold
// var spriteMap = new THREE.TextureLoader().load('./textures/rabbit-9.jpg');
// var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });

// var sprite = new THREE.Sprite(spriteMaterial);
// scene.add(sprite);

//Check this example for reference: https://threejs.org/examples/#webgl_interactive_lines
//event handler when clicking an enemy to attack (or possibly a teammate to heal?)
document.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(event) {
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
                currentActor = bBoxes[i].model;
                //break;
            }
            else {
                currentEnemy = bBoxes[i].model;
                //break;
            }
        }
    }
     console.log(currentEnemy);
     console.log(currentActor);

}

function animate() {
    //update bounding boxes
    //updateBoundingBoxes();
    requestAnimationFrame(animate);
    if (currentActor.actor.inTransit === true) {
        moveActor(currentActor, currentActor.actor.source, currentActor.actor.destination);
        console.log("Moving...");
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

    renderer.render(scene, camera);
    //labelRenderer.render( scene, camera );

}


//IN PROGRESS - called within the animate function to update bounding box locations
function updateBoundingBoxes() {
    //console.log(charactersArray[0].name);
    //console.log(boundingBoxArray);
    // if(charactersArray[0].name === "melee"){
    //     boundingBoxArray[0].setFromObject(scene.getObjectByName("melee"));
    // }
    // for(var i = 0; i < 3; i++){
    //     if(charactersArray[i].name === "melee")  //doesn't recognize it within the for loop
    //     ;
    //         //meleeBox.copy( scene.getObjectByName("melee").boundingBox ).applyMatrix4( mesh.matrixWorld );

    // }

}

// Changes the seleceted character for the player
function changeCharacter(characterCount) {
    if (characterCount < 4)
        characterCount++;
    else
        characterCount = 0;
    clearRadius(scene);
    currentActor = charactersArray[characterCount];
    moveRadius(scene, currentActor, obstacles);
}

export {
    scene, changeCharacter
    , charactersArray, enemiesArray,
    currentActor,
    currentEnemy,
    mapTopZ,
    mapRightX,
    mapBottomZ,
    mapLeftX,
    //controls
    actors
};