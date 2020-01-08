import React, { Component } from 'react';
import { render } from 'react-dom';
import * as BABYLON from '@babylonjs/core';
import './css/App.css';
import '../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css'
import '../node_modules/@blueprintjs/core/lib/css/blueprint.css'
import autobind from 'react-autobind';
import Viewer from './components/viewer'; 
import ControlPanel from './components/control-panel';
import { addPicker, removePicker } from './components/picker';
import { addAgentDriveControls } from './components/manual-controller.js'
import { getXZRange } from './components/utils.js'
import { phases } from './components/constants.js'
import { addMortarListener } from './components/mortars.js'

class Root extends Component {

  constructor(props) {

    super(props);
    autobind(this);

    this.state = {
      // blue
      velocityBlue: 0,
      headingBlue: 0,
      rangeToFlagBlue: 0,
      rangeToBaseBlue: 0,
      phaseBlue: phases.SEEK_FLAG_ZONE,
      flagsRetrievedBlue: 0,
      currentRetrievalTimeBlue: 0,
      lastRetrievalTimeBlue: 0,
      meanRetrievalTimeBlue: 0,

      // red
      velocityRed: 0,
      headingRed: 0,
      rangeToFlagRed: 0,
      rangeToBaseRed: 0,
      phaseRed: phases.SEEK_FLAG_ZONE,
      flagsRetrievedRed: 0,
      currentRetrievalTimeRed: 0,
      lastRetrievalTimeRed: 0,
      meanRetrievalTimeRed: 0,


      // green
      velocityGreen: 0,
      headingGreen: 0,
      rangeGreenToBlueBase: 0,
      rangeGreenToRedBase: 0,

      usePickNormals: false,
      botSwitchDisabled: true,
      botsEnabled: false,
      manualAgent: false,
      whichManual: "green_agent",
      panelHidden: false,
      debug: false,
      elapsedFrames: 0

    };

    // TODO shouldnt autobind take care of this?
    this.handleUpdateSwitches = this.handleUpdateSwitches.bind(this)
    this.handleHidePanel = this.handleHidePanel.bind(this)
    this.handleUpdateGUIinfo = this.handleUpdateGUIinfo.bind(this)
    this.handleTerrainLoaded = this.handleTerrainLoaded.bind(this)
    this.handleWhichManual = this.handleWhichManual.bind(this)

  }


  setScene(scene) {
    this.scene = scene
  }


  // change the agent that is keyboard driven
  handleWhichManual(value) {

    this.setState({whichManual: value})

    this.scene.onBeforeRenderObservable.remove(this.driveControlObs)

    this.driveControlObs = addAgentDriveControls(value, 
      this.scene, this.handleUpdateGUIinfo)

  }


  handleUpdateSwitches(whichMarker, value) {

    switch (whichMarker) {

      case 'pickcontrol':
        this.setState({ usePickNormals: value });
        if (value) {
          addPicker(this.scene)
        } else {
          removePicker(this.scene)
        }
        //console.log(whichMarker + " : " + value)
        break;

      case 'botcontrol':
        this.setState({ botsEnabled: value })
        break;

      case 'manualagent':
        this.setState({ manualAgent: value })
        let agentMesh =  this.scene.getMeshByName('green_agent')
        agentMesh.setEnabled(value)
          
        break;

      default:
        console.log("Error in switch toggle");
        break;
    }
  }


  handleTerrainLoaded() {

    // Once bots are loaded, enable run-bots switch
    this.setState({ botSwitchDisabled: false })

    // Enable or disable the green agent based on initial state setting
    let agentMesh =  this.scene.getMeshByName('green_agent')
    agentMesh.setEnabled(this.state.manualAgent)

    // store the base locations
    let base = this.scene.getMeshByName('blue_base')
    this.blueBaseXZ = new BABYLON.Vector2(base.position.x, base.position.z)
    base = this.scene.getMeshByName('red_base')
    this.redBaseXZ = new BABYLON.Vector2(base.position.x, base.position.z)

    // add drive controls to the manually controlleg agent
    this.driveControlObs = addAgentDriveControls(this.state.whichManual, 
      this.scene, this.handleUpdateGUIinfo)

    // Add mortar controls
    addMortarListener(this.scene)

  }


  handleHidePanel() {

    this.setState({ 
        panelHidden: true,
        debug: true})
  }

  
  handleUpdateGUIinfo(info) {

    const entries = Object.entries(info)

    for (const [whichAgent, agentData] of entries) {
      
      switch(whichAgent) {

        case 'blueAgent':
            this.setState({
              velocityBlue: agentData.vel,
              headingBlue: agentData.heading,
              phaseBlue: agentData.phase,
              rangeToFlagBlue: getXZRange(agentData.pos, this.redBaseXZ),
              rangeToBaseBlue: getXZRange(agentData.pos, this.blueBaseXZ),
              flagsRetrievedBlue: agentData.flagsRetrieved,
              currentRetrievalTimeBlue: agentData.currentRetrievalTime,
              lastRetrievalTimeBlue: agentData.lastRetrievalTime,
              meanRetrievalTimeBlue: agentData.meanRetrievalTime
            })
            break;    

        case 'redAgent':
            this.setState({
              velocityRed: agentData.vel,
              headingRed: agentData.heading,
              phaseRed: agentData.phase,
              rangeToFlagRed: getXZRange(agentData.pos, this.blueBaseXZ),
              rangeToBaseRed: getXZRange(agentData.pos, this.redBaseXZ),
              flagsRetrievedRed: agentData.flagsRetrieved,
              currentRetrievalTimeRed: agentData.currentRetrievalTime,
              lastRetrievalTimeRed: agentData.lastRetrievalTime,
              meanRetrievalTimeRed: agentData.meanRetrievalTime

            })
            break; 

        case 'greenAgent':
            this.setState({
              velocityGreen: agentData.vel,
              headingGreen: agentData.heading,
              rangeGreenToBlueBase: getXZRange(agentData.pos, this.blueBaseXZ),
              rangeGreenToRedBase: getXZRange(agentData.pos, this.redBaseXZ)
            })
            break;     


      } //switch

    } // for

  }


  componentDidMount() {

    // Drop loading graphics
    const lg = document.getElementById('loading-graphics');
    if(lg) {
      lg.outerHTML = '';
    }

    document.getElementsByTagName('canvas')[0].focus()
  }


  render() {

      // DEBUG
      if (this.state.debug)
        if (this.scene)
          this.scene.debugLayer.show({overlay: true});

      let guiInfo = {
        velocityBlue: this.state.velocityBlue,
        headingBlue: this.state.headingBlue,
        rangeToFlagBlue: this.state.rangeToFlagBlue,
        rangeToBaseBlue: this.state.rangeToBaseBlue,
        phaseBlue: this.state.phaseBlue,
        flagsRetrievedBlue: this.state.flagsRetrievedBlue,
        currentRetrievalTimeBlue: this.state.currentRetrievalTimeBlue,
        lastRetrievalTimeBlue: this.state.lastRetrievalTimeBlue,
        meanRetrievalTimeBlue: this.state.meanRetrievalTimeBlue,
        velocityRed: this.state.velocityRed,
        headingRed: this.state.headingRed,
        rangeToFlagRed: this.state.rangeToFlagRed,
        rangeToBaseRed: this.state.rangeToBaseRed,
        phaseRed: this.state.phaseRed,
        flagsRetrievedRed: this.state.flagsRetrievedRed,
        currentRetrievalTimeRed: this.state.currentRetrievalTimeRed,
        lastRetrievalTimeRed: this.state.lastRetrievalTimeRed,
        meanRetrievalTimeRed: this.state.meanRetrievalTimeRed,
        velocityGreen: this.state.velocityGreen,
        headingGreen: this.state.headingGreen,
        rangeGreenToBlueBase: this.state.rangeGreenToBlueBase,
        rangeGreenToRedBase: this.state.rangeGreenToRedBase
      }


      return (
        <div className="App">
          <ControlPanel 
            usePickNormals={this.state.usePickNormals}
            botsEnabled = {this.state.botsEnabled}
            updateSwitches={this.handleUpdateSwitches}  
            guiInfo={guiInfo}    
            botSwitchDisabled = {this.state.botSwitchDisabled}
            panelHidden= {this.state.panelHidden}
            handleHidePanel = {this.handleHidePanel}
            manualAgent = {this.state.manualAgent}
            whichManual = {this.state.whichManual}
            updateWhichManual = {this.handleWhichManual}
          />
          <Viewer 
            botsEnabled = {this.state.botsEnabled}
            setScene = {this.setScene}
            handleUpdateGUIinfo = {this.handleUpdateGUIinfo}  
            handleTerrainLoaded = {this.handleTerrainLoaded} 
            whichManual = {this.state.whichManual}
          />
        </div>
      );
    } 
}

render(<Root />, document.body.appendChild(document.createElement('div')));
export default Root;
