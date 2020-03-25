import { boardGen, fillBoard, generateSkybox, characterRadius } from './js/gameBoard.js';
import {createCamera, addCameraControls} from'./js/camera.js';
import {createModels } from './js/modelMaker.js';
import { keyLifted, movePlayer, changeCharacter, } from './js/objectGeneration.js';
import {HeightMap} from './js/heightMap.js';
import {Melee, Defender, Ranged} from './js/actors.js';
import { addButtons, onEndTurnClick } from './js/HUD.js';

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

//Generate height map
var heightMap = new HeightMap(4,3,5,1,-1).map;

//call method from worldGeneration.js
boardGen(scene, heightMap);

var camera = createCamera(width, height, renderer, scene);
//scene.add(camera);
var controls = addCameraControls(camera, renderer);

// worldCreation(scene);
generateSkybox(scene);
fillBoard(scene);

//loadCat();

const mapTopZ = 7.5;
const mapRightX = -7.5;
const mapBottomZ = -7.5;
const mapLeftX = 7.5;

function animate() { //returns void
    requestAnimationFrame(animate);
    // Rerenders the scene
    renderer.render(scene, camera);
    //console.log(camera.position);
}

var manager = new THREE.LoadingManager();
var charactersArray = [];
var characterCount = 0;

var managerEnemies = new THREE.LoadingManager();
var enemiesArray = [];
var enemyCount = 0;

createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray);

managerEnemies.onLoad = function() {
    console.log("enemies loaded");
}

manager.onLoad = function () {
    console.log(characterCount);

    /////////////////addButtons(charactersArray, enemiesArray);

    //Reference: https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
    //var handler = function (character, linked) {
    var handler = function (charactersArray) {
        return function (event) {
            if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd' || event.key === 'c')
                movePlayer(event.key, charactersArray);
            else if (event.key === 'r')
                changeCharacter();
        };
    };

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    //Check this example for reference: https://threejs.org/examples/#webgl_interactive_lines
    //event handler when clicking an enemy to attack (or possibly a teammate to heal?)
    document.addEventListener('mousedown', onMouseDown, false);
    function onMouseDown(event){
        raycaster.setFromCamera(mouse, camera);     //place within render/animate function???

        let intersects = raycaster.intersectObjects(scene.children, true);
        console.log(intersects[0]);
        console.log(intersects[0].object);
        // console.log(intersects[0].object.name);
    }

    window.addEventListener('keydown', handler(charactersArray), false);
    window.addEventListener('keyup', keyLifted, false);
    console.log(characterCount);
    animate();
}

export {
    scene, charactersArray, enemiesArray,
    mapTopZ,
    mapRightX,
    mapBottomZ,
    mapLeftX,
    controls
};