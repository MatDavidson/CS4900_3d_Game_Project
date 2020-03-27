//Create the highlights for the gameboard
function createHighlights(scene, heightMap, mapVerts){
    let unit = mapVerts/(mapVerts - 1);
    let mid = (mapVerts - 1)/2;

    for (let i = 0; i < heightMap.length-1; i++) {
        for (let j = 0; j < heightMap.length-1; j++) {
            let temp = createHighlight(j,i, "#eb1409"/*red*/);
            let temp2 = createHighlight(j,i, "#0d3bd4"/*blue*/);
            temp.name = "highlightR - " + j + " - " + i;
            temp2.name = "highlightB - " + j + " - " + i;
            scene.add(temp);
            scene.add(temp2);
        }
    }

    //
    function createHighlight(y, x, col){
        var highlightPlane = new THREE.PlaneBufferGeometry(unit, unit, 1, 1);
        var highlightMaterial = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.5
        });
        let positions = highlightPlane.getAttribute('position').array;

        positions[2] = heightMap[y][x];
        positions[5] = heightMap[y][x+1];
        positions[8] = heightMap[y+1][x];
        positions[11] = heightMap[y+1][x+1];

        // Creating highlight
        var highlightMesh = new THREE.Mesh(highlightPlane, highlightMaterial);
        
        highlightMesh.rotation.x -= Math.PI / 2;
        placeObject(highlightMesh, x, y, mid, unit);
        return highlightMesh;
    }
}
    function placeObject(object, x, y, mid, unit){
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


export{createHighlights, placeObject };

    

  