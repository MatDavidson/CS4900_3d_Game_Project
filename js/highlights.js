import {placeObject} from './gameBoard.js';

//Create the highlights for the gameboard
function createHighlights(scene, heightMap, mapVerts){
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
            scene.add(temp);
            scene.add(temp2);
        }
    }

    //Create a single highlight object and set its position
    function createHighlight(y, x, col){
        var highlightPlane = new THREE.PlaneBufferGeometry(unit, unit, 1, 1);
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
        
        highlightMesh.rotation.x -= Math.PI / 2;
        placeObject(highlightMesh, x, y, mapVerts);
        return highlightMesh;
    }
}

export{createHighlights};

    

  