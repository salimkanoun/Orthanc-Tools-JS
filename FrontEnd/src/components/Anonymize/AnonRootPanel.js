import React, { Component } from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import { connect } from 'react-redux';
import AnonymizePanelProgress from './AnonymizePanelProgress';
import apis from '../../services/apis';
import task from '../../services/task';


class AnonRootPanel extends Component {

    state = {
        progress: false
    }

    componentDidMount = async () => {
        //Sk / Voir si robot anoymisation de cet utilisateur est en cours
        let answer = await apis.task.getTaskOfUser(this.props.username, 'anonymize')
        console.log(answer)
        this.setState({
            task: answer.id
        })
        console.log(answer)

    }

    setTask = (task) => {
        this.setState({
            task: task
        })
    }

    render = () => {
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
                    <AnonymizePanel setTask={this.setTask} />
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
        anonymizedList: state.AnonList.anonymizedList,
        username: state.OrthancTools.username
    }
}

export default connect(mapStateToProps)(AnonRootPanel)