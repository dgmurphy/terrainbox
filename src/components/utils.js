import * as BABYLON from '@babylonjs/core';


export function getXZpos( posxyz ) {

 return new BABYLON.Vector2(posxyz.x, posxyz.z)

}

export function getXZRange(posxyz, posxz) {

  return BABYLON.Vector2.Distance(
    new BABYLON.Vector2(posxyz.x, posxyz.z), posxz
  )
}

export function headingToVector2(heading) {

  let hvecx = Math.cos(heading * (Math.PI / 180.0))
  let hvecz = Math.sin(heading * (Math.PI / 180.0))
  let hvec = new BABYLON.Vector2(hvecx, hvecz)
  hvec = BABYLON.Vector2.Normalize(hvec)

  return hvec

}

// 3-Vector
export function getAngle(v1, v2) {

  let dotp = BABYLON.Vector3.Dot(v1, v2)
  let lengthv1 = v1.length()
  let lengthv2 = v2.length()

  var theta = Math.acos(dotp / (lengthv1 * lengthv2))

  return theta

}

// 2-Vector
export function getAngle2(v1, v2) {

  let dotp = BABYLON.Vector2.Dot(v1, v2)
  let lengthv1 = v1.length()
  let lengthv2 = v2.length()

  var theta = Math.acos(dotp / (lengthv1 * lengthv2))

  return theta

}

// Return signed angle (-PI -> PI ) for 2-vectors
export function getAngleOriented(v1, v2) {

  // angle = atan2(x1y2−y1x2,x1x2+y1y2)
  return Math.atan2((v1.x * v2.y) - (v1.y * v2.x), (v1.x * v2.x) + (v1.y * v2.y))
}


export function addAxes(scene) {

  let hide_y = false

  var size = 60;
  var ysize = 6;

  var axisX = BABYLON.Mesh.CreateLines("axisX", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  axisX.color = new BABYLON.Color3(1, 0, 0);


  var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
    new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
  ], scene);
  axisZ.color = new BABYLON.Color3(0, 0, 1);

  if (hide_y)
    return

  var axisY = BABYLON.Mesh.CreateLines("axisY", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, ysize, 0), new BABYLON.Vector3(-0.05 * ysize, ysize * 0.95, 0),
    new BABYLON.Vector3(0, ysize, 0), new BABYLON.Vector3(0.05 * ysize, ysize * 0.95, 0)
  ], scene);
  axisY.color = new BABYLON.Color3(0, 1, 0);

}

export function drawBlueHotGrid(scene) {

  let long1 = [
    new BABYLON.Vector3(12.55, 3.5, 13.5),
    new BABYLON.Vector3(12.55, 3.5, -13.5)
  ]
  let long2 = [
    new BABYLON.Vector3(15.55, 3.5, 13.5),
    new BABYLON.Vector3(15.55, 3.5, -13.5)
  ]
  let long3 = [
    new BABYLON.Vector3(18.55, 3.5, 13.5),
    new BABYLON.Vector3(18.55, 3.5, -13.5)
  ]
  let long4 = [
    new BABYLON.Vector3(21.55, 3.5, 13.5),
    new BABYLON.Vector3(21.55, 3.5, -13.5)
  ]
  let long5 = [
    new BABYLON.Vector3(24.55, 3.5, 13.5),
    new BABYLON.Vector3(24.55, 3.5, -13.5)
  ]

  let lat1 = [
    new BABYLON.Vector3(12.55, 3.5, 13.5),
    new BABYLON.Vector3(24.55, 3.5, 13.5)

  ]
  let lat2 = [
    new BABYLON.Vector3(12.55, 3.5, 10.5),
    new BABYLON.Vector3(24.55, 3.5, 10.5)

  ]
  let lat3 = [
    new BABYLON.Vector3(12.55, 3.5, 7.5),
    new BABYLON.Vector3(24.55, 3.5, 7.5)

  ]
  let lat4 = [
    new BABYLON.Vector3(12.55, 3.5, 4.5),
    new BABYLON.Vector3(24.55, 3.5, 4.5)

  ]
  let lat5 = [
    new BABYLON.Vector3(12.55, 3.5, 1.5),
    new BABYLON.Vector3(24.55, 3.5, 1.5)

  ]
  let lat6 = [
    new BABYLON.Vector3(12.55, 3.5, -1.5),
    new BABYLON.Vector3(24.55, 3.5, -1.5)

  ]
  let lat7 = [
    new BABYLON.Vector3(12.55, 3.5, -4.5),
    new BABYLON.Vector3(24.55, 3.5, -4.5)
  ]

  let lat8 = [
    new BABYLON.Vector3(12.55, 3.5, -7.5),
    new BABYLON.Vector3(24.55, 3.5, -7.5)
  ]
  let lat9 = [
    new BABYLON.Vector3(12.55, 3.5, -10.5),
    new BABYLON.Vector3(24.55, 3.5, -10.5)

  ]
  let lat10 = [
    new BABYLON.Vector3(12.55, 3.5, -13.5),
    new BABYLON.Vector3(24.55, 3.5, -13.5)

  ]


  BABYLON.MeshBuilder.CreateLines("long1", { points: long1 }, scene);
  BABYLON.MeshBuilder.CreateLines("long2", { points: long2 }, scene);
  BABYLON.MeshBuilder.CreateLines("long3", { points: long3 }, scene);
  BABYLON.MeshBuilder.CreateLines("long4", { points: long4 }, scene);
  BABYLON.MeshBuilder.CreateLines("long5", { points: long5 }, scene);

  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat1 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat2 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat3 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat4 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat5 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat6 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat7 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat8 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat9 }, scene);
  BABYLON.MeshBuilder.CreateLines("lat1", { points: lat10 }, scene);

}