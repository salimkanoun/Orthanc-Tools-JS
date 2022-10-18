import React, {useState} from 'react'
import AetRootPanel from './AET/AetRootPanel'
import PeerRootPanel from './Peers/PeerRootPanel'
import JobsRootPanel from './Jobs/JobsRootPanel'
import UserManagement from './UserManagement/UserManagement'
import BurnerOptions from './CDBurner/BurnerOptions'
import EndpointsRootPanel from './Endpoints/EndpointsRootPanel'
import GeneralRoot from './General/GeneralRoot'
import TaskRootPanel from './Robots/TaskRootPanel'
import LabelRootPanel from "./Labels/LabelRootPanel"
import {Button, Col, Nav, Navbar, Row} from 'react-bootstrap'

/**
 * Root Panel of Admin route
 * Using React Hooks
 */

export default ({}) => {

    const [selectedOptionMenu, setSelectedOptionMenu] = useState('General')

    function clickHandler(event) {
        setSelectedOptionMenu(event.target.value);
    }

    function getComponentToDisplay() {
        switch (selectedOptionMenu) {
            case 'General':
                return (<GeneralRoot/>)
            case 'Aets':
                return (<AetRootPanel/>)
            case 'Peers':
                return (<PeerRootPanel/>)
            case 'External Endpoints':
                return (<EndpointsRootPanel/>)
            case 'Robots & Tasks':
                return (<TaskRootPanel/>)
            case 'Jobs':
                return (<JobsRootPanel/>)
            case 'CD Burner':
                return (<BurnerOptions/>)
            case 'Users':
                return (<UserManagement/>)
            case 'Labels':
                return (<LabelRootPanel/>)
            default:
                return ([])
        }
    }

    return (
        <Row>
            <Col sm={3} className="border-end border-2">
                <Navbar className="d-flex flex-row d-flex justify-content-start align-items-center" collapseOnSelect
                        expand='lg' variant='dark'>
                    <Navbar.Toggle/>
                    <nav className="d-flex flex-column text-justify justify-content-start align-items-center">
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoGeneral" value="General"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "General" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>General
                            </Button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoUser" value="Users"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Users" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Users
                            </Button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoAets" value="Aets"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Aets" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Aets
                            </Button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoPeers" value="Peers"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Peers" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Peers
                            </Button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoExternal" value="External Endpoints"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "External Endpoints" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>External Endpoints
                            </Button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoRobot" value="Robots & Tasks"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Robots & Tasks" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Robots & Tasks
                            </Button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoJob" value="Jobs"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Jobs" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Jobs
                            </Button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <Button id="icoCD" value="CD Burner"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "CD Burner" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>CD Burner
                            </Button>
                        </Nav>
                        <Nav className="me-auto d-flex align-items-center">
                            <Button id="icoLabel" value="Labels"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Labels" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Labels
                            </Button>
                        </Nav>
                    </nav>
                </Navbar>
            </Col>
            <Col sm={9} className="ps-5">
                {getComponentToDisplay()}
            </Col>
        </Row>
    )
}

