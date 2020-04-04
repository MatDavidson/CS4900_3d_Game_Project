import { boardGen } from './gameBoard.js';
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
createModels(manager, scene, heightMap, obstacles, mixers);

function init(){
    for(let i = 0; i < obstacles.length;i++){
        console.log(obstacles[i].toString());
    }
    
    //playing with animations
    let model = scene.getObjectByName('model - 0 - 0');
    var action = model.mixer.clipAction( model.animations[0]);
    action.play();

    model = scene.getObjectByName('model - 0 - 1');
    action = model.mixer.clipAction( model.animations[9]);
    action.play();

    model = scene.getObjectByName('model - 0 - 2');
    action = model.mixer.clipAction( model.animations[3]);
    action.play();

    model = scene.getObjectByName('model - 0 - 3');
    action = model.mixer.clipAction( model.animations[4]); //Take damage
    action.play();

    model = scene.getObjectByName('model - 0 - 4');
    action = model.mixer.clipAction( model.animations[5]);
    action.play();

    animate1();
}

//add event listeners
//window.addEventListener('keypress', cameraRotation, false);
window.addEventListener('keypress', moveActor, false);
//call animate function

//animation loop
function animate1() {
    requestAnimationFrame(animate1);

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