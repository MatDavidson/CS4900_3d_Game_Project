

function generateViableList(scene, currentActor, obstacles){
    let openList = [];
    let closedList = [];
    let nodes = scene.nodes;
    let actor = currentActor.actor;

    setCosts(nodes, actor);

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            if(nodes[i][j].cost <= actor.moveLeft && nodes[i][j].occupied == false)
                openList.push(nodes[i][j]);
        }
    }

    return openList;
}

//Node objects for astar
function createNode(x, y, obstacles){
    var node = {xPos: x, yPos: y, heur: 0, cost:0, steps: 0, occupied: true};
    if(obstacles[y][x] < 1){
        node.occupied = false;
    }
    return node;
}

function setHeur(node, actor){
    let dx = getDiff(node.xPos, actor.xPos);
    let dy = getDiff(node.yPos, actor.yPos);
    
    let less;
    
    if(dx < dy)
        less = dx;
    else
        less = dy;
         
    node.heur = getDiff(dy, dx) + less;
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