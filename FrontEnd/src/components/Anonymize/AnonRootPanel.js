import React, { Component } from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import { connect } from 'react-redux';
import AnonymizePanelProgress from './AnonymizePanelProgress';


class AnonRootPanel extends Component {

    state = {
        progress: false
    }

    constructor (props) {
        super(props)
        this.setTask = this.setTask.bind(this)
    }
    
    setTask(task){
        this.setState({
            task: task
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.task ?
                    <div className='jumbotron' >
                        <h2 className='card-title mb-3'>Anonymize in progress</h2>
                        <AnonymizePanelProgress setTask={this.setTask} task={this.state.task} />
                    </div> 
                    :
                    null
                }
                
                <div className='jumbotron' hidden={this.state.progress}>
                    <h2 className='card-title mb-3'>Anonymize</h2>
                    <AnonymizePanel setTask={this.setTask}/>
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