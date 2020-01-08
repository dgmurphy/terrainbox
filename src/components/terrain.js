import * as BABYLON from '@babylonjs/core';

export function loadTerrain(scene, terrainLoaded) {

    // BABYLON.SceneLoader.ImportMesh("", "./", "ntc_and_skirt", scene, function (newMeshes) {;
    
    //   // bjs is left handed coords, gltf is right handed
    //   newMeshes[0].scaling = new  BABYLON.Vector3(1, 1, -1);  
    //   //Looks like mesh 0 is the base box
    //   newMeshes[0].scaling = new  BABYLON.Vector3(1.88,5.55,-1.88);
    //   newMeshes[0].addRotation(0, Math.PI, 0);
    //   newMeshes[0].position = new  BABYLON.Vector3(-.1,3,0.55)

    //   var terrain = newMeshes[1]
    //   terrain.updateFacetData();

    //   // The gltf import has the normals flipped
    //   var vertex_data = BABYLON.VertexData.ExtractFromMesh(terrain);
    //   for (var i = 0; i < vertex_data.normals.length; i++) {
    //     vertex_data.normals[i] *= -1;
    //   }

    //   vertex_data.applyToMesh(terrain);

    //   terrain.computeWorldMatrix(true); 

     
       
    // });


    // TEST POSITION NEW MESH
    BABYLON.SceneLoader.ImportMesh("", "./", "ntc_and_skirt.gltf", scene, function (newMeshes) {;
    
      // bjs is left handed coords, gltf is right handed
      newMeshes[0].scaling = new  BABYLON.Vector3(1, 1, -1);  
      //Looks like mesh 0 is the base box
      newMeshes[0].scaling = new  BABYLON.Vector3(1.88,5.55,-1.88);
      newMeshes[0].addRotation(0, Math.PI, 0);
      newMeshes[0].position = new  BABYLON.Vector3(-.1,3,0.55)

      var terrain = newMeshes[1]
      terrain.updateFacetData();

      // The gltf import has the normals flipped
      var vertex_data = BABYLON.VertexData.ExtractFromMesh(terrain);
      for (var i = 0; i < vertex_data.normals.length; i++) {
        vertex_data.normals[i] *= -1;
      }

      vertex_data.applyToMesh(terrain);

      terrain.computeWorldMatrix(true); 

      terrainLoaded()
       
    });    


}

export function addGround(scene) {
  // GROUND
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 130, 130, 2, scene);
    ground.receiveShadows = false;
            
    // Create and tweak the background material.
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
    backgroundMaterial.diffuseTexture = new BABYLON.Texture("./Textures/backgroundGround.png", scene);
    backgroundMaterial.diffuseTexture.hasAlpha = true;
    backgroundMaterial.opacityFresnel = true;
    backgroundMaterial.alpha = 0.95;
    backgroundMaterial.shadowLevel = 0.4;
    ground.material = backgroundMaterial; 

  }