import { charactersArray,  scene, obstacles, nextEnemy} from '../main.js';
import { getPath } from './astar.js';
import { pathMove } from './moveActor.js';

function enemyTurn(actor){
    if(actor.actor.target == null)
        selectTarget(actor);

    if(actor.actor.target != null && actor.actor.inRange(actor.actor.target.actor)){
        actor.actor.attack(actor.actor.target.actor);
        nextEnemy();
        return;
    }

    if(actor.actor.target != null)
        actor.actor.path = getPath(actor, actor.actor.target.actor.xPos, actor.actor.target.actor.yPos);

    if(actor.actor.path != null && actor.actor.path.length > 0)
        pathMove(actor, actor.actor.path.pop(), obstacles, scene);
    else    
        nextEnemy();
}

function selectTarget(actor){
    let closest = actor;
    let steps = 100;
    let x,y, path;

    for(let i = 0; i < charactersArray.length; i++){
        x = charactersArray[i].actor.xPos;
        y = charactersArray[i].actor.yPos;
        path = getPath(actor, x, y);

        if(path.length < steps){
            closest = charactersArray[i];
            steps = path.length;
        }
    }
    if(actor != closest)
        actor.actor.target = closest;
    else
        actor.actor.target = null;
}

export {enemyTurn};