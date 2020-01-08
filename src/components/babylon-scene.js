//import * as BABYLON from 'babylonjs';
import React, { Component } from 'react';
import * as BABYLON from '@babylonjs/core';
import { Engine, Scene } from '@babylonjs/core';
import "@babylonjs/loaders"
import { addBlueAgent, addRedAgent, addGreenAgent, addBlueBase, addRedBase } from './agent.js'
import { loadTerrain, addGround } from './terrain.js';
import { addAxes, drawBlueHotGrid } from './utils.js'
import { startAgentAnim } from './controllers.js';



export default class BabylonScene extends Component { 

  constructor(props) {
    super(props);

    this.terrainLoaded = this.terrainLoaded.bind(this)
    this.areBotsEnabled = this.areBotsEnabled.bind(this)
    

  }
  
  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
      this.forceUpdate()
    }
  }

  terrainLoaded() {
    
    this.props.handleTerrainLoaded()
    this.botObs = startAgentAnim(this.scene, this.props.handleUpdateGUIinfo, 
      this.areBotsEnabled)
    
    
  }

  areBotsEnabled() {
    return this.props.botsEnabled
  }

  componentDidMount () {

    this.engine = new Engine(
        this.canvas,
        true,
        this.props.engineOptions,
        this.props.adaptToDeviceRatio
    );

    let scene = new Scene(this.engine);
    this.scene = scene;
    scene.clearColor = new BABYLON.Color3(0.38, 0.36, 0.41);

    // Load objects
    addGround(scene)
    addAxes(scene)
    addBlueAgent(scene)
    addRedAgent(scene)
    addGreenAgent(scene)
    addBlueBase(scene)
    addRedBase(scene)
    //drawBlueHotGrid(scene)
    
    loadTerrain(scene, this.terrainLoaded);
  
    // Call the scene mounter from the Viewer
    if (typeof this.props.onSceneMount === 'function') {
      this.props.onSceneMount({
        scene,
        engine: this.engine,
        canvas: this.canvas
      });
    } else {
      console.error('onSceneMount function not available');
    }

    // Resize the babylon engine when the window is resized
    window.addEventListener('resize', this.onResizeWindow);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResizeWindow);
  }

  onCanvasLoaded = (c) => {
    if (c !== null) {
      this.canvas = c;
    }

    document.getElementsByTagName('canvas')[0].focus()
  }

  render () {
    // 'rest' can contain additional properties that you can flow through to canvas:
    // (id, className, etc.)
    const { width, height } = this.props;

    const opts = {};

    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    } else {
      opts.width = window.innerWidth;
      opts.height = window.innerHeight;
    }


    return (
      <canvas
        {...opts}
        ref={this.onCanvasLoaded}
      />
    )
  }
}