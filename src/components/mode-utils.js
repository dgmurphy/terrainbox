/* 
    Mode utils *
*/
import * as BABYLON from '@babylonjs/core';
import { getXZRange, getXZpos } from './utils.js'
import { changeBaseColor, relocateBase } from './agent.js'
import { BASE_RADIUS, RADAR_RADIUS, phases, hotgrid, FIELD_EXTENTS,
    edge, GUTTER_WIDTH } from './constants.js'


export function setModeInputs( agentInfoBlue, agentInfoRed, scene ) {

    // ----------------------- Update blue ---------------------------
    inFlagZone( agentInfoBlue )
    flagFoundOrCaptured ( agentInfoBlue )
    nearEdge( agentInfoBlue )

    // phase update
    if (agentInfoBlue.flagCaptured) {
        agentInfoBlue.phase = phases.RETURN_TO_BASE
        scene.getMeshByName('blue_agent_hasflag').setEnabled(true)
        scene.getMeshByName('red_base_hasflag').setEnabled(false)
        changeBaseColor('red', false, scene)  // make base unlit
    }
    else if (agentInfoBlue.flagFound) {
        agentInfoBlue.phase = phases.CAPTURE_FLAG
        changeBaseColor('red', true, scene)  // make base lit

    } else if (agentInfoBlue.inFlagZone)
        agentInfoBlue.phase = phases.LOCATE_FLAG
    else 
        agentInfoBlue.phase = phases.SEEK_FLAG_ZONE

    // When I reach home with the flag:
    if ( (agentInfoBlue.phase === phases.RETURN_TO_BASE) &&
          reachedHome( agentInfoBlue ) ) {

        agentInfoBlue.flagsRetrieved += 1   // update my score
        agentInfoBlue.phase = phases.SEEK_FLAG_ZONE   // get another flag
        agentInfoBlue.inFlagZone = false
        agentInfoBlue.flagFound = false
        agentInfoBlue.flagCaptured = false
        scene.getMeshByName('blue_agent_hasflag').setEnabled(false)
        scene.getMeshByName('red_base_hasflag').setEnabled(true)
        agentInfoBlue.lastRetrievalTime = agentInfoBlue.currentRetrievalTime
        agentInfoBlue.meanRetrievalTime =  agentInfoBlue.meanRetrievalTime + (
                ((agentInfoBlue.currentRetrievalTime - agentInfoBlue.meanRetrievalTime) 
                /agentInfoBlue.flagsRetrieved)
            )
        agentInfoBlue.currentRetrievalTime = 0
        resetHotGrid( agentInfoBlue )

        // move the opp flag
        let redBasePos = relocateBase(scene, 'red_base')
        agentInfoBlue.oppBaseXZ = getXZpos(redBasePos)
        agentInfoRed.myBaseXZ = getXZpos(redBasePos)

    }

    // ----------------------- Update red ---------------------------
    inFlagZone( agentInfoRed )
    flagFoundOrCaptured ( agentInfoRed )
    nearEdge( agentInfoRed )

    // phase update
    if (agentInfoRed.flagCaptured) {
        agentInfoRed.phase = phases.RETURN_TO_BASE 
        scene.getMeshByName('red_agent_hasflag').setEnabled(true)
        scene.getMeshByName('blue_base_hasflag').setEnabled(false)
        // return lit-base to normal color 
        changeBaseColor('blue', false, scene)

    }
    else if (agentInfoRed.flagFound) {
        agentInfoRed.phase = phases.CAPTURE_FLAG
        changeBaseColor('blue', true, scene)
    } else if (agentInfoRed.inFlagZone)
        agentInfoRed.phase = phases.LOCATE_FLAG
    else 
        agentInfoRed.phase = phases.SEEK_FLAG_ZONE

    // When I reach home with the flag:
    if ( (agentInfoRed.phase === phases.RETURN_TO_BASE) &&
          reachedHome( agentInfoRed ) ) {

        agentInfoRed.flagsRetrieved += 1   // update my score
        agentInfoRed.phase = phases.SEEK_FLAG_ZONE   // get another flag
        agentInfoRed.inFlagZone = false
        agentInfoRed.flagFound = false
        agentInfoRed.flagCaptured = false
        scene.getMeshByName('red_agent_hasflag').setEnabled(false)
        scene.getMeshByName('blue_base_hasflag').setEnabled(true)
        agentInfoRed.lastRetrievalTime = agentInfoRed.currentRetrievalTime
        agentInfoRed.meanRetrievalTime =  agentInfoRed.meanRetrievalTime + (
                ((agentInfoRed.currentRetrievalTime - agentInfoRed.meanRetrievalTime) 
                /agentInfoRed.flagsRetrieved)
            )
        agentInfoRed.currentRetrievalTime = 0
        resetHotGrid( agentInfoRed )

        // move the opp flag
        let blueBasePos = relocateBase(scene, 'blue_base')
        agentInfoRed.oppBaseXZ = getXZpos(blueBasePos)
        agentInfoBlue.myBaseXZ = getXZpos(blueBasePos)


    }


}


function flagFoundOrCaptured( agentInfo ) {
     
    let rangeToFlag = getXZRange(agentInfo.pos, agentInfo.oppBaseXZ)
    
    if (rangeToFlag < RADAR_RADIUS)
        agentInfo.flagFound = true
    
    if (rangeToFlag < BASE_RADIUS)
        agentInfo.flagCaptured = true

}

function reachedHome( agentInfo ) {

    let rangeToHome = getXZRange(agentInfo.pos, agentInfo.myBaseXZ)

    if (rangeToHome < BASE_RADIUS)
        return true
    else
        return false

}

function inFlagZone( agentInfo ) {

    switch( agentInfo.name ) {

        case 'blue_agent':
            if ( agentInfo.pos.x < agentInfo.oppGoalLine )
                agentInfo.inFlagZone = true
            else
                agentInfo.inFlagZone = false 
        break

        case 'red_agent':
            if ( agentInfo.pos.x > agentInfo.oppGoalLine )
                agentInfo.inFlagZone = true
            else
                agentInfo.inFlagZone = false 
        break            
    }

        
}

// Keep track of visited grid squares in the flag
//  zone to help agents locate the flag 
export function updateHotGrid( agentInfo ) {

    let pos = agentInfo.pos

    // check if I'm off the hotgrid
    switch(agentInfo.name) {

        case 'red_agent':
            if ( (pos.x > hotgrid.blueBase.XMAX) || 
                 (pos.x < hotgrid.blueBase.XMIN) ||
                 (pos.z > hotgrid.blueBase.ZMAX) ||
                 (pos.z < hotgrid.blueBase.ZMIN) ) {
                     return    // not on grid, don't update it
                 }
            break

        case 'blue_agent':
            if ( (pos.x > hotgrid.redBase.XMAX) || 
                (pos.x < hotgrid.redBase.XMIN) ||
                (pos.z > hotgrid.redBase.ZMAX) ||
                (pos.z < hotgrid.redBase.ZMIN) ) {
                    return    // not on grid, don't update it
            }
            break

        default: 
            console.log("Error in updateHotGrid")
    }
    

    let idx = getHotGridIndex(agentInfo.pos, agentInfo.name)
    agentInfo.hotGrid[idx] += 1

 
}


// return the cell index of the visited cell
function getHotGridIndex(pos, name) {

    let xoff
    let col
    let zoff
    let row
    let idx

    if (name === 'red_agent') {
        xoff = pos.x - hotgrid.blueBase.XMIN
        col = Math.floor(xoff/3)

        zoff = hotgrid.blueBase.ZMAX - pos.z
        row = Math.floor(zoff/3)

        idx = (row * 4) + col
        //console.log("HG RED idx: " + idx)

    } else { // blue agent

        xoff = pos.x - hotgrid.redBase.XMAX
        col = Math.floor(xoff/-3)

        zoff = hotgrid.redBase.ZMAX - pos.z
        row = Math.floor(zoff/3)

        idx = (row * 4) + col
        //console.log("HG BLUE idx: " + idx)


    }
    return idx
}


function resetHotGrid( agentInfo ) {

    let idx
    for (idx = 0; idx < 36; idx++) 
    agentInfo.hotGrid[idx] = 0   

}

function nearEdge( agentInfo ) {

    if (agentInfo.pos.x > (FIELD_EXTENTS.xMax - GUTTER_WIDTH))
        agentInfo.nearEdge = edge.PLUS_X
    else if (agentInfo.pos.x < (FIELD_EXTENTS.xMin + GUTTER_WIDTH))
        agentInfo.nearEdge = edge.MINUS_X
    else if (agentInfo.pos.z > (FIELD_EXTENTS.zMax - GUTTER_WIDTH))
        agentInfo.nearEdge = edge.PLUS_Z
    else if (agentInfo.pos.z < (FIELD_EXTENTS.zMin + GUTTER_WIDTH))
        agentInfo.nearEdge = edge.MINUS_Z
    else 
        agentInfo.nearEdge = edge.NONE

}