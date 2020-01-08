
import * as BABYLON from '@babylonjs/core';
import { getXZpos, getAngle2,  getAngleOriented} from './utils'
import { addRedMortar } from './agent.js'
import { FIELD_EXTENTS, MORTAR_V, MORTAR_YPEAK,
         TERRAIN_MESH_NAME } from './constants.js'

export function addMortarListener(scene) {

  var decalMaterial = new BABYLON.StandardMaterial("reticle_mat", scene);
  decalMaterial.diffuseTexture = new BABYLON.Texture("/Textures/reticle_small.png", scene);
  decalMaterial.diffuseTexture.hasAlpha = true;
  decalMaterial.zOffset = -2;

  let c = document.getElementsByTagName('canvas')[0]
  c.bjsScene = scene
  c.addEventListener("dblclick", fireMortar)

  c.addEventListener("keypress", handleKeyPress)

}

function handleKeyPress(e) {

  if ( e.which == 32 ) {
    console.log("key press")
    fireMortar(e)
  }
}

function hasHitGround(pos, scene) {

  // quick check 
  if (pos.y > 5)
    return false

  // failsafe check
  if (pos.y < 0)
    return true

   // Casting a ray to get height
   let terrainMesh = scene.getMeshByName(TERRAIN_MESH_NAME)
   var ray = new BABYLON.Ray(new BABYLON.Vector3(pos.x,
       terrainMesh.getBoundingInfo().boundingBox.maximumWorld.y + 1,
       pos.z), new BABYLON.Vector3(0, -1, 0)); // Direction

   var worldInverse = new BABYLON.Matrix();

   terrainMesh.getWorldMatrix().invertToRef(worldInverse);

   ray = BABYLON.Ray.Transform(ray, worldInverse);

   var pickInfo = terrainMesh.intersects(ray);

   if (pickInfo.hit) {
     let mortarHeight = pos.y - pickInfo.pickedPoint.y
     if (mortarHeight < 0)
        return true
   }
 
   return false
}

export function updateMortars(scene) {

    let inc = MORTAR_V
    let detonateArr = []

    for (let mortar of scene.mortarArr) {

      let mesh = scene.getMeshByName(mortar.name)
      let hvecx = Math.cos(mortar.heading)
      let hvecz = Math.sin(mortar.heading)

      // horizontal increment
      mesh.position.x += hvecx * inc
      mesh.position.z += hvecz * inc

      /*  vertical increment */
      mortar.t += 1   // time unit is 1 frame
      
      mesh.position.y = mortar.y0 + (mortar.vy * mortar.t) +
        (0.5 * mortar.g * mortar.t * mortar.t)

      

      if (hasHitGround(mesh.position, scene)) {
        detonateArr.push(mortar)
      }  
    }

    // TODO destroy mesh
    for (let mortar of detonateArr) {
      let index = scene.mortarArr.findIndex(x => x.name === mortar.name)
      if (index > -1) {
        scene.mortarArr.splice(index, 1)
      }
    }

}

function fireMortar(e) {
  
  var scene = e.currentTarget.bjsScene

  let mortarName = 'mortar_' + scene.nextMortarId
  scene.nextMortarId += 1
  let mortarMesh = addRedMortar(mortarName, scene)

  var fromBase = scene.getMeshByName('red_base')
  mortarMesh.position = new BABYLON.Vector3(
    fromBase.position.x,
    fromBase.position.y,
    fromBase.position.z)


  var pickResult = scene.pick(scene.pointerX, scene.pointerY)

  if (pickResult.hit) {

    console.log("clicked point: " + pickResult.pickedPoint)
 
    // DECAL
    let decalMaterial = scene.getMaterialByName("reticle_mat")
    let terrainMesh = scene.getMeshByName(TERRAIN_MESH_NAME)
    var decalSize = new BABYLON.Vector3(1.5, 1.5, 1.5)
    var decal = BABYLON.MeshBuilder.CreateDecal("mortar_target", terrainMesh, 
      { 
        position: pickResult.pickedPoint, 
        normal: pickResult.getNormal(true), 
        size: decalSize
      })
    decal.material = decalMaterial;
  }

  let txz = getXZpos(pickResult.pickedPoint)
  let mxz = getXZpos(mortarMesh.position)
  let tvec = txz.subtract(mxz)

  let heading =  getAngleOriented(getXZpos(BABYLON.Axis.X), tvec)

  /* solve for vertical velocity and gravity given Ypeak and lateral speed */
  let b = MORTAR_YPEAK  // max height of parabola
  let a = fromBase.position.y  // launch elevation
  let c = pickResult.pickedPoint.y  // target elevation
  let t = BABYLON.Vector2.Distance(txz, mxz) / MORTAR_V

  let vy = ((4 * b) - c - (3 * a)) / t
  let g = (4 * (c + a - (2 * b))) / (t * t)

  let mortar = {
    name: mortarName,
    heading: heading,
    y0: a,
    vy: vy,
    g: g,
    t: 0
  }
  
  scene.mortarArr.push(mortar)

}
