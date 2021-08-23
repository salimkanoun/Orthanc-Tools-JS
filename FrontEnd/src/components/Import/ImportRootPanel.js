import React, { useState } from 'react'
import Import from './Import'
import CreateDicom from './CreateDicom'
import {Row, Col} from 'react-bootstrap'
/**
 * Root Panel of Admin route
 * Using React Hooks
 */

const ImportRootPanel = () => {

  const [selectedOptionMenu, setSelectedOptionMenu] = useState('ImportDicom')
  function clickHandler(event) {
    console.log(event)
    setSelectedOptionMenu(event.target.value)
  }

  function getComponentToDisplay() {
    switch (selectedOptionMenu) {
      case 'ImportDicom':
        return (<Import />)
      case 'CreateDicom':
        return (<CreateDicom />)
      default: 
        return ([]) 
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
              <button className={selectedOptionMenu === 'ImportDicom' ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button'} value={'ImportDicom'} onClick={clickHandler}>
                Import Dicom
              </button>
            </li>
            <li className='col-6 text-center'>
              <button className={selectedOptionMenu === 'CreateDicom' ? 'otjs-navmenu-nav-link link-button-active link-button' : ' otjs-navmenu-nav-link link-button'} value={'CreateDicom'} onClick={clickHandler}>
                Create Dicom
              </button>
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

export default ImportRootPanel