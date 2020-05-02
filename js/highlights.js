import {placeObject} from './gameBoard.js';
import {generateViableList, createNode} from './astar.js';

//Create the highlights for the gameboard
function createHighlights(scene, heightMap, mapVerts, highlights, nodes){
    let unit = mapVerts/(mapVerts - 1);

    //For every tile on the map, create a red and blue highlight that adheres to the surface.
    for (let i = 0; i < heightMap.length-1; i++) {
        for (let j = 0; j < heightMap.length-1; j++) {
            let temp = createHighlight(j,i, "#eb1409"/*red*/);
            let temp2 = createHighlight(j,i, "#0d3bd4"/*blue*/);
            temp.name = "highlightR - " + j + " - " + i;
            temp2.name = "highlightB - " + j + " - " + i;
            temp.visible = false;
            temp2.visible = false;
            nodes[i][j] = createNode(i,j, scene.obstacles);
            highlights[i][j] = temp2;
            scene.add(temp);
            scene.add(temp2);
        }
    }

    //generate node array for astar
    
    

    //Create a single highlight object and set its position
    function createHighlight(y, x, col){
        var highlightPlane = new THREE.PlaneBufferGeometry(unit-.02, unit-.02, 1, 1);
        var highlightMaterial = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.5
        });

        //Set the height for each corner of the highlight
        let positions = highlightPlane.getAttribute('position').array;

        positions[2] = heightMap[y][x];
        positions[5] = heightMap[y][x+1];
        positions[8] = heightMap[y+1][x];
        positions[11] = heightMap[y+1][x+1];

        // Creating highlight
        var highlightMesh = new THREE.Mesh(highlightPlane, highlightMaterial);

        //Give the highlight access to its abstract x and y
        highlightMesh.xPos = x;
        highlightMesh.yPos = y;
        
        highlightMesh.rotation.x -= Math.PI / 2;
        placeObject(highlightMesh, x, y, mapVerts);
        highlightMesh.xPos = x;
        highlightMesh.yPos = y;
        return highlightMesh;
    }
}

function moveRadius(scene, actor, obstacles){
    var viableSpaces = generateViableList(scene, actor, obstacles);

    for(let i = 0; i < viableSpaces.length; i++){
      
      let x = viableSpaces[i].xPos;
      let y = viableSpaces[i].yPos;

      if(obstacles[y][x] != 0)
        continue;

      scene.highlights[x][y].visible = true;
    }
}

// Uses the Flood Fill algorithm to make all the highlights in the range visible
function characterRadius(scene, x, y, radius) {
  //console.log(x + " and " + y);


  // Stops the recursive statement
  if (radius == 0) {
      return;
  }

  // This is the implementation of flood fill
  // !Uses the object's position in order to find the correct highlight; keep this in mind when scaling
  /////////////////// !This needs to be altered once we have our character placement ready! //////////////////////////////////////
  characterRadius(scene, x + 1, y, radius - 1);
  characterRadius(scene, x, y + 1, radius - 1);
  characterRadius(scene, x - 1, y, radius - 1);
  characterRadius(scene, x, y - 1, radius - 1);

  // Finds the highlight in the scene if it exists and 
  // sets its visibility to true
  
  //if(scene.obstacles[y][x] == 0){
  var temp = "highlightB - " + y + " - " + x;
  var highlight = scene.getObjectByName(temp);
  //}
  //console.log("\n" + temp);

  if (highlight == undefined) {
      return;
  }
  highlight.visible = true;
}

//Deactivate all highlights in the scene
function clearRadius(scene){
  for (let i = 0; i < 17; i++) {
    for (let j = 0; j < 17; j++) {
      var temp = "highlightB - " + i + " - " + j;
      var highlight = scene.getObjectByName(temp);
      temp = "highlightR - " + i + " - " + j;
      var highlight2 = scene.getObjectByName(temp);

      if (highlight == undefined) {
        continue;
    }
    highlight.visible = false;
    highlight2.visible = false;
    }
  }
}

export{createHighlights, moveRadius, characterRadius, clearRadius};

    

  