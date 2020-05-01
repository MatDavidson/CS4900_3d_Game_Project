import {layer1} from './layer1.js';
import {createHighlights} from './highlights.js';

//This file creates the layout of the scene
function boardGen(scene, heightMap, obstacles, highlights, nodes) {
  var mapVerts = heightMap.length;
  
  //add lighting
  var light = new THREE.AmbientLight( 0x404040, 15.0 );
  light.position.set(1, 1, 1);
  
  //add map texture
  var loader = new THREE.TextureLoader();
  var grassTexture = loader.load( './textures/grass2.jpg', function ( grassTexture ) {
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.offset.set( 0, 0 );
    grassTexture.repeat.set( mapVerts, mapVerts );
  } );
  var material = new THREE.MeshBasicMaterial();
  material.map = grassTexture;

  //setup the geometry for the map
  var floorGeom = new THREE.PlaneBufferGeometry(mapVerts, mapVerts, mapVerts-1, mapVerts-1);
  var floorMesh = new THREE.Mesh(floorGeom,material);
  floorMesh.rotation.x -= Math.PI / 2;

  //Extraact the position array from the PlaneBufferGeometry
  let positions = floorGeom.getAttribute('position').array;

  //Convert the heightMap to a 1d array
  var hM = [];
  for(var i = 0; i < heightMap.length; i++){
  hM = hM.concat(heightMap[i]);}

  //Apply the heightMap to every third position in the position array (the 'z' positions)   
  for(let i = 0; i<(mapVerts*mapVerts); i++){
    positions[(i*3)+2] = parseFloat(hM[i]);
    //console.log(i, hM[i])
  }
  
  //Add wireframe for visibility
  var wireframe = new THREE.WireframeGeometry( floorGeom );
  var line = new THREE.LineSegments( wireframe );
  line.material.depthTest = true;
  line.material.opacity = 0.5;
  line.material.transparent = false;
  line.rotation.x -= Math.PI / 2;
  
  floorMesh.name = 'floorMesh';

  //add natural terrain objects to the map
  layer1(scene, obstacles, mapVerts);
  //add elements
  scene.add(light, floorMesh, line);
  //add the highlight layers
  createHighlights(scene, heightMap, mapVerts, highlights, nodes);
  generateSkybox(scene);


}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
//set the position of an object. Method exported for use in other files
function placeObject(object, x, y, mapVerts){
  let unit = mapVerts/(mapVerts - 1);
  let mid = (mapVerts - 1)/2;
  let quad = getQuad(x, y, mid);
  let horizontal = getDiff(mid, x);
  let vertical = getDiff(mid, y);

  switch(quad){
  case 0:
      object.position.set((unit/2) + horizontal*unit, 0.01, (unit/2) + vertical*unit);
      break;
  case 1:
      object.position.set((unit/2) + horizontal*unit, 0.01, -(unit/2) - (vertical - 1)*unit);
      break;
  case 2:
      object.position.set((-(unit/2) - (horizontal-1)*unit), 0.01, -(unit/2) - (vertical - 1)*unit);
      break;
  case 3:
      object.position.set((-(unit/2) - (horizontal-1)*unit), 0.01, (unit/2) + vertical*unit);
      break;
  default:
      break;
  }
}

function getQuad(x, y, mid){
  if(x > mid && y > mid-1)
  return 0;
  else if(x > mid-1 && y < mid)
  return 1;
  else if(x < mid && y < mid)
  return 2;
  else 
  return 3;
}

//Get the difference between two ints
function getDiff(int1, int2){
  if(int2 > int1)
      return int2 - int1;
  else    
      return int1 - int2;
}

// !REPLACE with new skybox!
function generateSkybox(scene) {
  var materialArray = [];
  var texture_ft = new THREE.TextureLoader().load('../textures/front.png');
  var texture_bk = new THREE.TextureLoader().load('../textures/back.png');
  var texture_up = new THREE.TextureLoader().load('../textures/top.png');
  var texture_dn = new THREE.TextureLoader().load('../textures/bottom.png');
  var texture_rt = new THREE.TextureLoader().load('../textures/right.png');
  var texture_lf = new THREE.TextureLoader().load('../textures/left.png');

  materialArray.push(new THREE.MeshBasicMaterial({
      map: texture_ft
  }));
  materialArray.push(new THREE.MeshBasicMaterial({
      map: texture_bk
  }));
  materialArray.push(new THREE.MeshBasicMaterial({
      map: texture_up
  }));
  materialArray.push(new THREE.MeshBasicMaterial({
      map: texture_dn
  }));
  materialArray.push(new THREE.MeshBasicMaterial({
      map: texture_rt
  }));
  materialArray.push(new THREE.MeshBasicMaterial({
      map: texture_lf
  }));

  for (var i = 0; i < 6; i++)
      materialArray[i].side = THREE.BackSide;

  var skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  var skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}


export{boardGen, getRandomInt, placeObject, getQuad, generateSkybox};

