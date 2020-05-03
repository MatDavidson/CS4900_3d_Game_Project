
import {
    scene, //charactersArray, 
    mapTopZ,
    mapRightX,
    mapBottomZ,
    mapLeftX,
} from '/main.js';

import {
    characterRadius,
    clearRadius
} from './gameBoard.js';

var down = false;
var characterCount = 0;
var enemyCount = 0;

// // Changes the seleceted character for the player
// function changeCharacter() {
//     //console.log(characterCount);
//     if (characterCount < 2)
//         characterCount++;
//     else
//         characterCount = 0;

//     return;
// }

//create event handler to move the banana along with a highlight square
function movePlayer(key, charactersArray, boxHelper, bbox) {

    let currentCharacter = scene.getObjectByName(charactersArray[characterCount].name);     //this gets the current character model
    //let bbox = boundingBoxArray[characterCount];

    console.log(currentCharacter);
    var cat = scene.getObjectByName("cat");

    //create vector to hold object's location
    var positionVector = new THREE.Vector3();
    var currentCharacterObj = currentCharacter.asset;   //this gets the current model's attached obj
    console.log(currentCharacterObj);

    while (currentCharacterObj.movement > 0) {
        if (down) //prevents obj from moving multiple spaces when key is held down
            return;
        down = true;

        if (event.key === 'w') { //w is pressed
            positionVector = currentCharacter.position;
            //limit movement if out of bounds
            if (!(positionVector.z >= mapTopZ)) {
                clearRadius(scene, currentCharacter.position.x, currentCharacter.position.z, currentCharacterObj.movement);
                currentCharacter.position.z += 1;
            }
        } else if (event.key === 'a') { //a is pressed
            positionVector = currentCharacter.position;
            console.log(positionVector);
            if (!(positionVector.x >= mapLeftX)) {
                clearRadius(scene, currentCharacter.position.x, currentCharacter.position.z, currentCharacterObj.movement);
                currentCharacter.position.x += 1;
            }
        } else if (event.key === 's') { //s is pressed
            positionVector = currentCharacter.position;
            console.log(positionVector);
            if (!(positionVector.z <= mapBottomZ)) {
                clearRadius(scene, currentCharacter.position.x, currentCharacter.position.z, currentCharacterObj.movement);
                currentCharacter.position.z += -1;
            }
        } else if (event.key === 'd') { //d is pressed
            positionVector = currentCharacter.position;
            console.log(positionVector);
            if (!(positionVector.x <= mapRightX)) {
                clearRadius(scene, currentCharacter.position.x, currentCharacter.position.z, currentCharacterObj.movement);
                currentCharacter.position.x += -1;
            }
            //The following can be used to manually swap characters, skipping moves
        } else if (event.key == 'c') { //cat easter egg
            //loadCat();
            cat.visible = true;
            return;
        }

        --currentCharacterObj.movement; //decrement the associated obj's movement number
        // box.min.sub(currentCharacter.position);
        // box.max.sub(currentCharacter.position);
        //console.log(box.distanceToPoint(currentCharacter.position));
        // console.log(boundingBoxArray[1]);

        // bbox.setFromObject(currentCharacter);
        // boundingBoxArray[1] = bbox;
        // console.log(boundingBoxArray[1]);
        bbox = new THREE.Box3();
        bbox.setFromObject(currentCharacter);
        ///////boxHelper = new THREE.BoxHelper(currentCharacter, 0xffff00 );
        //scene.add(box);
        ///////scene.add(boxHelper);

        //characterRadius(scene, currentCharacter.position.x, currentCharacter.position.z, currentCharacterObj.movement);

    } //end while(player movement > 0)

    if (characterCount < 2)
        characterCount++;
    else
        characterCount = 0;
    console.log(characterCount);

    if (down)
        return;
}

//Reference: https://stackoverflow.com/questions/17514798/how-to-disable-repetitive-keydown-in-javascript
//prevents obj from moving multiple spaces when key is held down
function keyLifted() {
    down = false;

    return down;
}


// Temporary function for moving enemies
function enemiesTurn(enemiesArray, enemyCount) {
    let currentEnemy = scene.getObjectByName(enemiesArray[enemyCount].name);
    console.log(currentEnemy);

    //create vector to hold object's location
    var positionVector = new THREE.Vector3();
    var currentEnemyObj = scene.getObjectByName(currentEnemy.name);

    while (currentEnemyObj.turns > 0) {

        console.log("turn");
        positionVector = currentEnemyObj.position;
        //limit movement if out of bounds
        if (!(positionVector.z >= mapTopZ)) {
            currentEnemyObj.position.z -= 1;
            console.log(positionVector);
        }
        --currentEnemyObj.turns;
        currentEnemyObj.updateMatrix();
        sleep(2000);

    }

    // if (enemyCount < 2)
    //     enemyCount++;
    // else
    //     enemyCount = 0;
}

//Reference: https://stackoverflow.com/questions/16873323/javascript-sleep-wait-before-continuing/16873849
// Delays movements by a set amount of time
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

export {
    keyLifted,
    movePlayer,
    //createModels, within modelMaker.js
    //loadCat,
    changeCharacter,
    enemiesTurn,
    characterCount,
    enemyCount
};