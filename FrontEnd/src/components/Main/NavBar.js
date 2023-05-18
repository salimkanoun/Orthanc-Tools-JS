import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Image, Nav, Navbar, Row } from 'react-bootstrap'

import image from '../../assets/images/logo.png';

export default ({ onLogout, roles }) => {

    const IMPORT = "import"
    const CONTENT = "orthanc-content"
    const QUERY = "query"
    const AUTO_QUERY = "auto-query"
    const BURNER = "cd-burner"
    const MYDICOM = "mydicom"
    const DICOM_ROUTER = "dicom-router"
    const ADMINISTRATION = "administration"

    const navigate = useNavigate()
    const location = useLocation()

    const getLinkClass = (tabName) => {
        if (location.pathname === '/' + tabName) return 'nav-link active'
        else return 'nav-link'
    }

    const selectTabHandler = (name) => {
        navigate("/" + name)
    }

    return (
        <Navbar variant='dark' >
            <Container>
                <Row>

                <Navbar.Brand href="../#home">
                    <Image className="navbar-image"
                        src={image} />
                </Navbar.Brand>
                </Row>
                <Row>
                    <Nav>
                        <ul>
                            <li>
                                <Nav.Link className={getLinkClass('orthanc-content')} onClick={() => selectTabHandler(CONTENT)} name='content' to='/orthanc-content' /*hidden={!roles.content}*/><i className="fas fa-search icone" ></i> Orthanc Content</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('import')} onClick={() => selectTabHandler(IMPORT)} name='import' /*hidden={!roles.import}*/> <i className="fas fa-file-import icone"></i> Import</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('query')} onClick={() => selectTabHandler(QUERY)} name='query' /*hidden={!roles.query}*/><i className="fas fa-question icone"></i> Query</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('auto-query')} onClick={() => selectTabHandler(AUTO_QUERY)} name='auto_query' /*hidden={!roles.autoQuery}*/><i className="fas fa-recycle icone"></i> Auto Retrieve</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('cd-burner')} onClick={() => selectTabHandler(BURNER)} name='burner' hidden={!roles.cdBurner} ><i className="fas fa-compact-disc icone"></i> CD Burner</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('mydicom')} onClick={() => selectTabHandler(MYDICOM)} name='mydicom'><i className="far fa-images icone"></i> My Dicom</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('dicom-router')} disabled={true} onClick={() => selectTabHandler(DICOM_ROUTER)} name='dicom-router' hidden={!roles.autorouting} ><i className="fas fa-broadcast-tower icone"></i> Dicom Router</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('administration')} onClick={() => selectTabHandler(ADMINISTRATION)} name='administration' /*hidden={!roles.admin}*/><i className="fas fa-cogs icone"></i> Administration</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('log-out')} onClick={() => onLogout()} name='log out' ><i className="fas fa-power-off"></i> Log out</Nav.Link>
                            </li>
                        </ul>
                    </Nav>
                </Row>
            </Container>
        </Navbar>
    )
}



