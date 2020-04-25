import {getRandomInt, placeObject, getQuad} from './gameBoard.js';

//add natural terrain objects to the map
function layer1(scene, obstacles, mapVerts){
  //Declare varibles for object generation 
  var terObjs = [];
  var quads = [0,0,0,0];
  let mostPopulated = 3;
  let numObjs = Math.floor(((mapVerts-1)*(mapVerts-1))*.15);
  let manager = new THREE.LoadingManager();
  let down = new THREE.Vector3(0,-1,0);
  let caster = new THREE.Raycaster(new THREE.Vector3(0,0,0), down);
  caster.far = .05;
  let max = mapVerts - 1; 
  let mid = (mapVerts - 1)/2;
  let highest = 0;
  //console.log(numObjs);

  //Setup an array of model properties
  const models = [
    { url: './models/Bush_2/Bush_2.gltf', scale: 0.75},
    { url: './models/BushBerries_1/BushBerries_1.gltf', scale: 0.75},
    { url: './models/CommonTree_2/CommonTree_2.gltf', scale: .75},
    { url: './models/CommonTree_3/CommonTree_3.gltf', scale: .75},
    { url: './models/PineTree_5/PineTree_5.gltf', scale: 1.25},
    { url: './models/Rock_1/Rock_1.gltf', scale: 1.25},
    { url: './models/Rock_2/Rock_2.gltf', scale: 1.25},
  ];
  const gltfLoader = new THREE.GLTFLoader(manager);
    
  for(let i = 0; i<numObjs; i++){
    let choice = getRandomInt(models.length)
    gltfLoader.load(models[choice].url, (gltf) => {
      //Setup varibles for random placement
      const root = gltf.scene;
      let x = getRandomInt(max);
      let y = getRandomInt(max);
      let quad = getQuad(x, y, mid);

      //Check the coords and mark its location as occupied and set its
      fixCoords();
      obstacles[y][x] = 1;
      placeObject(root, x, y, mapVerts);
      
      //Keep up with the number of objects in each quad
      quads[quad]+=1;
      for(let i = 0; i < 4;  i++){
        if(quads[i] > highest ){
          highest = quads[i];
          mostPopulated = i;
          console.log("Highest change");
        }
      }  
    
      //Give the model a random rotation
      let rotate = getRandomInt(3);

      switch(rotate){
        case 0:
          root.rotation.y += Math.PI;
          break;
        case 1:
          root.rotation.y += Math.PI / 2;
          break;
        case 2:
          root.rotation.y -= Math.PI / 2;
          break;
      }

      //Set the scale of the models
      let sc = models[choice].scale;
      root.scale.set(sc,sc,sc);

      //Set the height of the models
      caster.set(root.position, down);
      let intersects = caster.intersectObjects(scene.children);
      
      while(intersects.length < 1){
        caster.set(root.position, down);
        root.position.y += .05;
        intersects = caster.intersectObjects(scene.children);
      }
      root.position.y += .95;
      terObjs.push(root);
      scene.add(root); 
      
      //Helper method to ensure the terrain object is not going to a place that is already occupied or an overpopulated quad
      function fixCoords(){
        if(isOccupied(obstacles,y,x) || quad == mostPopulated){
          x = getRandomInt(max);
          y = getRandomInt(max);
          quad = getQuad(x, y, mid);
          fixCoords();
        }
      }
    });
  }    
}
//Helper that returns true if the specified location is occupied
function isOccupied(obstacles,y,x){
  if(obstacles[y][x] != 0){
    return true;
  }
  return false;
}
export{layer1, isOccupied};