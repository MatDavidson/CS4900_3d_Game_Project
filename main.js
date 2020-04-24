import { boardGen, fillBoard, generateSkybox, characterRadius } from './js/gameBoard.js';
import {createCamera, addCameraControls} from'./js/camera.js';
import {createModels, loadCat } from './js/modelMaker.js';
import { keyLifted, movePlayer, changeCharacter, } from './js/objectGeneration.js';
import {HeightMap} from './js/heightMap.js';
import {Melee, Defender, Ranged} from './js/actors.js';
import { addButtons, onEndTurnClick } from './js/HUD.js';
import { addTitle, createTitle } from './titleScreen.html';

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

//create title screen scene

var titleScreen = new THREE.Scene();
titleScreen.background = new THREE.Color("#C0C0C0");

var planeGeometry = new THREE.PlaneGeometry( 50, 50 );
var planeTexture = new THREE.TextureLoader().load( 'textures/rabbit-9.jpg' );
var planeMaterial = new THREE.MeshBasicMaterial( { map: planeTexture } );
var titlePlane = new THREE.Mesh( planeGeometry, planeMaterial );
titlePlane.position.set(-1, 1.5, -3.75);
titlePlane.rotation.x = -1 * Math.PI;
scene.add( titlePlane );
//grab button functionality
//addTitle();

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

var meleeBox;
var rangedBox;
var defenderBox;

const mapTopZ = 7.5;
const mapRightX = -7.5;
const mapBottomZ = -7.5;
const mapLeftX = 7.5;

var manager = new THREE.LoadingManager();
var charactersArray = [];
var characterCount = 0;

var managerEnemies = new THREE.LoadingManager();
var enemiesArray = [];
var enemyCount = 0;

var boundingBoxArray = [];
var boxHelperMelee;
var boxHelperRanged;
var boxHelperDefender;

boundingBoxArray.push(boxHelperMelee, boxHelperRanged, boxHelperDefender);

//createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray, box, boxHelper, boundingBoxArray);
createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray, boundingBoxArray, meleeBox);

managerEnemies.onLoad = function() {
    console.log("enemies loaded");
}

manager.onLoad = function () {
    console.log(characterCount);

    addButtons(charactersArray, enemiesArray);

    //Reference: https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
    //var handler = function (character, linked) {
    var handler = function (charactersArray) {
        return function (event) {
            if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd' || event.key === 'c')
                movePlayer(event.key, charactersArray, boxHelper, bbox);//needs fix
            else if (event.key === 'r')
                changeCharacter();
            else if (event.key == 'r')
                //cat
                loadCat();  //will fix funtionality later
        };
    };

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    //Check this example for reference: https://threejs.org/examples/#webgl_interactive_lines
    //event handler when clicking an enemy to attack (or possibly a teammate to heal?)
    document.addEventListener('mousedown', onMouseDown, false);

    function onMouseDown(event){
        event.preventDefault();

        //https://stackoverflow.com/questions/34831626/three-js-raycaster-is-offset-when-scollt-the-page
        // mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        // mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

        //set the mouse location to be accurate based on window size
       mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight ) * 2 + 1);
        //print for testing
        //////console.log("x: " + mouse.x + "\ny: " + mouse.y);

        //set the raycaster
        raycaster.setFromCamera(mouse, camera);
        //raycaster direction for testing
        console.log(raycaster.ray.direction);

        //make the raycaster visible
        scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000) );

        console.log(boundingBoxArray);
        
        if(raycaster.ray.intersectsBox(boundingBoxArray[0]) === true){
            console.log("I am the pirate");
        }else if(raycaster.ray.intersectsBox(boundingBoxArray[1]) === true){
            console.log("I am the archer")
        }else if(raycaster.ray.intersectsBox(boundingBoxArray[2]) === true){
            console.log("I am the tank")
        }
        // console.log(intersects);                                                 

        // //output the corresponding bounding box that has been selected
        //  if(intersects.length > 0){
        //      var intersect = intersects[0];
        //      //console.log(intersect.object.object.name);
        //      if (intersect.object.name == "melee")
        //         console.log("pirate");
        //     else if(intersect.object.name == "ranged")
        //         console.log("archer");
        //     else if(intersect.object.name == "defender")
        //         console.log("tank");
        // }
        /////render();
    }

    window.addEventListener('keydown', handler(charactersArray), false);
    window.addEventListener('keyup', keyLifted, false);
    console.log(characterCount);
    animate();
}

function animate() {
    //update bounding boxes
    updateBoundingBoxes();
    requestAnimationFrame(animate);
    // Rerenders the scene
    renderer.render(scene, camera);
    //console.log(camera.position);
}

//IN PROGRESS - called within the animate function to update bounding box locations
function updateBoundingBoxes(){
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

export {
    scene, charactersArray, enemiesArray,
    mapTopZ,
    mapRightX,
    mapBottomZ,
    mapLeftX,
    controls
};