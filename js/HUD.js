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

export { addButtons, onEndTurnClick }