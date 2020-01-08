import React, { Component } from 'react';
import * as BABYLON from '@babylonjs/core';
import BabylonScene from '../components/babylon-scene'; // import the component above linking to file we just created.
import '@babylonjs/gui'
import '@babylonjs/inspector'

export default class Viewer extends Component {


    onSceneMount = (e) => {
        const { canvas, scene, engine } = e;


        // This creates and positions a free camera (non-mesh)
        const camera = new BABYLON.ArcRotateCamera("camera1", 3.15, 1.14, 45, new BABYLON.Vector3(0, 2.5, 0), scene);
        camera.attachControl(canvas, true);
        
        // Constraints
        //camera.lowerRadiusLimit = 0.1;
        //camera.upperRadiusLimit = 100;
        //camera.lowerBetaLimit = 0.1;
        //camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        camera.angularSensibilityY = 5000;
        camera.angularSensibilityX = 5000;
        camera.inertia = .8;
        camera.keysUp = []
        camera.keysDown = []
        camera.keysLeft = []
        camera.keysRight = []

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 1;

        this.props.setScene(scene);
        //document.getElementById('renderCanvas').focus();  

        // init the mortar sources/targets list
        scene.mortarArr = []
        scene.nextMortarId = 1
        
        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });


    }

    render() {               
        return ( 
            <BabylonScene 
            onSceneMount={this.onSceneMount} 
            handleUpdateGUIinfo = {this.props.handleUpdateGUIinfo}
            handleTerrainLoaded = {this.props.handleTerrainLoaded}   
            botsEnabled = { this.props.botsEnabled }
            whichManual = {this.props.whichManual}
            swidth ={900} 
            sheight={700}/>
        )
    }
}