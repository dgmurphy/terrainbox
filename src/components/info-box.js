import React, { Component } from 'react'


class InfoBox extends Component {

    render() {


        let green = {
            vel: this.props.guiInfo.velocityGreen.toFixed(0),
            h: this.props.guiInfo.headingGreen,
            toBlue: this.props.guiInfo.rangeGreenToBlueBase.toFixed(0),
            toRed: this.props.guiInfo.rangeGreenToRedBase.toFixed(0)
        }

        let blue = {
            vel: this.props.guiInfo.velocityBlue.toFixed(0),
            h: this.props.guiInfo.headingBlue,
            toFlag: this.props.guiInfo.rangeToFlagBlue.toFixed(0),
            toBase: this.props.guiInfo.rangeToBaseBlue.toFixed(0),
            phase: this.props.guiInfo.phaseBlue,
            numFlags: this.props.guiInfo.flagsRetrievedBlue,
            currentRetrieval: this.props.guiInfo.currentRetrievalTimeBlue,
            lastRetrieval: this.props.guiInfo.lastRetrievalTimeBlue,
            meanRetrieval: this.props.guiInfo.meanRetrievalTimeBlue.toFixed(0)

        }

        let red = {
            vel: this.props.guiInfo.velocityRed.toFixed(0),
            h: this.props.guiInfo.headingRed,
            toFlag: this.props.guiInfo.rangeToFlagRed.toFixed(0),
            toBase: this.props.guiInfo.rangeToBaseRed.toFixed(0),
            phase: this.props.guiInfo.phaseRed,
            numFlags: this.props.guiInfo.flagsRetrievedRed,
            currentRetrieval: this.props.guiInfo.currentRetrievalTimeRed,
            lastRetrieval: this.props.guiInfo.lastRetrievalTimeRed,
            meanRetrieval: this.props.guiInfo.meanRetrievalTimeRed.toFixed(0)

        }


        return (
            <div className="info-box">

                <p><b>Grey: </b></p>
                <div className = 'info-lines'>
                    <p>Velocity: <span className='values'>{green.vel}</span></p>
                    <p>Heading: <span className='values'>{green.h}</span></p>
                    <p>To Blue Base: <span className='values'>{green.toBlue}  </span>
                    &nbsp;&nbsp;Red Base: <span className='values'>{green.toRed}</span></p>
                </div>
                
                <p><b>Blue: </b></p>
                <div  className = 'info-lines'>
                    <p>Flags Retrieved: <span className='values'>{blue.numFlags}</span></p>
                    <p>Velocity: <span className='values'>{blue.vel}</span></p>
                    <p>Heading: <span className='values'>{blue.h}</span></p>
                    <p>To Flag: <span className='values'>{blue.toFlag}</span>
                    &nbsp;&nbsp;To Base: <span className='values'>{blue.toBase}</span></p>
                    <p>Phase: <span className='values'>{blue.phase}</span></p>
                    <p>Retrieval Times:</p>
                    <p> &nbsp;&nbsp;Current: <span className='values'>{blue.currentRetrieval}</span></p>
                    <p> &nbsp;&nbsp;Last: <span className='values'>{blue.lastRetrieval}</span></p>
                    <p> &nbsp;&nbsp;Mean: <span className='values'>{blue.meanRetrieval}</span></p>
                </div>
                
                <p><b>Red: </b></p>
                <div  className = 'info-lines'>
                    <p>Flags Retrieved: <span className='values'>{red.numFlags}</span></p>
                    <p>Velocity: <span className='values'>{red.vel}</span></p>
                    <p>Heading: <span className='values'>{red.h}</span></p>
                    <p>To Flag: <span className='values'>{red.toFlag}</span>
                    &nbsp;&nbsp;To Base: <span className='values'>{red.toBase}</span></p>
                    <p>Phase: <span className='values'>{red.phase}</span></p>
                    <p>Retrieval Times:</p>
                    <p> &nbsp;&nbsp;Current: <span className='values'>{red.currentRetrieval}</span></p>
                    <p> &nbsp;&nbsp;Last: <span className='values'>{red.lastRetrieval}</span></p>
                    <p> &nbsp;&nbsp;Mean: <span className='values'>{red.meanRetrieval}</span></p>
                </div>
                
            </div>
        )
    }
}


export default InfoBox;