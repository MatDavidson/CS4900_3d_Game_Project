import { boardGen } from './gameBoard.js';
import {keyMove} from './moveActor.js';
import {createCamera, addCameraControls} from'./camera.js';
import {createModels } from './modelMaker.js';
import {HeightMap, VanillaRandomHeightMap} from './heightMap.js';
var height = window.innerHeight;
var width = window.innerWidth;
//create renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.append(renderer.domElement);

//create scene
var scene = new THREE.Scene;
scene.background = new THREE.Color("#C0C0C0");

//Generate height map and obstacles array 
var heightMap = new VanillaRandomHeightMap(4).map;
let mapVerts = heightMap.length;
var obstacles = [...Array(mapVerts-1)].map((_, i) => [...Array(mapVerts-1)].map((_, i) => 0));

//call method from worldGeneration.js
boardGen(scene, heightMap, obstacles);

//create camera and camera controls
var camera = createCamera(width, height, renderer, scene);
var controls = addCameraControls(camera, renderer);

var clock = new THREE.Clock();
const manager = new THREE.LoadingManager();
manager.onLoad = init;
var mixers = [];
var actors = [];
var currentActor;
createModels(manager, scene, heightMap, obstacles, mixers, actors);

function init(){
    for(let i = 0; i < obstacles.length;i++){
        console.log(obstacles[i].toString());
    }
    
    currentActor = actors[0];
    currentActor.actor.inTransit = false;
    animate1();
}

//add event listeners
//window.addEventListener('keypress', cameraRotation, false);
window.addEventListener('keypress', keySwitch, false);

function keySwitch(event){
    switch(event.key){
        case 'w':
        case 'a':
        case 's':
        case 'd':
            keyMove(event.key, currentActor, obstacles);
            break;
    }
}

//call animate function

//animation loop
function animate1() {
    requestAnimationFrame(animate1);
    currentActor.actor.update();
    // Rerenders the scene
    render();
    //update the controls
    controls.update();
}

function render() {

    var delta = clock.getDelta();

    for ( const mixer of mixers ) {
        mixer.update( delta );    
      }

    renderer.render( scene, camera );
}