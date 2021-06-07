import React, {Component} from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import {connect} from 'react-redux';
import AnonymizePanelProgress from './AnonymizePanelProgress';
import apis from '../../services/apis';
import AnonHistoric from './AnonHistoric';

const ANON_TAB = "Anonymizassion"
const PORG_TAB = "Progress"
const HISTORIC_TAB = "Historic"

class AnonRootPanel extends Component {

    state = {
        anonTaskId: null,
        currentMainTab: ANON_TAB
    }

    componentDidMount = async () => {
        //Sk / Voir si robot anoymisation de cet utilisateur est en cours
        try {
            let answer = (await apis.task.getTaskOfUser(this.props.username, 'anonymize'))[0]

            if (answer) {
                this.setState({
                    anonTaskId: answer
                })
            }
        } catch (error) {
        }


    }

    setAnonTaskId = (anonTaskID) => {
        this.setState({
            anonTaskId: anonTaskID,
            currentMainTab: PORG_TAB
        })
    }

    getComponentToDisplay = () => {
        switch (this.state.currentMainTab) {
            case ANON_TAB:
                return (<AnonymizePanel setTask={this.setAnonTaskId}/>);
            case PORG_TAB:
                return (
                    <div>
                        <div className = "row">
                            <AnonymizePanelProgress anonTaskID={this.state.anonTaskId}/>
                        </div>
                        <div>
                            <AnonymizedResults anonTaskID={this.state.anonTaskId}/>
                        </div>
                    </div>)
            case HISTORIC_TAB:
                return (<AnonHistoric/>);
            default:
                break;
        }
    }

    setCurrentMainTab = currentMainTab => {
        this.setState({currentMainTab})
    }

    render = () => {
        return (
            <div>
                <div className='mb-5'>
                    <ul className='nav nav-pills nav-fill'>
                        <li className='nav-item'>
                            <button
                                className={this.state.currentMainTab === ANON_TAB ? 'col nav-link active link-button' : ' col nav-link link-button'}
                                onClick={() => this.setCurrentMainTab(ANON_TAB)}>Anonimization List
                            </button>
                        </li>
                        <li className='nav-item'>
                            <button
                                className={this.state.currentMainTab === PORG_TAB ? 'col nav-link active link-button' : 'col nav-link link-button' + (!this.state.anonTaskId ? ' disabled' : '')}
                                onClick={() => {
                                    if (this.state.anonTaskId) this.setCurrentMainTab(PORG_TAB)
                                }}>Progress
                            </button>
                        </li>
                        <li className='nav-item'>
                            <button
                                className={this.state.currentMainTab === HISTORIC_TAB ? 'col nav-link active link-button' : 'col nav-link link-button'}
                                onClick={() => this.setCurrentMainTab(HISTORIC_TAB)}>Historic
                            </button>
                        </li>
                    </ul>
                </div>
                <div className = "jumbotron">
                    {this.getComponentToDisplay()}
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.OrthancTools.username
    }
}

export default connect(mapStateToProps)(AnonRootPanel)