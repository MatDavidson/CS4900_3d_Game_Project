import { boardGen, fillBoard, generateSkybox, characterRadius } from './js/gameBoard.js';
import {createCamera, addCameraControls} from'./js/camera.js';
import {createModels, loadCat, meleeBox, rangedBox, defenderBox, enemyMeleeBox, enemyRangedBox, enemyDefenderBox} from './js/modelMaker.js';
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

var manager = new THREE.LoadingManager();
var charactersArray = [];
var characterCount = 0;

var managerEnemies = new THREE.LoadingManager();
var enemiesArray = [];
var enemyCount = 0;

var boundingBoxArray = [];
var boxHelper;
var bbox;

  //create bounding box for raycaster to work
  //var box = new THREE.Box3();
  //var boxHelper;
//createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray, box, boxHelper, boundingBoxArray);
createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray, boundingBoxArray, boxHelper);


managerEnemies.onLoad = function() {
    console.log("enemies loaded");
}

//add test cube to see bb functionality
var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshPhongMaterial({
    color:'#FF99FF'
});

var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.set(2, 1.5, -3.75);
cube.name = "cube boi";

var boundingTestBox = new THREE.Box3();
cube.geometry.computeBoundingBox();
boundingTestBox.setFromObject(cube);

//boundingTestBox.expandByObject(cube);

//console.log(boundingTestBox.distanceToPoint(2, 1.5, -3.75));

manager.onLoad = function () {
    console.log(characterCount);

    /////////////////addButtons(charactersArray, enemiesArray);

    //Reference: https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
    //var handler = function (character, linked) {
    var handler = function (charactersArray) {
        return function (event) {
            if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd' || event.key === 'c')
                movePlayer(event.key, charactersArray, boxHelper, bbox);
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
        // for(var i =0; i < charactersArray.length; i++){
        //     console.log(charactersArray[i]);
        // }
        event.preventDefault();
        
        mouse.set((event.clientX / window.innerWidth) * 2 -1, - (event.clientY / window.innerHeight ) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);

        //IN PROGRESS - it is not getting the correct object values we need
        // Example: name is Body_0 (maybe need to access it through root?? Not sure)
        // The object type is Skinned Mesh
        var intersects = raycaster.intersectObjects(scene.children, true);          //https://stackoverflow.com/questions/55462615/three-js-raycast-on-skinning-mesh
                                                                                    // may need to utilize "picking" in order for raycaster to behave correctly
        console.log(intersects);                                                    //                          OR
        //testing purposes                                                          //              we use bounding boxes
        //console.log(intersects[0].object.asset.name);
         if(intersects.length > 0){
             var intersect = intersects[0];
             //console.log(intersect.object.object.name);
             if (intersect.object.name == "Body_6") //clicked on the pirate
                console.log("yup");
        //     var cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50);
        //     var cubeMaterial = new THREE.MeshBasicMaterial({
        //         color: 0xfeb74c
        //     });
        //     var placeholder = new THREE.Mesh(cubeGeo, cubeMaterial);
        //     placeholder.position.copy(intersect.point);
        //     //.add(intersect.face.normal);
        //     scene.add(placeholder);
        }

        //render();

        // console.log(intersects[0]);
        // console.log(intersects[0].object);
        // console.log(intersects[0].object.name);
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
    //raycaster.setFromCamera(mouse, camera);
    // Rerenders the scene
    renderer.render(scene, camera);
    //console.log(camera.position);
}

//called within the animate function to update bounding box locations
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