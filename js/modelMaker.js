import { Actor, Defender, Melee, Ranged } from './actors.js';

function createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray){
  //scene, arr) {
  // var redMat = new THREE.MeshLambertMaterial({color:0xF7573E});
  // var blueMat = new THREE.MeshLambertMaterial({color:0x2194ce});
  // var greenMat = new THREE.MeshLambertMaterial({color:0x11E020});
  var mixer;
  //load the obj
  //floodfill uses the positions of the models
  const characters = {
    melee: { url: './models/Pirate_Male.glb', name: 'melee', pos: 0 },
    ranged: { url: './models/Ninja_Male.glb', name: 'ranged', pos: 1 },
    defender: { url: './models/BlueSoldier_Female.glb', name: 'defender', pos: -1 },
  };

  const enemies = {
    meleeEnemy: { url: './models/Goblin_Male_Red.glb', name: 'meleeEnemy', pos: 0.5 },
    rangedEnemy: { url: './models/Cowgirl.glb', name: 'rangedEnemy', pos: 1.5 },
    defenderEnemy: { url: './models/Viking.glb', name: 'defenderEnemy', pos: -0.5 },
  };

  const gltfLoader = new THREE.GLTFLoader(manager);
  const gltfLoaderEnemies = new THREE.GLTFLoader(managerEnemies);

  for (const model of Object.values(characters)) {
    gltfLoader.load(model.url, (gltf) => {
      const root = gltf.scene;
      scene.add(root);

      //create characters 
      let mike = new Melee("Mike");
      let rachel = new Ranged("Rachel");
      let joe = new Defender("Joe");

      switch(model.name){
          case "melee":   
            gltf.asset = mike;
            //console.log(gltf.asset);
            break;
          case "ranged":  
            gltf.asset = rachel;
            //console.log(gltf.asset);
            break;
          case "defender": 
            gltf.asset = joe;
            //console.log(gltf.asset);
            break;
      }

      root.position.set(model.pos, 1.5, -3.75);
      root.scale.set(.34, .34, .34);

      charactersArray.push(gltf.asset);
      //console.log(charactersArray[0]);

    });
  }//end for

  //load enemies and populate enemies array
  for (const model of Object.values(enemies)) {
    gltfLoaderEnemies.load(model.url, (gltf) => {
      const root = gltf.scene;
      root.name = model.name;
      root.turns = 5; //determines the number of moves; will need to relocate
      root.position.set(model.pos, 0.01, 3.5);
      root.rotation.y += Math.PI;
      root.scale.set(.34, .34, .34);
      //root.visible = false;
      if (root.name === "meleeEnemy") {
        console.log("meleeEnemy");
        let makayla = new Melee("Makayla");
        root.actor = makayla;
      } else if (root.name === "rangedEnemy") {
        console.log("rangedEnemy");
        let lkay = new Ranged("LKay");
        root.actor = lkay;
      } else if (root.name === "defenderEnemy") {
        console.log("defenderEnemy");
        let denise = new Defender("Denise");
        root.actor = denise;
      }
      enemiesArray.push(root);
      scene.add(root);
    });
  }//end for
}

function onLoad(gltf){
  console.log(gltf);
  scene.add(gltf.scene.children);
}


function loadCat() {  
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load('./models/Felixx.glb', function (gltf) {
      const root = gltf.scene;
      root.name = "cat";
      root.visible = false;
      //root.turns = 5; //determines the number of moves; will need to relocate
      root.position.set(-0.25, 0.01, 2);
      root.rotation.y += Math.PI;
      root.scale.set(10, 10, 10);
      scene.add(root);
  });
}

export { createModels, loadCat };
