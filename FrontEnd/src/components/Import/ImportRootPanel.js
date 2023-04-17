import React, { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'

import Import from './Import'
import CreateDicom from './CreateDicom'

export default () => {

  const IMPORT_TAB = 'import'
  const CREATE_TAB = 'create'

  const [selectedOptionMenu, setSelectedOptionMenu] = useState(IMPORT_TAB)

  const getComponentToDisplay = () => {
    switch (selectedOptionMenu) {
      case IMPORT_TAB:
        return (<Import />)
      case CREATE_TAB:
        return (<CreateDicom />)
    }
  }

  return (
    <div >
      <div className='mb-5'>
        <Row className="pb-3">
          <Col className="d-flex justify-content-start align-items-center">
            <i className="fas fa-file-import ico me-3"></i><h2 className="card-title">Import Dicom Files</h2>
          </Col>
        </Row>

        <nav className='otjs-navmenu container-fluid'>
          <div className="otjs-navmenu-nav">
            <li className='col-6 text-center'>
              <Button className={selectedOptionMenu === IMPORT_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button'}
                onClick={() => setSelectedOptionMenu(IMPORT_TAB)}>
                Import Dicom
              </Button>
            </li>
            <li className='col-6 text-center'>
              <Button className={selectedOptionMenu === CREATE_TAB ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button'}
                onClick={() => setSelectedOptionMenu(CREATE_TAB)}>
                Create Dicom
              </Button>
            </li>
          </div>
        </nav>
      </div>
      <div>
        {getComponentToDisplay()}
      </div>
    </div>
  )
}