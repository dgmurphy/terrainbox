
import * as BABYLON from '@babylonjs/core';

export function addPicker(scene) {

  let c = document.getElementsByTagName('canvas')[0]
  c.bjsScene = scene
  c.addEventListener("dblclick", picker)


}

function picker(e) {
  

  var scene = e.currentTarget.bjsScene
  var pickResult = scene.pick(scene.pointerX, scene.pointerY)

  if (pickResult.hit) {

    console.log("clicked point: " + pickResult.pickedPoint)
    var p = pickResult.pickedPoint
    var pnorm = pickResult.getNormal(true)
    if (!pnorm)
      return

    var myPoints = [
      pickResult.pickedPoint,
      new BABYLON.Vector3(p.x + pnorm.x * 5, p.y + pnorm.y * 5, p.z + pnorm.z * 5)
    ];

    BABYLON.MeshBuilder.CreateLines("lines", { points: myPoints }, scene);
  }

}


export function removePicker(scene) {

  let c = document.getElementsByTagName('canvas')[0]
  c.removeEventListener("dblclick", picker );

}