import React, { Component } from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import { connect } from 'react-redux';
import AnonymizePanelProgress from './AnonymizePanelProgress';
import apis from '../../services/apis';
import task from '../../services/task';


class AnonRootPanel extends Component {

    state = {
        anonTaskId : null
    }

    componentDidMount = async () => {
        //Sk / Voir si robot anoymisation de cet utilisateur est en cours
        try{
            let answer = await apis.task.getTaskOfUser(this.props.username, 'anonymize')
            if(answer.state !== "completed"){
                
                this.setState({
                    anonTaskId: answer.id
                })

            }
        }catch (error) {}


    }

    setAnonTaskId = (anonTaskID) => {
        this.setState({
            anonTaskId: anonTaskID
        })
    }

    render = () => {
        return (
            <div>
                { this.state.anonTaskId ? <AnonymizePanelProgress onAnonymizeFinished = {() => this.setAnonTaskId(null) } anonTaskID={this.state.anonTaskId} /> : null }
                { !this.state.anonTaskId ? <AnonymizePanel setTask={this.setAnonTaskId} /> : null}
                { this.props.anonymizedList.length > 0 ? <AnonymizedResults /> : null}
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        anonList: state.AnonList.anonList,
        anonymizedList: state.AnonList.anonymizedList,
        username: state.OrthancTools.username
    }
}

export default connect(mapStateToProps)(AnonRootPanel)