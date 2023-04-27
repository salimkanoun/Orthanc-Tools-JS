import React, { useState } from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap'

import Delete from './Delete/Delete'
import DeleteRobot from './DeleteRobot/DeleteRobot'

const DELETE_TAB = "delete"
const ROBOT_TAB = "deleteRobot"

export default () => {

    const [currentMainTab, setCurrentMainTab] = useState(DELETE_TAB)

    const getComponentToDisplay = () => {
        switch (currentMainTab) {
            case DELETE_TAB:
                return (<Delete />);
            case ROBOT_TAB:
                return (<DeleteRobot />)
            default:
                break;
        }
    }

    return (
        <Container fluid>
            <Row className="mb-3">
                <Col className="d-flex justify-content-start align-items-center">
                    <i className="fas fa-trash-alt ico me-3"></i>
                    <h2 className="card-title">Delete</h2>
                </Col>
            </Row>
            <Row>
                <nav className="otjs-navmenu container-fluid">
                    <div className="otjs-navmenu-nav">
                        <li className='col-4 text-center'>
                            <Button
                                className={currentMainTab === DELETE_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => setCurrentMainTab(DELETE_TAB)}>Delete Robot
                            </Button>
                        </li>

                        <li className='col-4 text-center'>
                            <Button
                                className={currentMainTab === ROBOT_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : 'otjs-navmenu-nav-link link-button'}
                                onClick={() => {
                                    setCurrentMainTab(ROBOT_TAB)
                                }}>Progress
                            </Button>
                        </li>
                    </div>
                </nav>
            </Row>
            <Row>
                {getComponentToDisplay()}
            </Row>
        </Container>

    )

}


