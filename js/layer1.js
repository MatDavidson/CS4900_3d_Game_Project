  import {getRandomInt} from './gameBoard.js';
  
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
    let unit = mapVerts/(mapVerts - 1);
    let mid = (mapVerts - 1)/2;
    console.log(numObjs);

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
        let x = getRandomInt(mid);
        let y = getRandomInt(mid);
        let quad = getRandomInt(4);

        //Check that the next model will not go to a quad that is too crowded
        while(quad == mostPopulated){
          quad = getRandomInt(4);
          console.log('Quad change')
        }

        //Place the model in a random location based on the random quad variable and mark its location on the obstacles array
        if(quad == 0){
          //For each quadrant, call isOccupied to ensure that each piece goes to an empty spot
          while(isOccupied(obstacles,mid-y-1,mid-x-1)){
            x = getRandomInt(mid);
            y = getRandomInt(mid);
            console.log('Coord Change');
          }
          root.position.set((unit/2) + x*unit, 0.01, (unit/2) + y*unit);
          obstacles[mid-y-1][mid-x-1] = 1;
        }
        else if(quad == 1){
          while(isOccupied(obstacles,mid+y,mid-x-1)){
            x = getRandomInt(mid);
            y = getRandomInt(mid);
            console.log('Coord Change');
          }  
          root.position.set((unit/2) + x*unit, 0.01, -(unit/2) - y*unit);
          obstacles[mid+y][mid-x-1] = 1;

        }
        else if(quad ==2){
          while(isOccupied(obstacles,mid+y,mid+x)){
            x = getRandomInt(mid);
            y = getRandomInt(mid);
            console.log('Coord Change');
          }  
          root.position.set(-(unit/2) - x*unit, 0.01, -(unit/2) - y*unit);
          obstacles[mid+y][mid+x] = 1;
        }
        else{
          while(isOccupied(obstacles,mid-y-1,mid+x)){
            x = getRandomInt(mid);
            y = getRandomInt(mid);
            console.log('Coord Change');
          }  
          root.position.set(-(unit/2) - x*unit, 0.01, (unit/2) + y*unit);
          obstacles[mid-y-1][mid+x] = 1;
        }
        
        quads[quad]+=1;

        if(quads[mostPopulated] < quads[quad]){
          mostPopulated = quad;
        }  
        console.log('Highest Populated: ', mostPopulated, ' with ', quads[mostPopulated], ' models.');
        console.log(quads.toString())
        console.log('Quad ', quad)
        //Give the model a random rotation
        let rotate = getRandomInt(3);
        if(rotate == 0){
        root.rotation.y += Math.PI;
        }
        else if(rotate == 1){
          root.rotation.y += Math.PI / 2;
        }
        else{
          root.rotation.y -= Math.PI / 2;
        }

        //Set the scale of the models
        root.scale.set(models[choice].scale,models[choice].scale,models[choice].scale)

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
      });
    }    
  }
  //Helper that returns true if the specified location is occupied
  function isOccupied(obstacles,y,x){
    if(obstacles[y][x] == 1){
      return true;
    }
    return false;
  }
  export{layer1};