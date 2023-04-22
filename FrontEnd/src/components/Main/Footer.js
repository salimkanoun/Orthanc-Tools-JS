import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

import packageInfo from '../../../package.json'

export default () => {

  const [show, setShow] = useState(false)

  return (
    <>
      <Modal size="lg" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton >
          About
        </Modal.Header>
        <Modal.Body >
          <pre>
            Orthanc Tools JS{'\n\n'}
            Maintainer : Salim Kanoun (salim.kanoun@gmail.com){'\n\n'}
            Contributors : Delphine Decap, Sylvain Berthier, Leo Couderc, Matthieu Legrand, Julien Davidou{'\n\n'}
            Licence : AGPL v.3{'\n\n'}
            <a href='https://github.com/salimkanoun/Orthanc-Tools-JS/'>https://github.com/salimkanoun/Orthanc-Tools-JS/</a>
          </pre>
        </Modal.Body>
      </Modal>
      <div className="footer text-center mb-3">
        <Button className='link-button ms-3 footer-text' onClick={() => setShow(show => !show)}>
          <span className="me-3">Orthanc Tools JS: {packageInfo.version}</span>About
        </Button>
      </div>
    </>
  )
}