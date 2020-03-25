import { Actor, Defender, Melee, Ranged } from './actors.js';

function createModels(manager, managerEnemies, scene, heightMap, charactersArray, enemiesArray){
  //scene, arr) {
  // var redMat = new THREE.MeshLambertMaterial({color:0xF7573E});
  // var blueMat = new THREE.MeshLambertMaterial({color:0x2194ce});
  // var greenMat = new THREE.MeshLambertMaterial({color:0x11E020});
  var mixer;
  //load the obj
  const characters = {
    melee: { url: './models/Pirate_Male.glb', name: 'melee', pos: 1.5 },
    ranged: { url: './models/Ninja_Male.glb', name: 'ranged', pos: 2.5 },
    defender: { url: './models/BlueSoldier_Female.glb', name: 'defender', pos: 0.5 },
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
      root.name = model.name;
      root.turns = 5; //determines the number of moves; will need to relocate

      mixer = new THREE.AnimationMixer(root);
      root.mixer = mixer;
      let animations = gltf.animations;
      //var clip = THREE.AnimationClip.findByName( root.animations, 'Idle' );
      var action = mixer.clipAction(animations[0]);
      action.play();


      root.position.set(model.pos, 1.5, -3.75);
      root.rotation.y += Math.PI;
      root.scale.set(.34, .34, .34)
      //root.visible = false;

      if (root.name === "melee") {
        console.log("melee");
        let mike = new Melee("Mike");///////////////////////use obj location for actor; stay away from duplicate info
        root.actor = mike;
      } else if (root.name === "ranged") {
        console.log("ranged");
        let rachel = new Ranged("Rachel");
        root.actor = rachel;
      } else if (root.name === "defender") {
        console.log("defender");
        let joe = new Defender("Joe");
        root.actor = joe;
      }

      charactersArray.push(root);
      scene.add(root);

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
