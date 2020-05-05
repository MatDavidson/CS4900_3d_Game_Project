import {scene} from '../main.js';
import {isOccupied} from './layer1.js';

function generateViableList(scene, currentActor, obstacles){
    let viableList = [];
    let openList = [];
    let closedList = [];
    let nodes = scene.nodes;
    let actor = currentActor.actor;

    setCosts(nodes, actor);

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            if(nodes[i][j].cost <= actor.moveLeft && nodes[i][j].occupied == false)
                viableList.push(nodes[i][j]);
        }
    }

    return viableList;
}
function getPath(actor, x,y){
    let path = [];
    let openList = [];
    let closedList = [];
    let nodes = scene.nodes;
    let targetNode = nodes[x][y];
    let currentNode;

    setHeurs(x,y);
    openList.push(nodes[actor.actor.xPos][actor.actor.yPos]);

    while(openList.length > 0){
        currentNode = leastCostNode(openList);
        if(currentNode == targetNode){
            path = fillPath(currentNode);
        }
        else{
            closedList.push(currentNode);
            checkNeighbors(nodes, currentNode, openList, closedList, actor);
        }
    }
}

function leastCostNode(openList){
    let lcn = openList[0];
    let leastCost = lcn.cost;

    for(let i = 0; i < openList.length; i++){
        if(openList[i].cost < leastCost){
            lcn = openList[i];
            leastCost = lcn.cost;
        }
    }
    openList.splice(openList.indexOf(lcn));

    return lcn;
}

function checkNeighbors(nodes, node, openList, closedList, actor){
    let neighbor;
    let neighbors = [];

    if(node.xPos - 1 > 0)
        neighbors.push(nodes[node.xPos - 1][node.yPos]);

    if(node.xPos + 1 < 17)
        neighbors.push(nodes[node.xPos + 1][node.yPos]);

    if(node.yPos - 1 > 0)
        neighbors.push(nodes[node.xPos][node.yPos - 1]);

    if(node.yPos + 1 < 17)
        neighbors.push(nodes[node.xPos][node.yPos + 1]);

    for(let i = 0; i < neighbors.length; i++){
        neighbor = neighbors[i];
        setSteps(neighbor, actor);
        if(!openList.includes(neighbor) && !closedList.includes(neighbor) && !isOccupied(scene.obstacles, neighbor.xPos, neighbor.yPos)){
            neighbor.parent = node;
            neighbor.cost = neighbor.steps + neighbor.heur;
            openList.push(neighbor);
        }
    }    
}

function fillPath(node){
    let path = [];
    let prev = node.parent;

    while(prev.parent != null){
        path.push(prev);
        prev = prev.parent;
    }
    return path;
}

//Node objects for astar
function createNode(x, y, obstacles){
    var node = {xPos: x, yPos: y, heur: 0, cost:0, steps: 0, occupied: true, parent: null};
    if(obstacles[y][x] < 1){
        node.occupied = false;
    }
    return node;
}

function setHeurs(x,y){
    let dx, dy;
    let nodes = scene.nodes;

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            dx = getDiff(x, actor.actor.xPos);
            dy = getDiff(y, actor.actor.yPos);
            nodes[i][j].heur = dx + dy;
        }
    }
}

function setSteps(node, actor){
    let s = getDiff(node.xPos, actor.xPos) + getDiff(node.yPos, actor.yPos);
    node.steps = s;
}

function setCosts(nodes, actor){
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            let node = nodes[i][j];
            //setHeur(node, actor);
            setSteps(node, actor);
            node.cost = node.heur + node.steps;
            ///console.log(node.cost);
        }
    }
    
}
function getDiff(a, b){
    if(a > b)
        return a-b;
    else
        return b-a;
}

export {generateViableList, createNode};