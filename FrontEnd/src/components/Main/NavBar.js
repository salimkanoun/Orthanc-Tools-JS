import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Image, Nav, Navbar} from 'react-bootstrap'

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
            <Navbar 
                onMouseEnter={() => setOpened(true)}
                onMouseLeave={() => setOpened(false)}
                className={'otjs-navbar d-flex flex-row'}
                fixed='top'
                collapseOnSelect expand='lg'
                variant='dark' >

                <Navbar.Brand href="../#home">
                    <Image id="logo" className={"navbar-image" + (opened ? "" : " navbar-image-close")}
                        src={image} />
                </Navbar.Brand>
                <div id='bg-navbar' className={opened ? 'bg-navbar' : 'bg-navbar bg-navbar-close'} ></div>

                <Navbar.Toggle />
                <Navbar.Collapse>

                    <Nav className="me-auto" class="menu">
                        <ul>
                            <div className='otjs-navbar-border' hidden={!opened}></div>

                            <li>
                                <Nav.Link className={getLinkClass('orthanc-content')} onClick={() => selectTabHandler(CONTENT)} name='content' to='/orthanc-content' /*hidden={!roles.content}*/><i className="fas fa-search icone" ></i>{opened ? '  Orthanc Content ' : ''}</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('import')} onClick={() => selectTabHandler(IMPORT)} name='import' /*hidden={!roles.import}*/> <i className="fas fa-file-import icone"></i>{opened ? '  Import ' : ''} </Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('query')} onClick={() => selectTabHandler(QUERY)} name='query' /*hidden={!roles.query}*/><i className="fas fa-question icone"></i> {opened ? '  Query' : ''} </Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('auto-query')} onClick={() => selectTabHandler(AUTO_QUERY)} name='auto_query' /*hidden={!roles.auto_query}*/><i className="fas fa-recycle icone"></i> {opened ? '  Auto Retrieve' : ''} </Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('cd-burner')} onClick={() => selectTabHandler(BURNER)} name='burner' /*hidden={!roles.cd_burner}*/><i className="fas fa-compact-disc icone"></i>{opened ? '  CD-Burner' : ''}</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('mydicom')} onClick={() => selectTabHandler(MYDICOM)} name='mydicom'><i className="far fa-images icone"></i>{opened ? '  MyDicom' : ''}</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('dicom-router')} onClick={() => selectTabHandler(DICOM_ROUTER)} name='dicom-router' hidden={!roles.autorouting} ><i className="fas fa-broadcast-tower icone"></i>{opened ? '  Dicom-Router' : ''}</Nav.Link>
                            </li>

                            <li>
                                <Nav.Link className={getLinkClass('administration')} onClick={() => selectTabHandler(ADMINISTRATION)} name='administration' /*hidden={!roles.admin}*/><i className="fas fa-cogs icone"></i>{opened ? '  Administration' : ''}</Nav.Link>
                            </li>

                            <div className="otjs-navbar-border" hidden={!opened}></div>

                            <li>
                                <Nav.Link className={getLinkClass('log-out')} onClick={() => onLogout()} name='log out' ><i className="fas fa-power-off"></i>{opened ? '  Log out' : ''}</Nav.Link>
                            </li>
                        </ul>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}



