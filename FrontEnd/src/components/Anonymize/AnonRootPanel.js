import React, {Component} from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import {connect} from 'react-redux';
import AnonymizePanelProgress from './AnonymizePanelProgress';
import apis from '../../services/apis';
import AnonHistoric from './AnonHistoric';
import { Row,Col } from 'react-bootstrap';
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
                    <>
                        <Row className="align-items-center justify-content-center">
                            <Col md={12} className="text-center mb-4" style={{"max-width": '20%'}}>
                                <AnonymizePanelProgress anonTaskID={this.state.anonTaskId}/>
                            </Col>
                            <Col md={12}>
                                <AnonymizedResults anonTaskID={this.state.anonTaskId}/>
                            </Col>
                        </Row>
                    </>)
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
                    <Row className="pb-3">
                        <Col className="d-flex justify-content-start align-items-center">
                            <i className="fas fa-user-secret ico me-3"></i><h2 className="card-title">Anonymise</h2>
                        </Col>
                    </Row>
                    <nav className="otjs-navmenu container-fluid">
                        <div className="otjs-navmenu-nav">
                            <li className='col-4 text-center'>
                                <button
                                    className={this.state.currentMainTab === ANON_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => this.setCurrentMainTab(ANON_TAB)}>Anonimization List
                                </button>
                            </li>
                        
                            <li className='col-4 text-center'>
                                <button
                                    className={this.state.currentMainTab === PORG_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button' + (!this.state.anonTaskId ? ' disabled' : '')}
                                    onClick={() => {
                                        if (this.state.anonTaskId) this.setCurrentMainTab(PORG_TAB)
                                    }}>Progress
                                </button>
                            </li>
                            <li className='col-4 text-center'>
                                <button
                                    className={this.state.currentMainTab === HISTORIC_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                    onClick={() => this.setCurrentMainTab(HISTORIC_TAB)}> History
                                </button>
                            </li>
                        </div>
                    </nav>
                </div>
                <div>
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