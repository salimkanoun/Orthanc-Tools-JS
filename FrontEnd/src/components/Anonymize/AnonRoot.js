import React, { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap';

import AnonymizePanel from './Anonymize/AnonymizePanel';
import ProgressionRoot from './Progression/ProgressionRoot';

const ANON_TAB = "Anonymizassion"
const PROGRESSION_TAB = "Progress"

export default () => {

    const [currentMainTab, setCurrentMainTab] = useState(ANON_TAB)

    const getComponentToDisplay = () => {
        switch (currentMainTab) {
            case ANON_TAB:
                return (<AnonymizePanel />);
            case PROGRESSION_TAB:
                return (<ProgressionRoot />)
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
                                className={currentMainTab === PROGRESSION_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => {
                                    setCurrentMainTab(PROGRESSION_TAB)
                                }}>Progress
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


