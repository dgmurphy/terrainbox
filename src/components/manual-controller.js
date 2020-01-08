import * as BABYLON from '@babylonjs/core';
import { drive, castRayForHeight } from './controllers.js'
import { FRAMETHRESH_GUI, VEL_COEFF, AGENT_SPEED,
         TERRAIN_MESH_NAME} from './constants.js'




export function addAgentDriveControls(agentName, scene, handleUpdateGUIinfo) {

    let driveIncrement = AGENT_SPEED  // TODO GUI Control
    let dh = 4.0  // Turn speek sensitivity TODO GUI Control
    
    // Keyboard events
    var inputMap = {};

    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyDownTrigger, 
            function (evt) { inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";}
        )
    );

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyUpTrigger, 
            function (evt) {inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";}
        )
    );

    var terrainMesh = scene.getMeshByName(TERRAIN_MESH_NAME)

    let meshes = {
        agent: scene.getMeshByName(agentName),
        particles: scene.getParticleSystemByID(agentName + '_particles')
    }

    // TODO: fix this so that it accepts the current agent data
     // Agent dynamic info
    let agentInfo = {
        name: agentName,
        heading: 90,
        pos: meshes.agent.position,
        vel: 0,
        norm: new BABYLON.Vector3(0, 1, 0),
        steeringMode: { dir: 'straight', weight: 1.0 },
        phase: 'Seek Flag Zone', // from here down -> just to prevent NPEs...
        inFlagZone: false,
        flagFound: false,
        flagCaptured: false,
        myGoalLine: 0,
        oppGoalLine: 0,
        myBaseXZ: new BABYLON.Vector2(0,0),
        oppBaseXZ: new BABYLON.Vector2(0,0),
        flagsRetrieved: 0,
        currentRetrievalTime: 0,
        lastRetrievalTime: 0,
        meanRetrievalTime:0

    }   

    let blueBasePos = scene.getMeshByName('blue_base').position
    let redBasePos = scene.getMeshByName('red_base').position
    let baseLocations = {
        blueXZ: new BABYLON.Vector2(blueBasePos.x, blueBasePos.z),
        redXZ: new BABYLON.Vector2(redBasePos.x, redBasePos.z)
    }

    // Do the pre-loop GUI update
    let agentInfoKey = agentName.substring(0, agentName.indexOf('_')) + "Agent"
    let guiInfo = {
        [agentInfoKey]: agentInfo
    }

    //updateGUIinfo(guiInfo, baseLocations, handleUpdateGUIinfo)
    handleUpdateGUIinfo(guiInfo)

    let frameCounter = 0
    let prevPos = agentInfo.pos

    // *****************  Game/Render loop *******************************
    let manualObs = scene.onBeforeRenderObservable.add(() => {

        if (!meshes.agent.isEnabled())
            return

        frameCounter += 1  
    
        if (inputMap["w"] || inputMap["ArrowUp"]) {

            driveAgent(driveIncrement, agentInfo, meshes, terrainMesh)

        }

        if (inputMap["a"] || inputMap["ArrowLeft"]) {

            agentInfo.heading += dh;

            if (agentInfo.heading > 180) {
                agentInfo.heading = -179
            }

            driveAgent(0.0, agentInfo, meshes, terrainMesh)

        }

        if (inputMap["d"] || inputMap["ArrowRight"]) {

            agentInfo.heading -= dh;

            if (agentInfo.heading < -180) {
                agentInfo.heading = 179
            }

            driveAgent(0.0, agentInfo, meshes, terrainMesh)

        }

        // DISABLE REVERSE
        // if(inputMap["s"] || inputMap["ArrowDown"]){
        // } 

        // DOM update is performance hit
        if (frameCounter === FRAMETHRESH_GUI) {

            let deltas = BABYLON.Vector3.Distance(agentInfo.pos, prevPos)

            prevPos = agentInfo.pos

            agentInfo.vel = deltas * VEL_COEFF

            guiInfo[agentInfoKey] = agentInfo

            //updateGUIinfo(guiInfo, baseLocations, handleUpdateGUIinfo)
            handleUpdateGUIinfo(guiInfo)

            frameCounter = 0
            
        }

    })  // ************* Game/Render loop done *************************
    
    return manualObs
}


// Heading has already been updated - just move agent forward
export function driveAgent(increment, agentInfo, agentMeshes, terrainMesh) {

    agentInfo.pos = drive(increment, agentInfo, agentMeshes)

    // update the Y component
    agentInfo.norm = castRayForHeight(agentMeshes.agent, terrainMesh, 
        agentInfo.heading)


}
