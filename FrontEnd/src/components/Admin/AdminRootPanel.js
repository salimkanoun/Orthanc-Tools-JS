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
import {Col, Nav, Navbar, Row} from 'react-bootstrap'

/**
 * Root Panel of Admin route
 * Using React Hooks
 */

const AdminRootPanel = () => {

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
                            <button id="icoGeneral" type="button" value="General"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "General" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>General
                            </button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <button id="icoUser" type="button" value="Users"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Users" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Users
                            </button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <button id="icoAets" type="button" value="Aets"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Aets" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Aets
                            </button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <button id="icoPeers" type="button" value="Peers"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Peers" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Peers
                            </button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <button id="icoExternal" type="button" value="External Endpoints"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "External Endpoints" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>External Endpoints
                            </button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <button id="icoRobot" type="button" value="Robots & Tasks"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Robots & Tasks" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Robots & Tasks
                            </button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <button id="icoJob" type="button" value="Jobs"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Jobs" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Jobs
                            </button>
                        </Nav>
                        <Nav className="me-auto mb-3 d-flex align-items-center">
                            <button id="icoCD" type="button" value="CD Burner"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "CD Burner" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>CD Burner
                            </button>
                        </Nav>
                        <Nav className="me-auto d-flex align-items-center">
                            <button id="icoLabel" type="button" value="Labels"
                                    className={"sub-btn-admin" + (selectedOptionMenu === "Labels" ? " sub-btn-admin-active" : "")}
                                    onClick={clickHandler}>
                                <i className="fas fa-arrow-circle-right pe-2"></i>Labels
                            </button>
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

export default AdminRootPanel
