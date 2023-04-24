import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';

import apis from '../../services/apis';
import AnonymizePanel from './Anonymize/AnonymizePanel';
import ResultRoot from './Progression/ResultRoot';
import AnonHistory from './History/AnonHistory';

const ANON_TAB = "Anonymizassion"
const RESULTS_TAB = "Progress"
const HISTORY_TAB = "Historic"

export default () => {

    const [anonTaskID, setAnonTaskID] = useState(null)
    const [currentMainTab, setCurrentMainTab] = useState(ANON_TAB)

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username
        }
    })

    useEffect(() => {
        //Sk / Voir si robot anoymisation de cet utilisateur est en cours
        const getTaskOfUser = async () => { await apis.task.getTaskOfUser(store.username, 'anonymize') }
        try {
            let answer = getTaskOfUser()[0]
            if (answer) {
                setAnonTaskID(answer)
            }
        } catch (error) {
        }
    }, [])

    const setAnonTaskId = (anonTaskID) => {
        setAnonTaskID(anonTaskID)
        setCurrentMainTab(RESULTS_TAB)
    }

    const getComponentToDisplay = () => {
        switch (currentMainTab) {
            case ANON_TAB:
                return (<AnonymizePanel setTask={setAnonTaskId} />);
            case RESULTS_TAB:
                return (<ResultRoot />)
            case HISTORY_TAB:
                return (<AnonHistory />);
            default:
                break;
        }
    }


    return (
        <div>
            <div className='mb-5'>
                <Row className="pb-3">
                    <Col className="d-flex justify-content-start align-items-center">
                        <i className="fas fa-user-secret ico me-3"></i><h2 className="card-title">Anonymize</h2>
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
                                className={currentMainTab === RESULTS_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button' + (!anonTaskID ? ' disabled' : '')}
                                onClick={() => {
                                    if (anonTaskID) setCurrentMainTab(RESULTS_TAB)
                                }}>Progress
                            </Button>
                        </li>
                        <li className='col-4 text-center'>
                            <Button
                                className={currentMainTab === HISTORY_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentMainTab(HISTORY_TAB)}> History
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


