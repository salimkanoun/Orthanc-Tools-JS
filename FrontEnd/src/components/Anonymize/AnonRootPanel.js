import React, { Component } from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import { connect } from 'react-redux';
import AnonymizePanelProgress from './AnonymizePanelProgress';


class AnonRootPanel extends Component {

    state = {
        robot: {}
    }

    constructor (props) {
        super(props)
        this.setRobot = this.setRobot.bind(this)
    }
    
    setRobot(robot){
        this.setState({
            robot: robot
        })
    }

    render() {
        return (
            <div>
                {
                    !(this.state.robot.progression !== undefined && this.state.robot.progression.Pending !== 0) ?
                    null
                    :
                    <div className='jumbotron' >
                        <h2 className='card-title mb-3'>Anonymize in progress</h2>
                        <AnonymizePanelProgress robot={this.state.robot}/>
                    </div> 
                }
                
                <div className='jumbotron'>
                    <h2 className='card-title mb-3'>Anonymize</h2>
                    <AnonymizePanel setRobot={this.setRobot}/>
                </div>
                <div className='jumbotron' hidden={this.props.anonymizedList && this.props.anonymizedList.length === 0}>
                    <AnonymizedResults />
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        anonList: state.AnonList.anonList, 
        anonymizedList: state.AnonList.anonymizedList
    }
}

export default connect(mapStateToProps)(AnonRootPanel)