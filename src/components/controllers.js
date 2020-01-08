import * as BABYLON from '@babylonjs/core';
import { getAngle, getXZRange } from './utils.js'
import { FRAMETHRESH_GUI, VEL_COEFF, FIELD_EXTENTS, 
    RED_GOAL_LINE, BLUE_GOAL_LINE, phases, edge, AGENT_SPEED,
    TERRAIN_MESH_NAME } from './constants.js'
import { randomSteerMotivator, seekFlagZoneMotivator, locateFlagMotivator,
         captureFlagMotivator, returnToBaseMotivator, 
         avoidEdgeMotivator } from './steering-motivators.js'
import { setModeInputs, updateHotGrid } from './mode-utils.js'
import { updateMortars } from './mortars.js'


// Animate agent in an event loop
export function startAgentAnim(scene, handleUpdateGUIinfo, areBotsEnabled) {

    // Object meshes
    let terrainMesh = scene.getMeshByName(TERRAIN_MESH_NAME);

    let blueMeshes = {
        agent: scene.getMeshByName('blue_agent'),
        particles: scene.getParticleSystemByID('blue_agent_particles'),
        base: scene.getMeshByName('blue_base')
    }

    let redMeshes = {
        agent: scene.getMeshByName('red_agent'),
        particles: scene.getParticleSystemByID('red_agent_particles'),
        base: scene.getMeshByName('red_base'),
    }

    /* Initialize the 'hot grids' used for base-finding */
    let hotGridRed = new Array(36)
    let hotGridBlue = new Array(36)
    let idx
    for (idx = 0; idx < 36; idx++) {
        hotGridRed[idx] = 0
        hotGridBlue[idx] = 0
    }

    /* 
     Agent dynamic info:
        phase: Seek Flag Zone | Locate Flag | Capture Flag | Return to Base  
           (phase is for GUI purposes only)
        steeringMode: { dir: left | right | straight, weight: [num]}
    */
    let agentInfoBlue = {
        name: 'blue_agent',
        phase: 'Seek Flag Zone',
        inFlagZone: false,
        flagFound: false,
        flagCaptured: false,
        heading: 180,
        pos: blueMeshes.agent.position,
        vel: 0,
        norm: new BABYLON.Vector3(0, 1, 0),
        steeringMode: { dir: 'straight', weight: 1.0 }, 
        myGoalLine: BLUE_GOAL_LINE,
        oppGoalLine: RED_GOAL_LINE,
        myBaseXZ: new BABYLON.Vector2(blueMeshes.base.position.x, blueMeshes.base.position.z),
        oppBaseXZ: new BABYLON.Vector2(redMeshes.base.position.x, redMeshes.base.position.z),
        flagsRetrieved: 0,
        currentRetrievalTime: 0,
        lastRetrievalTime: 0,
        meanRetrievalTime:0,
        hotGrid: hotGridBlue,
        gridTargetIdx: Math.floor(Math.random() * 36),  // destination cell in hot grid
        nearEdge: edge.NONE   // which edge am I near?
    }

    let agentInfoRed = {
        name: 'red_agent',
        phase: 'Seek Flag Zone',
        inFlagZone: false,
        flagFound: false,
        flagCaptured: false,
        heading: 0,
        pos: redMeshes.agent.position,
        vel: 0,
        norm: new BABYLON.Vector3(0, 1, 0),
        steeringMode: { dir: 'straight', weight: 1.0 },
        myGoalLine: RED_GOAL_LINE,
        oppGoalLine: BLUE_GOAL_LINE,
        myBaseXZ: new BABYLON.Vector2(redMeshes.base.position.x, redMeshes.base.position.z),
        oppBaseXZ: new BABYLON.Vector2(blueMeshes.base.position.x, blueMeshes.base.position.z),
        flagsRetrieved: 0,
        currentRetrievalTime: 0,
        lastRetrievalTime: 0,
        meanRetrievalTime:0,
        hotGrid: hotGridRed,
        gridTargetIdx: Math.floor(Math.random() * 36),
        nearEdge: edge.NONE

    }
   
    blueMeshes.agent.rotate(BABYLON.Axis.Y, -(agentInfoBlue.heading - 90) * Math.PI / 180, BABYLON.Space.WORLD)
    redMeshes.agent.rotate(BABYLON.Axis.Y, -(agentInfoBlue.heading + 90) * Math.PI / 180, BABYLON.Space.WORLD)

    let prevPosBlue = agentInfoBlue.pos
    let prevPosRed = agentInfoRed.pos

    // Do the pre-loop GUI update
    let guiInfo = {
        blueAgent: agentInfoBlue,
        redAgent: agentInfoRed,
    }

    let frameCounter = 0
    let modeCheckCounter = 0
    let modeCheckThresh = 10

    //updateBotGUIinfo(guiInfo, handleUpdateGUIinfo)
    handleUpdateGUIinfo(guiInfo)


    // **************   Game/Render loop **************************
    let botObs = scene.onBeforeRenderObservable.add(function () {

        if ( areBotsEnabled() === false )
            return

        // update mortars
        if (scene.mortarArr.length > 0)
            updateMortars(scene)

        // update hot grids
        if (agentInfoRed.phase === phases.LOCATE_FLAG)
            updateHotGrid(agentInfoRed)

        if (agentInfoBlue.phase === phases.LOCATE_FLAG)
            updateHotGrid(agentInfoBlue)

        

        // Check for mode change on interval (higher interval => better perf)
        if (modeCheckCounter === modeCheckThresh) {

            setModeInputs(agentInfoBlue, agentInfoRed, scene)

            agentInfoBlue.steeringMode = steeringPoll(agentInfoBlue)
            agentInfoRed.steeringMode = steeringPoll(agentInfoRed)

            modeCheckCounter = 0
        }

        // Agent Update
        anim(agentInfoBlue, blueMeshes, terrainMesh)
        anim(agentInfoRed, redMeshes, terrainMesh)

        // Record flag capture time
        agentInfoBlue.currentRetrievalTime += 1 
        agentInfoRed.currentRetrievalTime += 1 

        // DOM update is performance hit
        if (frameCounter === FRAMETHRESH_GUI) {

            let deltasBlue = BABYLON.Vector3.Distance(agentInfoBlue.pos, prevPosBlue)
            let deltasRed = BABYLON.Vector3.Distance(agentInfoRed.pos, prevPosRed)

            prevPosBlue = agentInfoBlue.pos
            prevPosRed = agentInfoRed.pos

            // since the number of elapsed frames is always FRAMETHRESH_GUI, the 'velocity'
            //  is just proportional to delta-s
            agentInfoBlue.vel = deltasBlue * VEL_COEFF
            agentInfoRed.vel = deltasRed * VEL_COEFF

            guiInfo.blueAgent = agentInfoBlue
            guiInfo.redAgent = agentInfoRed
        
            //updateBotGUIinfo(guiInfo, handleUpdateGUIinfo)
            handleUpdateGUIinfo(guiInfo)

            frameCounter = 0
    
        }
    
        frameCounter += 1
        modeCheckCounter += 1
       
    })
    // ************** Game/Render loop done ***********************************

    return botObs
}


export function drive(increment, agentInfo, agentMeshes) {

    let r = increment  // distance increment raw
    let agentPos = agentMeshes.agent.position
    let particles = agentMeshes.particles

    // *** Scale the distance increment according to the mesh slope in the heading direction
    // hvecx, hvecz: heading components
    let hvecx = Math.cos(agentInfo.heading * (Math.PI / 180.0))
    let hvecz = Math.sin(agentInfo.heading * (Math.PI / 180.0))
    let hvec = new BABYLON.Vector3(hvecx, 0, hvecz)
    hvec = BABYLON.Vector3.Normalize(hvec)

    // normal to the face at my position
    let nvec = BABYLON.Vector3.Normalize(agentInfo.norm)

    // angle between heading and face normal
    // zero vel if slope > 135 deg, max vel reached at < 45 deg
    let theta = getAngle(hvec, nvec) * 180.0 / Math.PI;

    // The inclineCoeff increaes the delta-s increment when going
    //  downhill, and in decreases it going up hill. A sort of
    // "Velocity" based on slope of terrian.
    let inclineCoeff   // TODO make this GUI configurable

    if (theta < 45)
        inclineCoeff = 1    // steep downhill gets max velocity
    else if (theta > 135)
        inclineCoeff = 0    // > steep uphill completely stopped
    else                    
        inclineCoeff = ((-1 / 90.0) * theta) + 1.5   // linear in between

    // check to make sure its not negative
    if (inclineCoeff < 0) 
        inclineCoeff = 0
    
    // create a distance increment
    let ds = inclineCoeff * r
    //console.log("ds: " + ds)

    // size particle trail
    let particlePower = 100   // TODO GUI control
    particles.maxEmitPower = particlePower * ds

    // Keep the agent inside terrian extents
    let testx = agentPos.x + ds * hvecx

    if ((testx < FIELD_EXTENTS.xMax) && (testx > FIELD_EXTENTS.xMin))
        agentPos.x += (ds * hvecx)

    let testz = agentPos.z + ds * hvecz
    if ((testz < FIELD_EXTENTS.zMax) && (testz > FIELD_EXTENTS.zMin))
        agentPos.z += (ds * hvecz)    

    let pos = new BABYLON.Vector3(agentPos.x, agentMeshes.agent.positionY, agentPos.z)

    return pos
}


export function anim(agentInfo, agentMeshes, terrainMesh) {

    let driveIncrement = AGENT_SPEED  // TODO GUI control

    // Change heading and current turning direction
    if (agentInfo.steeringMode.dir !== 'straight')
        agentInfo.heading = changeHeading(agentInfo.steeringMode.dir, agentInfo.heading)

    agentInfo.pos = drive(driveIncrement, agentInfo, agentMeshes)

    // update the Y component
    agentInfo.norm = castRayForHeight(agentMeshes.agent, terrainMesh, agentInfo.heading)

}



export function castRayForHeight(agentMesh, terrainMesh, heading) {

    let norm;

    // Casting a ray to get height
    var ray = new BABYLON.Ray(new BABYLON.Vector3(agentMesh.position.x,
      terrainMesh.getBoundingInfo().boundingBox.maximumWorld.y + 1,
      agentMesh.position.z), new BABYLON.Vector3(0, -1, 0)); // Direction

    var worldInverse = new BABYLON.Matrix();

    terrainMesh.getWorldMatrix().invertToRef(worldInverse);

    ray = BABYLON.Ray.Transform(ray, worldInverse);

    var pickInfo = terrainMesh.intersects(ray);

    if (pickInfo.hit) {

      // put the agent on the ground
      agentMesh.position.y = pickInfo.pickedPoint.y - 0.01

      // Tilt the model normal to the ground
      norm = pickInfo.getNormal(true)  // Get the normal in World space
      let cross = BABYLON.Vector3.Cross(BABYLON.Axis.Y, norm) // axis perp to Y and face normal
      let theta = getAngle(BABYLON.Axis.Y, norm)  // angle between axis and face normal

      // rotate model around the cross axis to align the model Y with the face normal
      agentMesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(cross, theta);

      // rotate so that front of mesh faces heading direction
      agentMesh.rotate(BABYLON.Axis.Y, -heading * Math.PI / 180, BABYLON.Space.LOCAL)

    }

    return norm

  }


// Turn by delta-h and reset angles if needed
export function changeHeading(dir, heading) {

    let dh = 4.0   // TODO GUI control 'turn sensitivity'

    if (dir === 'left') {
        heading += dh;
        if (heading > 180) {
            heading = -179
        }
    } else {
        heading -= dh;
        if (heading < -180) {
            heading = 179
        }
    }
    return heading

}



// Poll the steering motivators to see if we want
// to change steering mode (left | right | straight).
// High changeDirThresh resists frequent direction
// changes. Low thresh allows frequent changes.
function steeringPoll( agentInfo ) {

    // TODO Is this needed? Maybe just use the mode 
    //   check interval to control this
    let changeDirThresh = 0.2  // TODO GUI control

    let polls = []
    let totals = {left: 0, right: 0, straight: 0}

    // add relevant polls 
    let rsPoll = randomSteerMotivator()
    polls.push(rsPoll)   // always use

    // If I'm near the edge
    if (agentInfo.nearEdge != edge.NONE) {
        let nePoll = avoidEdgeMotivator(agentInfo)
        polls.push(nePoll)
    }

    // add phase-based poll
    let phasePoll
    switch (agentInfo.phase) {

        case phases.RETURN_TO_BASE:
            phasePoll = returnToBaseMotivator(agentInfo) 
            break

        case phases.CAPTURE_FLAG:
            phasePoll = captureFlagMotivator(agentInfo) 
            break

        case phases.LOCATE_FLAG:
            phasePoll = locateFlagMotivator(agentInfo) 
            break

        case phases.SEEK_FLAG_ZONE:
            phasePoll = seekFlagZoneMotivator( agentInfo )
            break
        
        default:

    }

    polls.push(phasePoll)

    // execute polls and tally results
    for (var poll of polls) {
        totals.left += poll.left
        totals.right += poll.right
        totals.straight += poll.straight
    }

    let winner = getPollWinner(totals)

    if ( winner.weight > changeDirThresh )
        return winner    // return (possibly new) steering mode
    else
        return agentInfo.steeringMode   // return old mode unchanged

}

// Return the highest weighted direction (and the weight)
function getPollWinner( poll ) {

    if ((poll.left > poll.right) && (poll.left > poll.straight))
        return { dir: 'left', weight: poll.left }

    if ((poll.right > poll.left) && (poll.right > poll.straight))
        return { dir: 'right', weight: poll.right }

    return { dir: 'straight', weight: poll.straight }
    
}

