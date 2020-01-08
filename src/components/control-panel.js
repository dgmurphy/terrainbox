import React, { Component } from 'react'
import { Switch, Button, Radio, RadioGroup } from "@blueprintjs/core"
import InfoBox from './info-box'

class ControlPanel extends Component {

    constructor(props) {
  
      super(props);

      this.hidePanel = this.hidePanel.bind(this)
      this.handleManualChange = this.handleManualChange.bind(this)
  
    }

    handleSwitch(e) {

        e.currentTarget.blur();  // fix for outline being drawn in chrome
        // tell the parent the new selector state
        this.props.updateSwitches(e.currentTarget.name, e.currentTarget.checked);
      }
    

    handleManualChange(e) {
      e.currentTarget.blur()
      this.props.updateWhichManual( e.currentTarget.value )
    }


    hidePanel() {
      this.props.handleHidePanel()
    }

    render() {

      let panelClass = 'cpanel-visible'
      if (this.props.panelHidden)
        panelClass = 'cpanel-hide'
        
          
        return (
            <div className="App">
              <div id="control-panel" className={panelClass}>
                <div className="app-title">
                  <h3 style={{marginTop:'10px'}}>
                    Mesh Render Test &nbsp;&nbsp;
                    <Button icon="cross" minimal={true} onClick={this.hidePanel}/>  
                  </h3>
                </div>
                <div className="panelSwitch">
                  <Switch disabled={this.props.botSwitchDisabled} 
                    checked={this.props.botsEnabled}
                    label="Run blue/red bots"
                    name="botcontrol"
                    onChange={this.handleSwitch.bind(this)}
                  />
                </div>
                <div className="panelSwitch">
                  <Switch checked={this.props.manualAgent}
                    label="Enable grey agent"
                    name="manualagent"
                    onChange={this.handleSwitch.bind(this)}
                  />
                </div>
                <div className="panelSwitch">
                    <Switch checked={this.props.usePickNormals}
                    label="Normals picker"
                    name="pickcontrol"
                    onChange={this.handleSwitch.bind(this)}
                    />
                </div>
                <div className="agentRadio">
                  <RadioGroup inline={true}
                    label ="Manual control:"
                    name="agentgroup"
                    onChange={this.handleManualChange}
                    selectedValue={this.props.whichManual}
                  >
                    <Radio {...this.state} label="Grey" value="green_agent" />
                    <Radio {...this.state} label="Blue" value="blue_agent" />
                    <Radio {...this.state} label="Red" value="red_agent" />
                  </RadioGroup>
                </div>
                <InfoBox guiInfo={this.props.guiInfo}/>

              </div>
            </div>
        );
    }


}

export default ControlPanel;