import React, { useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Image, Nav, Navbar } from 'react-bootstrap'

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
    const LOG_OUT = ""

    const history = useHistory()
    const location = useLocation()
    const [opened, setOpened] = useState(false)

    const getLinkClass = (tabName) => {
        if (location.pathname === '/' + tabName) return 'nav-link active'
        else return 'nav-link'
    }

    const selectTabHandler = (name) => {
        history.push("/" + name)
    }


    return (
        <>
            <Navbar MouseEnter={() => { setOpened(true) }}
                onMouseLeave={() => { setOpened(false) }}
                className={"d-flex flex-row"}
                fixed='top'
                collapseOnSelect expand='lg'
                variant='dark'>

                <div class="row">
                    <div class="col mx-auto text-center" >
                        <Navbar.Brand href="../#home">
                            <Image id="logo" className={"logoMenu" +(opened ? "" : " navbar-image-close") } src={image} />
                        </Navbar.Brand>

                        <Nav className="menu me-auto">
                            <ul>
                                <div className="otjs-navbar-border" /*hidden={!opened}*/></div>

                                <li>
                                    <Nav.Link className={getLinkClass('orthanc-content')} onClick={() => selectTabHandler(CONTENT)} name='content' to='/orthanc-content'><i className="fas fa-search icone"></i>  Orthanc Content</Nav.Link>
                                </li>

                                <li>
                                    <Nav.Link className={getLinkClass('import')} onClick={() => selectTabHandler(IMPORT)} name='import'><i className="fas fa-file-import icone"></i>  Import</Nav.Link>
                                </li>

                                <li>
                                    <Nav.Link className={getLinkClass('query')} onClick={() => selectTabHandler(QUERY)} name='query' hidden={!roles.query}><i className="fas fa-question icone"></i>  Query</Nav.Link>
                                </li>

                                <li>
                                    <Nav.Link className={getLinkClass('auto-query')} onClick={() => selectTabHandler(AUTO_QUERY)} name='auto_query' /*hidden={!roles.auto_query}*/><i className="fas fa-recycle icone"></i>  Auto Retrieve</Nav.Link>
                                </li>

                                <li>
                                    <Nav.Link className={getLinkClass('cd-burner')} onClick={() => selectTabHandler(BURNER)} name='burner' /*hidden={!roles.cd_burner}*/><i className="fas fa-compact-disc icone"></i>  CD-Burner</Nav.Link>
                                </li>

                                <li>
                                    <Nav.Link className={getLinkClass('mydicom')} onClick={() => selectTabHandler(MYDICOM)} name='mydicom'><i className="far fa-images icone"></i>  MyDicom</Nav.Link>
                                </li>

                                <li>
                                    <Nav.Link className={getLinkClass('dicom-router')} onClick={() => selectTabHandler(DICOM_ROUTER)} name='dicom-router' /*hidden={!roles.autorouting}*/><i className="fas fa-broadcast-tower icone"></i>  Dicom-Router</Nav.Link>
                                </li>

                                <li>
                                    <Nav.Link className={getLinkClass('administration')} onClick={() => selectTabHandler(ADMINISTRATION)} name='administration' /*hidden={!roles.admin}*/><i className="fas fa-cogs icone"></i>  Administration</Nav.Link>
                                </li>

                                <div className="otjs-navbar-border" /*hidden={!opened}*/></div>

                                <li>
                                    <Nav.Link className={getLinkClass('log-out')} onClick={() => selectTabHandler(LOG_OUT)} name='log out' ><i className="fas fa-power-off"></i>{opened ? ' Log out' : ''}  Log-out</Nav.Link>
                                </li>
                            </ul>
                        </Nav>
                    </div>
                </div>
            </Navbar>
        </>
    )
}



