import { HeightMap } from "./heightMap.js";

//This file creates the layout of the scene
function boardGen(scene, heightMap) {
    //add lighting
    var light = new THREE.AmbientLight(0x404040, 15.0);
    light.position.set(1, 1, 1);

    //console.log(heightMap.toString())

    //add map texture
    var loader = new THREE.TextureLoader();
    var grassTexture = loader.load('./textures/grass2.jpg', function (grassTexture) {
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.offset.set(0, 0);
        grassTexture.repeat.set(mapVerts, mapVerts);
    });
    var material = new THREE.MeshBasicMaterial();
    material.map = grassTexture;
    //add floor
    var mapVerts = heightMap.length;
    var floorGeom = new THREE.PlaneBufferGeometry(mapVerts, mapVerts, mapVerts - 1, mapVerts - 1);

    var floorMesh = new THREE.Mesh(floorGeom, material);
    floorMesh.rotation.x -= Math.PI / 2;
    var positions = floorGeom.getAttribute('position').array;

    var hM = [];
    for (var i = 0; i < heightMap.length; i++) {
        hM = hM.concat(heightMap[i]);
    }

    for (let i = 0; i < (mapVerts * mapVerts); i++) {
        positions[(i * 3) + 2] = parseFloat(hM[i]);
        //console.log(i, hM[i])
    }
    //console.log(positions.toString())
    var wireframe = new THREE.WireframeGeometry(floorGeom);

    var line = new THREE.LineSegments(wireframe);
    line.material.depthTest = true;
    line.material.opacity = 0.5;
    line.material.transparent = false;
    line.rotation.x -= Math.PI / 2;
    scene.add(line);

    //add grid
    var gridHelper = new THREE.GridHelper(mapVerts, mapVerts, 0x111111, 0x111111);
    gridHelper.position.set(0, 0.01, 0);


    //add elements
    scene.add(light);
    scene.add(floorMesh);
    scene.add(gridHelper);
}

// Fills the board with multiple, invisible highlights
// Creates the name of the highlight using it's x and z position
function fillBoard(scene) {
/////////////////// !This needs to be altered once we have our character placement ready! //////////////////////////////////////
    for (var i = 8; i > -9; i--) {
        for (var j = -8; j < 9; j++) {
            var temp = createHighlight();
            temp.position.set(i, 0.2, j);
            temp.name = "highlight - " + i + " - " + j;
            temp.visible = false;
            scene.add(temp);
        }
    }
}

// Function to create highlights
function createHighlight() { //returns highlight mesh
    //adding plane geometry to act as highlighted coordinates
    var highlightPlane = new THREE.PlaneGeometry(.9, .9);
    var highlightMaterial = new THREE.MeshBasicMaterial({
        color: "#FFD700",
        transparent: true,
        opacity: 0.5
    });

    // Creating highlight
    var highLightMesh = new THREE.Mesh(highlightPlane,
        highlightMaterial
    );

    highLightMesh.rotation.x -= Math.PI / 2;

    return highLightMesh;
}

// Uses the Flood Fill algorithm to make all the highlights in the range visible
function characterRadius(scene, x, y, radius) {
    //console.log(x + " and " + y);


    // Stops the recursive statement
    if (radius == -1) {
        return;
    }

    // This is the implementation of flood fill
    // !Uses the object's position in order to find the correct highlight; keep this in mind when scaling
    /////////////////// !This needs to be altered once we have our character placement ready! //////////////////////////////////////
    characterRadius(scene, x + 1, y, radius - 1);
    characterRadius(scene, x, y + .75, radius - 1);
    characterRadius(scene, x - 1, y, radius - 1);
    characterRadius(scene, x, y - .75, radius - 1);

    // Finds the highlight in the scene if it exists and 
    // sets its visibility to true
    var temp = "highlight - " + x + " - " + y;
    var highlight = scene.getObjectByName(temp);

    //console.log("\n" + temp);

    if (highlight == undefined) {
        return;
    }
    highlight.visible = true;
}

// Works the same as characterRadius, but sets
// highlight visibility to false
/////////////////// !This needs to be altered once we have our character placement ready! //////////////////////////////////////
function clearRadius(scene, x, y, radius) {

    if (radius == -1) {
        return;
    }

    clearRadius(scene, x + 1, y, radius - 1);
    clearRadius(scene, x, y + .75, radius - 1);
    clearRadius(scene, x - 1, y, radius - 1);
    clearRadius(scene, x, y - .75, radius - 1);

    var temp = "highlight - " + x + " - " + y;
    var highlight = scene.getObjectByName(temp);

    // console.log("\n" + temp);
    // console.log(x + " and " + y);

    if (highlight == undefined) {
        return;
    }
    highlight.visible = false;

}

// Creates a skybox around the board
// !CHANGE the images used for the skybox!
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

export { boardGen, fillBoard, generateSkybox, characterRadius, clearRadius };
