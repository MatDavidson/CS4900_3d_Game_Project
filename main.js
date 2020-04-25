import { boardGen} from './js/gameBoard.js';
import {createCamera, addCameraControls} from'./js/camera.js';
import {createModels} from './js/modelMaker.js';
// import { keyLifted, movePlayer, changeCharacter, } from './js/objectGeneration.js';
 import {HeightMap,VanillaRandomHeightMap} from './js/heightMap.js';
// import {Melee, Defender, Ranged} from './js/actors.js';
//import { addButtons, onEndTurnClick } from './js/HUD.js';
import {keyMove} from './js/moveActor.js';

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

//grab button functionality
//addTitle();

//Generate height map and obstacles array 
var heightMap = new VanillaRandomHeightMap(4).map;
let mapVerts = heightMap.length;
var obstacles = [...Array(mapVerts-1)].map((_, i) => [...Array(mapVerts-1)].map((_, i) => 0));

//call method from worldGeneration.js
boardGen(scene, heightMap, obstacles);

//changed camera for title plane adjustment - see camera.js
var camera = createCamera(width, height, renderer, scene);

//create title screen scene
var planeGeometry = new THREE.PlaneGeometry( 50, 50 );
var planeTexture = new THREE.TextureLoader().load( 'textures/rabbit-9.jpg' );
var planeMaterial = new THREE.MeshBasicMaterial( { map: planeTexture } );
planeMaterial.side = THREE.DoubleSide;
var titlePlane = new THREE.Mesh( planeGeometry, planeMaterial );
titlePlane.position.set(-1, 1.5, -3.75);
//var rotateVector = new THREE.Vector3(-1, 0, -1);
//titlePlane.rotateOnWorldAxis(rotateVector, Math.PI);
// titlePlane.rotateZ = 2 * Math.PI;
titlePlane.lookAt(camera.position);

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

//blocked for merging
/*
//createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray, box, boxHelper, boundingBoxArray);
createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray, boundingBoxArray, meleeBox);

managerEnemies.onLoad = function() {
    console.log("enemies loaded");
} */
var clock = new THREE.Clock();
const manager = new THREE.LoadingManager();
manager.onLoad = init;
var mixers = []; //hold all animation mixers
var actors = []; //hold all models
var bBoxes = []; //hold all bounding boxes

createModels(manager, scene, heightMap, obstacles, mixers, actors, bBoxes);

/*manager.onLoad = function () {
    console.log(characterCount);

    //addButtons(charactersArray, enemiesArray);

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
}*/

var currentActor;
function init(){
    currentActor = actors[0];
    currentActor.actor.inTransit = false;
    animate();
}

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

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

//Check this example for reference: https://threejs.org/examples/#webgl_interactive_lines
//event handler when clicking an enemy to attack (or possibly a teammate to heal?)
document.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(event){
    event.preventDefault();

    //set the mouse location to be accurate based on window size
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight ) * 2 + 1);
    
    //set the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    //raycaster direction for testing
    console.log(raycaster.ray.direction);

    //make the raycaster visible
    scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000) );

    //console.log(boundingBoxArray);
    
    // if(raycaster.ray.intersectsBox(boundingBoxArray[0]) === true){
    //     console.log("I am the pirate");
    // }else if(raycaster.ray.intersectsBox(boundingBoxArray[1]) === true){
    //     console.log("I am the archer")
    // }else if(raycaster.ray.intersectsBox(boundingBoxArray[2]) === true){
    //     console.log("I am the tank")
    // }
    for(let i = 0; i < actors.length; i ++){
        if(raycaster.ray.intersectsBox(bBoxes[i]))
            console.log(bBoxes[i].name);
    }
}

function animate() {
    //update bounding boxes
    //updateBoundingBoxes();
    requestAnimationFrame(animate);
    // Rerenders the scene
    render();
    //console.log(camera.position);
    controls.update();
}

function render() {

    var delta = clock.getDelta();

    for ( const mixer of mixers ) {
        mixer.update( delta );    
      }

    renderer.render( scene, camera );
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
    scene
    , charactersArray, enemiesArray,
    mapTopZ,
    mapRightX,
    mapBottomZ,
    mapLeftX,
    //controls
};