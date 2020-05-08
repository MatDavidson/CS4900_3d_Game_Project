import { scene, enemiesArray, charactersArray, currentActor, currentEnemy, endPlayerTurn, playerTurn } from "../main.js";
import { Actor, Melee, Defender, Ranged } from "./actors.js";

//this file contains HUD elements
function addButtons(charactersArray, enemiesArray){
    let endTurnBtn = document.getElementById("endTurn");
    endTurnBtn.addEventListener("click", onEndTurnClick, false);

    let attackBtn = document.getElementById("attack");
    let onAttackClick = function(charactersArray, enemiesArray){ 
        return function(event){
            
            console.log(currentEnemy);
            var player = currentActor.actor
            var target = currentEnemy.actor;
            // let currentChar;
            // let actor = currentCharacter.actor;

            // let enemy = scene.getObjectByName(enemiesArray[enemyCount].name);
            // let enemyActor = enemy.actor;
            //console.log(currentActor);
            //console.log(currentEnemy);
            player.attack(target);

            
            //this is to see the health going down
            console.log(player);
            console.log(target);

            //if health == 0, dead animation and disappear?
        }
    }
    attackBtn.addEventListener("click", onAttackClick(charactersArray, enemiesArray), false);
}

function onEndTurnClick(event){
    if(playerTurn){
        console.log("button clicked");
        endPlayerTurn();                            //will need to add more parameters 
                                            //once enemy attacking is implemented
    }
}

//NEED TO CALL FOR ENEMIES AS WELL AS EACH TYPE OF CHARACTER SWAP
function getCurrentHP(currentCharacter){
    console.log(currentCharacter);
    let healthDisplay = document.getElementById("hp").innerHTML = "Health: " + currentCharacter.actor.hitPts;
    let attackDisplay = document.getElementById("attackPower").innerHTML = "Attack Power: " + currentCharacter.actor.attPow;
    let rangeDisplay = document.getElementById("range").innerHTML = "Range: " + currentCharacter.actor.range;
    let attackTypeDisplay = document.getElementById("attackType").innerHTML = "Class Type: " + currentCharacter.actor.attType;


}

export { addButtons, onEndTurnClick, getCurrentHP }