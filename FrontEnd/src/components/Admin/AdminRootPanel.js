import React, { useState } from 'react'
import AetRootPanel from './AET/AetRootPanel'
import PeerRootPanel from './Peers/PeerRootPanel'
import JobsRootPanel from './Jobs/JobsRootPanel'
import UserRoot from './UserManagement/UserRoot'
import BurnerOptions from './CDBurner/BurnerOptions'
import EndpointsRootPanel from './Endpoints/EndpointsRootPanel'
import GeneralRoot from './General/GeneralRoot'
import TaskRootPanel from './Robots/TaskRootPanel'
import LabelRootPanel from "./Labels/LabelRootPanel"
import { Button, Col, Container, Nav, Navbar, Row } from 'react-bootstrap'

/**
 * Root Panel of Admin route
 */
export default () => {

    const GENERAL = 'General'
    const AETS = 'Aets'
    const PEERS = 'Peers'
    const EXTERNAL_ENDPOINTS = 'External Endpoints'
    const ROBOTS_TASK = 'Robots & Tasks'
    const JOBS = 'Jobs'
    const CD_BURNER = 'CD Burner'
    const USERS = 'Users'
    const LABELS = 'Labels'

    const MENU_ITEMS = [GENERAL, AETS, PEERS, EXTERNAL_ENDPOINTS, ROBOTS_TASK, JOBS, CD_BURNER, USERS, LABELS]

    const [selectedOptionMenu, setSelectedOptionMenu] = useState(GENERAL)

    const onSelectMenuHandler = (type) => {
        setSelectedOptionMenu(type);
    }

    const getComponentToDisplay = () => {
        switch (selectedOptionMenu) {
            case GENERAL:
                return (<GeneralRoot />)
            case AETS:
                return (<AetRootPanel />)
            case PEERS:
                return (<PeerRootPanel />)
            case EXTERNAL_ENDPOINTS:
                return (<EndpointsRootPanel />)
            case ROBOTS_TASK:
                return (<TaskRootPanel />)
            case JOBS:
                return (<JobsRootPanel />)
            case CD_BURNER:
                return (<BurnerOptions />)
            case USERS:
                return (<UserRoot />)
            case LABELS:
                return (<LabelRootPanel />)
            default:
                return ([])
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col sm={3} className="border-end border-2">
                    <Navbar className="d-flex flex-row d-flex justify-content-start align-items-center" collapseOnSelect
                        expand='lg' variant='dark'>
                        <Navbar.Toggle />
                        <nav className="d-flex flex-column text-justify justify-content-start align-items-center">
                            {
                                MENU_ITEMS.map(
                                    (type) => (
                                        <Nav key={type} className="me-auto mb-3 d-flex align-items-center">
                                            <Button
                                                className={"sub-btn-admin" + (selectedOptionMenu === type ? " sub-btn-admin-active" : "")}
                                                onClick={() => onSelectMenuHandler(type)}>
                                                <i className="fas fa-arrow-circle-right pe-2">
                                                </i>
                                                {type}
                                            </Button>
                                        </Nav>
                                    )
                                )
                            }
                        </nav>
                    </Navbar>
                </Col>
                <Col sm={9} className="ps-5">
                    {getComponentToDisplay()}
                </Col>
            </Row>
        </Container>
    )
}
