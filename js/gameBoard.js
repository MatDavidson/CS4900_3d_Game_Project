import {layer1} from './layer1.js';

//This file creates the layout of the scene
function boardGen(scene, heightMap, obstacles) {
  var mapVerts = heightMap.length;
  let unit = mapVerts/(mapVerts - 1);
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
  
  floorMesh.name = floorMesh;
  
  //add natural terrain objects to the map
  layer1(scene, obstacles, mapVerts);
  //add elements
  scene.add(light, floorMesh, line);
  //
  createHighlights();
  
  //Create the highlights for the gameboard
  function createHighlights(){
    for (let i = 0; i < heightMap.length-1; i++) {
      for (let j = 0; j < heightMap.length-1; j++) {
        let temp = createHighlight(i,j);
        //temp.position.set(i, 0.2, j);
        temp.name = "highlight - " + i + " - " + j;
        //console.log(temp.name);
        //temp.visible = false;
        scene.add(temp);
      }
    }
  }
  //
  function createHighlight(y, x){
    var highlightPlane = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    var highlightMaterial = new THREE.MeshBasicMaterial({
      color: "#FFD700",
      transparent: true,
      opacity: 0.5
    });
    let positions = highlightPlane.getAttribute('position').array;

    positions[2] = heightMap[y][x];
    positions[5] = heightMap[y][x+1];
    positions[8] = heightMap[y+1][x];
    positions[11] = heightMap[y+1][x+1];

    // Creating highlight
    var highLightMesh = new THREE.Mesh(highlightPlane, highlightMaterial);
    
    highLightMesh.rotation.x -= Math.PI / 2;
    
    return highLightMesh;
  }
  function placeHighlight(plane, y, x){
    
  }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
export{boardGen, getRandomInt};

