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
        this.setProgress = this.setProgress.bind(this)
    }
    
    setProgress(progress){
        this.setState({
            progress: progress
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.progress ?
                    <div className='jumbotron' >
                        <h2 className='card-title mb-3'>Anonymize in progress</h2>
                        <AnonymizePanelProgress setProgress={this.setProgress} />
                    </div> 
                    :
                    null
                }
                
                <div className='jumbotron'>
                    <h2 className='card-title mb-3'>Anonymize</h2>
                    <AnonymizePanel setProgress={this.setProgress}/>
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