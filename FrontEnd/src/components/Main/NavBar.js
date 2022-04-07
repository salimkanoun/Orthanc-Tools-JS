import React, { useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import {  Image, Nav, Navbar } from 'react-bootstrap'

import image from '../../assets/images/logo.png';

export default ({onLogout, roles }) => {

    const IMPORT = "import"
    const CONTENT = "content"

    const history = useHistory()
    const location = useLocation()
    const [opened, setOpened] = useState(false)

    const getLinkClass = (tabName) => {
        if (location.pathname === '/' + tabName) return 'nav-link active'
        else return 'nav-link'
    }

    const selectTabHandler = (name) => {
        history.push("/"+name)
    }


    return (
        <>
            <Navbar MouseEnter={() =>{setOpened(true)}}
                onMouseLeave={() => {setOpened(false)}}
                className={"d-flex flex-row"}
                fixed='top'
                collapseOnSelect expand='lg'
                variant='dark'>
                <Navbar.Brand href="#home">
                    <Image id="logo" className={"navbar-image" + (opened ? "" : " navbar-image-close")}
                    src={image} />
                </Navbar.Brand>

                <Nav className="me-auto">
                    <ul>
                        <li>
                            <Nav.Link className={getLinkClass('content')} onClick={() => selectTabHandler(CONTENT)} name='content' to='/orthanc-content'>Content</Nav.Link>
                        </li>
                        <li>
                            <Nav.Link className={getLinkClass('import')} onClick={() => selectTabHandler(IMPORT)}>Import</Nav.Link>
                        </li>
                    </ul>
                    <Link className={getLinkClass('query')} onClick={selectTabHandler} name='query'
                        to='/query' hidden={!roles.query}>
                        <i className="fas fa-question"></i> {opened ? 'Query' : ''}
                    </Link>
                    <Link className={getLinkClass('auto-query')} onClick={selectTabHandler}
                        name='auto-query' to='/auto-query'
                        hidden={!roles.auto_query}>
                        <i className="fas fa-recycle"></i> {opened ? 'Auto-Retrieve' : ''}
                    </Link>
                    <Link className={getLinkClass('burner')} onClick={selectTabHandler} name='burner'
                        to='/cd-burner' hidden={!roles.cd_burner}>
                        <i className="fas fa-compact-disc"></i> {opened ? 'CD-burner' : ''}
                    </Link>
                    <Link className={getLinkClass('mydicom')} onClick={selectTabHandler}
                        name='mydicom' to='/mydicom'>
                        <i className="far fa-images"></i> {opened ? 'MyDicom' : ''}
                    </Link>
                    <Link className={getLinkClass('dicom-router')} onClick={selectTabHandler}
                        name='dicom-router' to='/dicom-router'
                        hidden={!roles.autorouting}>
                        <i className="fas fa-broadcast-tower icon"></i> {opened ? 'Dicom-Router' : ''}
                    </Link>
                    <Link className={getLinkClass('administration')} onClick={selectTabHandler}
                        name='administration' to='/administration'
                        hidden={!roles.admin}>
                        <i className="fas fa-cogs"></i> {opened ? 'Administration' : ''}
                    </Link>

                    <div className="otjs-navbar-border" hidden={!opened}></div>

                    <Link className={getLinkClass('log-out')} name='log-out' onClick={onLogout}
                        to='/'>
                        <i className="fas fa-power-off"></i>{opened ? ' Log out' : ''}
                    </Link>
                </Nav>
            </Navbar>

            

        </>
    )

}



