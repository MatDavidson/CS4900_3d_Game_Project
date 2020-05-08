import { charactersArray,  scene, obstacles} from '../main.js';
import { getPath } from './astar.js';
import { pathMove } from './moveActor.js';

function enemyTurn(actor){
    // if(actor.actor.target == null)
    //     selectTarget(actor);

    actor.actor.target = charactersArray[0];

    actor.actor.path = getPath(actor, actor.actor.target.actor.xPos, actor.actor.target.actor.yPos);
    pathMove(actor, actor.actor.path.pop(), obstacles, scene);
}

function selectTarget(actor){
    let closest  = actor;
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

    actor.actor.target = closest;
}

export {enemyTurn};