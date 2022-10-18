import React, { Component, useState } from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import { connect, useSelector } from 'react-redux';
import AnonymizePanelProgress from './AnonymizePanelProgress';
import apis from '../../services/apis';
import AnonHistoric from './AnonHistoric';
import { Row, Col, Button } from 'react-bootstrap';
const ANON_TAB = "Anonymizassion"
const PORG_TAB = "Progress"
const HISTORIC_TAB = "Historic"

export default ({ }) => {

    const [anonTaskID, setAnonTaskID] = useState(null)
    const [currentMainTab, setCurrentMainTab] = useState(ANON_TAB)

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username
        }
    })

    const componentDidMount = async () => {
        //Sk / Voir si robot anoymisation de cet utilisateur est en cours
        try {
            let answer = (await apis.task.getTaskOfUser(store.username, 'anonymize'))[0]

            if (answer) {
                setAnonTaskID(answer)
            }
        } catch (error) {
        }


    }

    const setAnonTaskId = (anonTaskID) => {
        setAnonTaskID(anonTaskID)
        setCurrentMainTab(PORG_TAB)
    }

    const getComponentToDisplay = () => {
        switch (currentMainTab) {
            case ANON_TAB:
                return (<AnonymizePanel setTask={setAnonTaskId} />);
            case PORG_TAB:
                return (
                    <>
                        <Row className="align-items-center justify-content-center">
                            <Col md={12} className="text-center mb-4" style={{ "max-width": '20%' }}>
                                <AnonymizePanelProgress anonTaskID={anonTaskID} />
                            </Col>
                            <Col md={12}>
                                <AnonymizedResults anonTaskID={anonTaskID} />
                            </Col>
                        </Row>
                    </>)
            case HISTORIC_TAB:
                return (<AnonHistoric />);
            default:
                break;
        }
    }


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
                            <Button
                                className={currentMainTab === ANON_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentMainTab(ANON_TAB)}>Anonimization List
                            </Button>
                        </li>

                        <li className='col-4 text-center'>
                            <Button
                                className={currentMainTab === PORG_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button' + (!anonTaskID ? ' disabled' : '')}
                                onClick={() => {
                                    if (anonTaskID) setCurrentMainTab(PORG_TAB)
                                }}>Progress
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentMainTab === HISTORIC_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentMainTab(HISTORIC_TAB)}> History
                            </Button>
                        </li>
                    </div>
                </nav>
            </div>
            <div>
                {getComponentToDisplay()}
            </div>
        </div>

    )

}


