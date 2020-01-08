import * as BABYLON from '@babylonjs/core';
import { BASE_RADIUS, BASE_ZONE, TERRAIN_MESH_NAME } from './constants.js'


function makeMortar(name, colors, scene) {

    var mat = new BABYLON.StandardMaterial(name + "_mat", scene)
    mat.diffuseColor = colors.diffuseColor

    var mesh = BABYLON.MeshBuilder.CreateSphere(name, scene);
    mesh.material = mat;
    mesh.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);

    return mesh
}


export function addRedMortar(name, scene) {

    let colors = {
        diffuseColor: new BABYLON.Color3(1.0, 0.35, 0.3),
    }

    let mesh = makeMortar(name, colors, scene)
    return mesh

}



function makeAgent(name, colors, position, scene) {

    var mat = new BABYLON.StandardMaterial(name + "_mat", scene)
    mat.alpha = 1.0
    mat.diffuseColor = colors.diffuseColor

    var triPyramid = getAgentVerts()

    var mesh = BABYLON.MeshBuilder.CreatePolyhedron(name, { custom: triPyramid }, scene);
    mesh.material = mat;

    // add flag as child
    let flag = makeFlag(name, colors.diffuseColor, scene)
    flag.scaling = new BABYLON.Vector3(.7,.4,.7)
    flag.position = new BABYLON.Vector3(-0.2,3.2,0)
    flag.setEnabled(false)  // turn on when agent has the flag
    mesh.addChild(flag)


    mesh.scaling = new BABYLON.Vector3(0.15, 0.1, 0.15);
    mesh.position = position
    mesh.rotate(BABYLON.Axis.Y, -Math.PI / 2, BABYLON.Space.LOCAL)

    // Create a particle system
    //var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    var particleSystem = new BABYLON.GPUParticleSystem(name + "_particles", { capacity: 2000 }, scene);
    particleSystem.particleTexture = new BABYLON.Texture("Textures/flare.png", scene);
    particleSystem.emitter = mesh;
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.2;
    particleSystem.addSizeGradient(0, 0.05);
    particleSystem.addSizeGradient(1.0, 0.7);
    particleSystem.color1 = colors.particles_color1
    particleSystem.color2 = colors.particles_color2
    particleSystem.colorDead = colors.particles_colorDead
    particleSystem.emitRate = 55;
    particleSystem.direction1 = new BABYLON.Vector3(-1, 1, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 5, 0);
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 6;
    particleSystem.gravity = new BABYLON.Vector3(0, -6.81, 0);
    particleSystem.addVelocityGradient(0, 0.5);
    particleSystem.addVelocityGradient(1.0, 3);
    

    particleSystem.start();

    return mesh


}

function getUpsideDownPyramidVerts() {

    var usdp = {
        "name": "usdp", "category": ["Polyhedra"], "vertex": [
            [.5, 1, .5], [-.5, 1, .5], [-.5, 1, -.5], [.5, 1, -.5], [0, 0, 0]
        ],
        "face": [
            [3,2,1,0], [0,4,3], [2,3,4], [4,1,2], [4,0,1]
        ]
    };

    return usdp
}

function getAgentVerts() {

    var triPyramid = {
        "name": "tripy", "category": ["Polyhedra"], "vertex": [
            [-1, 3, -1], [0, 3, -1], [1.5, 3, 0], [0, 3, 1], [-1, 3, 1], [0, 0, 0]
        ],
        "face": [
            [4, 3, 2, 1, 0], [2, 3, 5], [5, 3, 4], [5, 4, 0], [0, 1, 5], [1, 2, 5]
        ]
    };

    return triPyramid
}

function makeFlag(name, color, scene) {  

    var flagMat = new BABYLON.StandardMaterial("flagmat", scene);
    flagMat.diffuseColor = color
    var texture = new BABYLON.Texture("Textures/flag.png", scene); 
    flagMat.diffuseTexture = texture
    flagMat.emissiveTexture = texture

    //  Put a texture on the Y face
    var faceUV = new Array(3);
    faceUV[0] = new BABYLON.Vector4(0, 0, 0, 0);
    faceUV[1] = new BABYLON.Vector4(0, 0, 0, 0);
    faceUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    let options = {
        diameter: 2, 
        tessellation: 16,
        faceUV: faceUV
    }

    var mesh = BABYLON.MeshBuilder.CreateCylinder(name + "_hasflag", options, scene);
    mesh.material = flagMat   

    return mesh

}


function makeCyl(fenceColor, name, scene) {

	var mat = new BABYLON.StandardMaterial(name + "_fence_mat", scene);
    mat.diffuseColor = fenceColor;
    mat.emissiveColor = new BABYLON.Color3(0,0,0)
    mat.backFaceCulling = false;
    
    var faceColors = []
    faceColors[0] = new BABYLON.Color4(1,0,0,0);
    faceColors[1] = new BABYLON.Color4(1,1,1,0.5);
    faceColors[2] = new BABYLON.Color4(0,0,1,0);

    var cyl = BABYLON.MeshBuilder.CreateCylinder("fence", 
        {diameter: 2* BASE_RADIUS, height: 1, tessellation: 32, 
         faceColors: faceColors, scene});

    cyl.hasVertexAlpha = true
    cyl.material = mat

    return cyl
}


function makeBase(name, colors, scene) {

    var mat = new BABYLON.StandardMaterial(name + "_mat", scene)
    mat.alpha = 1.0
    mat.diffuseColor = colors.diffuseColor
    mat.emissiveColor = colors.emissiveColor

    var usdp = getUpsideDownPyramidVerts()

    var mesh = BABYLON.MeshBuilder.CreatePolyhedron(name, { custom: usdp }, scene);
    mesh.material = mat;
    mesh.scaling = new BABYLON.Vector3(1,1,1);

    let flag = makeFlag(name, mat.diffuseColor, scene)
    flag.position.y = 1
    flag.scaling = new BABYLON.Vector3(.45,.1,.45);
    mesh.addChild(flag)

    return mesh
    
}

export function addRedAgent(scene) {

    let name = "red_agent"
    let colors = {
        diffuseColor: new BABYLON.Color3(1.0, 0.35, 0.3),
        particles_color1: new BABYLON.Color4(1, 0.7, .6, 1.0),
        particles_color2: new BABYLON.Color4(1, 0.4, .1, 1.0),
        particles_colorDead: new BABYLON.Color4(0.2, 0, 0.0, 0.0)
    }
    let position = new BABYLON.Vector3(-10, 4, 0)

    makeAgent(name, colors, position, scene)

}

export function addBlueAgent(scene) {

    let name = "blue_agent"
    let colors = {
        diffuseColor: new BABYLON.Color3(0.3, 0.35, 1),
        particles_color1: new BABYLON.Color4(0.6, 0.7, 1.0, 1.0),
        particles_color2: new BABYLON.Color4(0.1, 0.4, 1.0, 1.0),
        particles_colorDead: new BABYLON.Color4(0, 0, 0.2, 0.0)
    }
    let position = new BABYLON.Vector3(10, 3.2, 0)

    makeAgent(name, colors, position, scene)

}

export function addGreenAgent(scene) {

    let name = "green_agent"
    let colors = {
        diffuseColor: new BABYLON.Color3(0.8, 0.85, 0.8),
        particles_color1: new BABYLON.Color4(0.6, 0.6, 0.55, 1.0),
        particles_color2: new BABYLON.Color4(0.4, 0.45, 0.1, 1.0),
        particles_colorDead: new BABYLON.Color4(0.1, 0.2, 0.0, 0.0)
    }
    let position = new BABYLON.Vector3(0, 3.5, -5)

    let mesh = makeAgent(name, colors, position, scene)

    mesh.setEnabled(false)

}



// Flag base for capture-the-flag
export function addBlueBase(scene) {

    let name = "blue_base"
    let colors = {
        diffuseColor: new BABYLON.Color3(0.0, 0.0, 1),
        emissiveColor: new BABYLON.Color3(0,0,0.1)
    }
    
    let base = makeBase(name, colors, scene)

    let fenceColor = new BABYLON.Color3(0,0,1)
    let fence = makeCyl(fenceColor, name, scene)
    fence.position.y = 0.1
    base.addChild(fence)


    let position = new BABYLON.Vector3(22,3.0,0)
    base.position = position

    let baseXZ = new BABYLON.Vector2(base.position.x, base.position.z)

    return baseXZ

}

// Flag base for capture-the-flag
export function addRedBase(scene) {

    let name = "red_base"
    let colors = {
        diffuseColor: new BABYLON.Color3(1, 0, 0),
        emissiveColor: new BABYLON.Color3(0.1, 0, 0)
    }
    
    let base = makeBase(name, colors, scene)

    let fenceColor = new BABYLON.Color3(1,0,0)
    let fence = makeCyl(fenceColor, name, scene)
    fence.position.y = 0.2
    base.addChild(fence)


    let position = new BABYLON.Vector3(-22,3.9,0)
    base.position = position

    let baseXZ = new BABYLON.Vector2(base.position.x, base.position.z)

    return baseXZ

}


export function addTower(scene) {


    var tower = BABYLON.MeshBuilder.CreateBox("tower", { width: 1, height: 2, depth: 1}, scene);
    var mat = new BABYLON.StandardMaterial("towermat", scene);
    mat.alpha = 1.0;
    mat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    tower.material = mat

    let flag = makeFlag("tower_flag", scene)
    tower.addChild(flag)
    flag.position = new BABYLON.Vector3(0, 1.025, 0);
    tower.scaling = new BABYLON.Vector3(1, 1.5, 1);
    tower.position = new BABYLON.Vector3(10, 3.5, 12);

    let towerXZ = new BABYLON.Vector2(tower.position.x, tower.position.z)

    return towerXZ
    

}

export function changeBaseColor( baseName, makeLit, scene ) {

    switch (baseName) {

        case 'blue':
            if (makeLit)
                lightUpBlueBase(scene)
            else 
                unlightBlueBase(scene)
            break

        case 'red':
            if (makeLit)
                lightUpRedBase(scene)
            else 
                unlightRedBase(scene)
            break
        
        default:
            console.log('Error in changeBaseColor')

    }
}

function lightUpBlueBase(scene) {

    let bbmat = scene.getMaterialByName("blue_base_mat")
    bbmat.emissiveColor = new BABYLON.Color3(0.6,0.6,1)
    
    let cylmat = scene.getMaterialByName("blue_base_fence_mat")
    cylmat.emissiveColor = new BABYLON.Color3(0.6,0.6,1)
   
}

function unlightBlueBase(scene) {

    let bbmat = scene.getMaterialByName("blue_base_mat")
    bbmat.emissiveColor = new BABYLON.Color3(0,0,0.1)
    
    let cylmat = scene.getMaterialByName("blue_base_fence_mat")
    cylmat.emissiveColor = new BABYLON.Color3(0,0,0) 
    
}

function lightUpRedBase(scene) {

    let rbmat = scene.getMaterialByName("red_base_mat")
    rbmat.emissiveColor = new BABYLON.Color3(1,0.6,0.6)
    
    let cylmat = scene.getMaterialByName("red_base_fence_mat")
    cylmat.emissiveColor = new BABYLON.Color3(1,0.6,0.6)
   
}


function unlightRedBase(scene) {

    let rbmat = scene.getMaterialByName("red_base_mat")
    rbmat.emissiveColor = new BABYLON.Color3(0.1,0,0)
    
    let cylmat = scene.getMaterialByName("red_base_fence_mat")
    cylmat.emissiveColor = new BABYLON.Color3(0,0,0)     
}


export function relocateBase(scene, baseName) {

    let bpos = new BABYLON.Vector3(0,0,0)
    

    // Pick an xz location at random
    switch (baseName) {
        case 'blue_base':
            bpos.x = BASE_ZONE.blue.xMin + 
                ((BASE_ZONE.blue.xMax - BASE_ZONE.blue.xMin) * Math.random())
            bpos.z = BASE_ZONE.blue.zMin +
                ((BASE_ZONE.blue.zMax - BASE_ZONE.blue.zMin) * Math.random())
        break

        case 'red_base':
            bpos.x = BASE_ZONE.red.xMin + 
                ((BASE_ZONE.red.xMax - BASE_ZONE.red.xMin) * Math.random())
            bpos.z = BASE_ZONE.blue.zMin +
                ((BASE_ZONE.blue.zMax - BASE_ZONE.blue.zMin) * Math.random())
        break
    
        default:
            console.log('error in relocateBase')
    }

    // Adjust y location based on terrain
   // Casting a ray to get height
    let terrainMesh = scene.getMeshByName(TERRAIN_MESH_NAME)
    let baseMesh = scene.getMeshByName(baseName);

    var ray = new BABYLON.Ray(new BABYLON.Vector3(bpos.x,
        terrainMesh.getBoundingInfo().boundingBox.maximumWorld.y + 1,
        bpos.z), new BABYLON.Vector3(0, -1, 0)); // Direction

    var worldInverse = new BABYLON.Matrix();

    terrainMesh.getWorldMatrix().invertToRef(worldInverse);

    ray = BABYLON.Ray.Transform(ray, worldInverse);

    var pickInfo = terrainMesh.intersects(ray);

    if (pickInfo.hit) // put the base on the ground
        bpos.y = pickInfo.pickedPoint.y - 0.01

    baseMesh.position = bpos
    return bpos

}