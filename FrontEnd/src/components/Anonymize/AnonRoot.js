import React, { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap';

import AnonymizePanel from './Anonymize/AnonymizePanel';
import ResultRoot from './Progression/ProgressionRoot';
import AnonHistory from './History/AnonHistory';

const ANON_TAB = "Anonymizassion"
const RESULTS_TAB = "Progress"
const HISTORY_TAB = "Historic"

export default () => {

    const [currentMainTab, setCurrentMainTab] = useState(ANON_TAB)

    const getComponentToDisplay = () => {
        switch (currentMainTab) {
            case ANON_TAB:
                return (<AnonymizePanel />);
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
                                className={currentMainTab === RESULTS_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => {
                                    setCurrentMainTab(RESULTS_TAB)
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


