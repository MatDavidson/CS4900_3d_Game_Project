import {getRandomInt, placeObject} from './gameBoard.js';
import {isOccupied} from './layer1.js';

function createModels(manager, scene, heightMap, obstacles){
  //setup units for setting positions
  let mapVerts = heightMap.length;

  //Create a global variable for the down direction, cardinal directions, starting points, the raycaster and the map
  var down = new THREE.Vector3(0,-1,0);
  var north = 2*Math.PI;
  var south = Math.PI;
  var east = 1.5*Math.PI;
  var west = .5*Math.PI;
  var direction = [north, south, west, east];
  var xStart = [5,2];
  var xCap = [6,3];
  var yStart = [2,5];
  var yCap = [3,6];
  var caster = new THREE.Raycaster(new THREE.Vector3(0,0,0), down);
  caster.far = .05;
  var floorMesh = scene.getObjectByName('floorMesh');
  var mixer;

  //Setup an array of model paths
  const models = ['./models/Pirate_Male.glb', './models/Ninja_Male.glb', './models/BlueSoldier_Female.glb',
                  './models/Cowgirl.glb', './models/Goblin_Male_Red.glb', './models/Viking.glb'];

  //create the gltfLoader passing it the loading manager as an argument
  const gltfLoader = new THREE.GLTFLoader(manager);

  //Set the orientation f the parties. 0 = North/South
  let orientation = getRandomInt(2);
  
  //Place models for both parties. 
  for(let a = 0; a < 2; a++){
    //Set the direction each model with face
    let dirChoice = a;
    if(orientation == 1) //For parties facing East and West
      dirChoice += 2;

  //loop through the model array assigning parameters
    for (let i = 0; i < 5; i++){
      let choice = getRandomInt(models.length);

      gltfLoader.load(models[choice], (gltf) => {
        const root = gltf.scene;
        //root.name = model.name;

        

        //Place the model, "root" at the proper coordinates
        let x = getRandomInt(xCap[orientation]) + xStart[orientation];
        let y = getRandomInt(yCap[orientation]) + yStart[orientation]; 
        
        if(orientation == 0)
          y += 9*a;
        else
          x += 9*a;

        //Ensure the spaces are not occupied
        while(isOccupied(obstacles, y, x)){
          x = getRandomInt(xCap[orientation]) + xStart[orientation];
          y = getRandomInt(yCap[orientation]) + yStart[orientation]; 

          if(orientation == 0)
          y += 9*a;
        else
          x += 9*a;
        }

        placeObject(root, x, y, mapVerts);
        obstacles[y][x] = 2;
        
        //Set the direction the model is facing
        root.rotation.y = direction[dirChoice];
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
      });//End GLTF loader
    } //End for (Models)
  }//End for (Parties)
}

  export {createModels};

  // mixer = new THREE.AnimationMixer(root);
        // root.mixer = mixer;
        // let animations = gltf.animations;
        // //var clip = THREE.AnimationClip.findByName( root.animations, 'Idle' );
        // var action = mixer.clipAction( animations[0] );
        // action.play();