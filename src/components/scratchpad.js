// SNIPPET HOLDER - ERASE WHEN DONE

/* Old single-click picker for normals */
export function addPickerOLD(scene) {

    dbclickTest(scene)
 
   //  //When pointer down event is raised
   //  scene.onPointerDown = function (evt, pickResult) {
   //   // if the click hits the ground object, we change the impact position
   //     if (pickResult.hit) {
 
   //       var p = pickResult.pickedPoint
   //       //console.log("picked point: " + pickResult.pickedPoint)
   //       var pnorm = pickResult.getNormal(true)
   //       if ( !pnorm )
   //         return
 
   //       //console.log(pnorm);
   //       var myPoints =[
   //         pickResult.pickedPoint,
   //         new BABYLON.Vector3(p.x + pnorm.x * 5, p.y + pnorm.y * 5, p.z+pnorm.z * 5) 
   //       ];
         
   //       BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);
   //     }
   //   };
   }




// ******  ERASE
let steeringMode = { dir: 'left', weight: 0.5}
let tleft = 0
let tright = 0
let tstraight = 0
let ttotal = 0
// **************


   // ******* ERASE
   steeringMode = steeringPoll( steeringMode )
   switch (steeringMode.dir) {
       case 'left':
           tleft += 1
           break;
       case 'right':
           tright += 1
           break;
       case 'straight':
           tstraight += 1
           break;
   }
   ttotal += 1
   let leftpct = tleft / ttotal
   let rightpct = tright / ttotal
   let straightpct = tstraight / ttotal
   console.log('left: ' + leftpct.toFixed(2) + ' right: ' + rightpct.toFixed(2) + ' straight:' + straightpct.toFixed(2))
   // *************************


// function makeFlag(name, scene) {

//     var flagMat = new BABYLON.StandardMaterial("flagmat", scene);
//     flagMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
//     var texture = new BABYLON.Texture("Textures/flag.png", scene); 
//     flagMat.emissiveColor = new BABYLON.Color3(0.7,0.7,0.7,1);
//     flagMat.diffuseTexture = texture

//     //  Put a texture on the Y face
//     var faceUV = new Array(6);
//     //zero out the other faces
//     for (var i = 0; i < 6; i++) {
//         faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
//     }
//     // overwrite wanted face with sprite coordinates
//     faceUV[4] = new BABYLON.Vector4(0, 0, 1, 1);

//     let options = {
//         width: 1,
//         height: 0.05,
//         depth: 1,
//         faceUV: faceUV
        
//     }

//     var flag = BABYLON.MeshBuilder.CreateBox(name + "_baseflag", options, scene)
//     flag.material = flagMat

//     return flag
// }