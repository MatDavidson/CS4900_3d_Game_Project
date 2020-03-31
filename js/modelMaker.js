import {getRandomInt, placeObject} from './gameBoard.js';
import {isOccupied} from './layer1.js';

function createModels(manager, scene, heightMap, obstacles){
  //setup units for setting positions
  let mapVerts = heightMap.length;

  //Create a global variable for the down direction, the raycaster the map
  var down = new THREE.Vector3(0,-1,0);
  var north = 2*Math.PI;
  var south = Math.PI;
  var east = 1.5*Math.PI;
  var west = .5*Math.PI;
  var caster = new THREE.Raycaster(new THREE.Vector3(0,0,0), down);
  caster.far = .05;
  var floorMesh = scene.getObjectByName(floorMesh);
  var mixer;

  //Setup an array of model paths
  const models = ['./models/Pirate_Male.glb', './models/Ninja_Male.glb', './models/BlueSoldier_Female.glb',
                  './models/Cowgirl.glb', './models/Goblin_Male_Red.glb', './models/Viking.glb'];

  //create the gltfLoader passing it the loading manager as an argument
  const gltfLoader = new THREE.GLTFLoader(manager);

  //loop through the model array assigning parameters
  for (let i = 0; i < 5; i++){
    let choice = getRandomInt(models.length);

    gltfLoader.load(models[choice], (gltf) => {
      const root = gltf.scene;
      //root.name = model.name;
      

      // mixer = new THREE.AnimationMixer(root);
      // root.mixer = mixer;
      // let animations = gltf.animations;
      // //var clip = THREE.AnimationClip.findByName( root.animations, 'Idle' );
      // var action = mixer.clipAction( animations[0] );
      // action.play();

      //Place the model, "root" at the proper coordinates
      let x = getRandomInt(6) + 5;
      let y = getRandomInt(3) + 2;  

      while(isOccupied(obstacles, y, x)){
        x = getRandomInt(6) + 5;
        y = getRandomInt(3) + 2; 
      }

      placeObject(root, x, y, mapVerts);
      obstacles[y][x] = 2;
      
      root.rotation.y = west;
      root.scale.set(.34,.34,.34);
      

      //place the raycaster at the same location as the model
      caster.set(root.position, down);
      let intersects = caster.intersectObjects(scene.children);
      
      //bump the model up until the raycaster intersects the ground
      while(intersects.length < 1){
        caster.set(root.position, down);
        root.position.y += .05;
        intersects = caster.intersectObjects(scene.children);
      }

      //move the model up so that it is above the ground
      root.position.y += .95;
      scene.add(root);        
    });
  } 
}

  export {createModels};