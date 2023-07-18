import React from 'react'

import { Row, Container, Col } from 'react-bootstrap';
import { SwitchTransition, CSSTransition } from "react-transition-group";
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
    const location = useLocation()

    return (
        <Container className='min-vh-100 max-vh-100' fluid>
            <Row>
                <Col xs={1} md={1} lg={1} className='bg-navbar'>
                    <Row style={{ height: '100vh' }}>
                        <NavBar onLogout={onLogout} username={username} roles={roles} />
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Row>
                            <ToolsPanel roles={roles} />
                        </Row>
                        <Row className='overflow-auto ms-3 mt-3' style={{ maxHeight: '90vh', maxWidth: '90vw' }}>
                            <SwitchTransition>
                                <CSSTransition key={location.pathname} timeout={300} classNames={"otjsTransition"}>
                                    <div className='main'>
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
                                    </div>
                                </CSSTransition>
                            </SwitchTransition>
                        </Row>
                        <Row>
                            <Footer />
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default MainRoot