import React from 'react'

import { Row, Container, Col } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Route, Routes, useLocation } from 'react-router-dom'

import AdminRootPanel from '../Admin/AdminRootPanel'
import AnonRoot from '../Anonymize/AnonRoot'
import AutoQueryRoot from '../AutoQuery/AutoQueryRoot'
import DicomRouterPanel from '../Dicom Router/DicomRouterPanel'
import ImportRootPanel from '../Import/ImportRootPanel'
import ContentRootPanel from '../Content/ContentRootPanel'
import Query from '../Query/Query'
import NavBar from './NavBar'
import Footer from './Footer';

import ToolsPanel from './ToolsPanel';
import Welcome from './Welcome';
import ExportRoot from '../Export/ExportRoot';
import DeleteRoot from '../Delete/DeleteRoot';
import CDBurnerRoot from '../CDBurner/CDBurnerRoot';
import MyDicomRoot from '../MyDicom/MyDicomRoot';

const MainRoot = ({ onLogout, username, roles }) => {

    return (
        <>
            <Container fluid>
                <Row>
                    <Col sm={1}>
                        <NavBar onLogout={onLogout} username={username} roles={roles} />
                    </Col>
                    <Col sm={11}>
                        <Row>
                            <ToolsPanel roles={roles} apercu />
                        </Row>
                        <Row className='m-5'>
                            <div className='main'>
                                <AnimatedSwitch />
                            </div>
                        </Row>
                    </Col>
                </Row>

            </Container >
            <Footer />
        </>
    )

}

const AnimatedSwitch = () => {
    const location = useLocation()
    return (
        <TransitionGroup>
            <CSSTransition key={location.key} timeout={500} unmountOnExit classNames={"alert"}>
                <Routes location={location}>
                    <Route path='/import' element={<ImportRootPanel />} />
                    <Route path='/query' element={<Query />} />
                    <Route path='/auto-query' element={<AutoQueryRoot />} />
                    <Route path='/administration' element={<AdminRootPanel />} />
                    <Route path='/orthanc-content' element={<ContentRootPanel />} />
                    <Route path='/export' element={<ExportRoot />} />
                    <Route path='/anonymize' element={<AnonRoot />} />
                    <Route path='/cd-burner' element={<CDBurnerRoot />} />
                    <Route path='/mydicom' element={<MyDicomRoot />} />
                    <Route path='/delete' element={<DeleteRoot />} />
                    <Route path='/dicom-router' element={<DicomRouterPanel />} />
                    <Route path='/' element={<Welcome />} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    )
}


export default MainRoot