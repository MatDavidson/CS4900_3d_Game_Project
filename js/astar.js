import {scene} from '../main.js';
import {isOccupied} from './layer1.js';

//This function is used to display a model's viable movement options. 
function generateViableList(actor){
    let viableList = [];
    let openList = [];
    let closedList = [];
    let nodes = scene.nodes;
    let currentNode;
    let targetNode = null;

    //doesn't affect anything, needed for the checkNeighbors funtion
    setHeurs(actor.actor.xPos, actor.actor.yPos);

    openList.push(nodes[actor.actor.xPos][actor.actor.yPos]);
    nodes[actor.actor.xPos][actor.actor.yPos].steps = 0;

    while(openList.length > 0){
        currentNode = leastCostNode(openList);
        openList.splice(openList.indexOf(currentNode),1);
        
        if(currentNode.steps > actor.actor.moveLeft){
            closedList.push(currentNode);
            continue;
        }
        else{
            viableList.push(currentNode);
            closedList.push(currentNode);
            checkNeighbors(nodes, currentNode, openList, closedList, targetNode);
        }
    }
    console.log("Finished");
    return viableList;
}

//This function generates a traversal path
function getPath(actor, x,y){
    let path = [];
    let openList = [];
    let closedList = [];
    let nodes = scene.nodes;
    let targetNode = nodes[x][y];
    let currentNode;
    resetNodes(nodes);
    setHeurs(x,y);
    openList.push(nodes[actor.actor.xPos][actor.actor.yPos]);

    while(openList.length > 0){
        currentNode = leastCostNode(openList);
        openList.splice(openList.indexOf(currentNode),1);
        console.log("Current node: (" + currentNode.yPos + "," + currentNode.xPos + "), Count: " + openList.length + "Target node: (" + targetNode.yPos + "," + targetNode.xPos + ")\nCost: " + currentNode.cost + ", Steps: " + currentNode.steps+ ", Heur: " + currentNode.heur)
        if(currentNode == targetNode){
            path = fillPath(currentNode);
            return path;
        }
        else{
            closedList.push(currentNode);
            checkNeighbors(nodes, currentNode, openList, closedList, targetNode);
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

    return lcn;
}

function checkNeighbors(nodes, node, openList, closedList, targetNode){
    let neighbor;
    let parent = node;
    let neighbors = [];

    if(node.xPos - 1 >= 0)
        neighbors.push(nodes[node.xPos - 1][node.yPos]);

    if(node.xPos + 1 < 16)
        neighbors.push(nodes[node.xPos + 1][node.yPos]);

    if(node.yPos - 1 >= 0)
        neighbors.push(nodes[node.xPos][node.yPos - 1]);

    if(node.yPos + 1 < 16)
        neighbors.push(nodes[node.xPos][node.yPos + 1]);

    for(let i = 0; i < neighbors.length; i++){
        neighbor = neighbors[i];

        if(openList.includes(neighbor)){
            //console.log("(" + neighbor.yPos + "," + neighbor.xPos + ") already on Openlist");
            continue;
        }

        if(closedList.includes(neighbor)){
            //console.log("(" + neighbor.yPos + "," + neighbor.xPos + ") already on Closedlist");
            continue;
        }

        if(scene.obstacles[neighbor.yPos][ neighbor.xPos] == 1){
            //console.log("(" + neighbor.yPos + "," + neighbor.xPos + ") is occupied");
            continue;
        }
        if(scene.obstacles[neighbor.yPos][neighbor.xPos] == 2 && nodes[neighbor.xPos][neighbor.yPos] != targetNode){
        //     //console.log("(" + neighbor.yPos + "," + neighbor.xPos + ") is occupied");
            continue;
        }
        if(neighbor.parent == null)
            neighbor.parent = parent;

        neighbor.steps =parent.steps + 1;
        neighbor.cost = neighbor.steps + neighbor.heur;
        openList.push(neighbor);
        //console.log("(" + neighbor.yPos + "," + neighbor.xPos + ") added to Openlist, Count: " + openList.length + "\nCost: " + neighbor.cost + ", Steps: " + neighbor.steps + ", Parent: (" + neighbor.parent.xPos + "," + neighbor.parent.yPos + ")");
        
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

function resetNodes(nodes){
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            nodes[i][j].heur = 0;
            nodes[i][j].cost = 0;
            nodes[i][j].steps = 0;
            nodes[i][j].parent = null;
        }
    }
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
            dx = getDiff(x, i);
            dy = getDiff(y, j);
            nodes[i][j].heur = dx + dy;
        }
    }
}

function getDiff(a, b){
    if(a > b)
        return a-b;
    else
        return b-a;
}

export {generateViableList, createNode, getPath};