import {getRandomInt, placeObject} from './gameBoard.js';
import {isOccupied} from './layer1.js';
import {Actor, Melee, Defender, Ranged} from './actors.js';
import { currentActor } from '../main.js';
//import {Melee, Ranged, Defender} from './actors.js';

function createModels(manager, scene, heightMap, obstacles, mixers, actors, boxes){
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
  

  //Setup an array of model paths
  const models = ['./models/Pirate_Male.glb', './models/Ninja_Male.glb', './models/BlueSoldier_Female.glb',
                  './models/Cowgirl.glb', './models/Goblin_Male.glb', './models/Viking.glb'];

  // const models = ['./models/melee.glb', './models/defender.glb', './models/ranged.glb'];


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

          if(orientation == 0)  //North/South
            y += 9*a;
          else                    //East/West
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
        let height = 0;
        while(intersects.length < 1){
          caster.set(root.position, down);
          root.position.y += .05;
          height += 0.05;
          intersects = caster.intersectObjects(scene.children);
        }

        //move the model up so that it is above the ground, assign height to the model so it can be accessed for later use
        root.position.y += .99;
        height += .99;
        root.height = height;

        //Add animations by creating an animation mixer. assign the model it's mixer and place the mixer in the array
        var mixer = new THREE.AnimationMixer(root);
        root.mixer = mixer;
        mixers.push(mixer);

        //Have the model play the ide animation 
        let animations = gltf.animations;
        root.animations = animations;
        var idleAni = mixer.clipAction( root.animations[1]); //Idle
        root.idleAni = idleAni;
        idleAni.play();

        var attAni = mixer.clipAction( root.animations[3]); //Melee Attack
        root.attAni = attAni;

        var reactAni = mixer.clipAction( root.animations[4]); //take damage
        root.reactAni = reactAni;

        var defeatAni = mixer.clipAction( root.animations[0]); //Defeat
        root.defeatAni = defeatAni;

        var vicAni = mixer.clipAction( root.animations[8]); //victory
        root.vicAni = vicAni;
        
        //name the model for easy access
        root.name = 'model - ' + a + ' - ' + i;

        //Create an actor object and bind it to the model
        let team = 'Player-';
        if(a == 1)
          team = 'Enemy-';


        let job = getRandomInt(3);
        let modelJob;
        switch(job){
          case 0:
            modelJob = new Melee(team + (i+1));
            break;
          case 1:
            modelJob = new Ranged(team + (i+1));
            break;
          case 2:
            modelJob = new Defender(team + (i+1));
            break;
        }

        root.actor = modelJob;
        modelJob.model = root;
        modelJob.xPos = x;
        modelJob.yPos = y;
        actors.push(root);



        //Create the bounding box for the model
        let box = new THREE.Box3().setFromObject(root);
        box.name = "BB-" + modelJob.name;

        //Bind the model and the bounding box, add the box to the box array
        root.bBox = box;
        box.model = root;
        boxes.push(box);

        root.scene = scene;

        scene.add(root);        
      });//End GLTF loader
    } //End for (Models)
  }//End for (Parties)
  let geometry = new THREE.BoxBufferGeometry( .5, .5, .5 );
  let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  let cube = new THREE.Mesh( geometry, material );
  cube.name = "dummy";
  scene.add( cube );
}

  export {createModels};

/*  Model animations by index
    0:  defeat?
    1:  idle
    2:  pick up object
    3:  melee attack 
    4:  take damage
    5:  gun shot/ ranged attack
    6:  sit down
    7:  stand up (from seat)
    8:  victory
    9:  walk
    10: walk while pushing something
*/