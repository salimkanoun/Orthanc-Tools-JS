import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal'
import packageInfo from '../../../package.json'

export default class Footer extends Component {

  state = { show: false }

  render = () => {
    return (
      <Fragment>
        <div className="footer text-center mb-3">
              
              <button type="button" className='link-button ms-3 footer-text' onClick={() => this.setState(prevState => ({ show: !prevState.show }))}>
                  <span className="me-3">Orthanc Tools JS: {packageInfo.version}</span>About
              </button>
        </div>

        <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
          <Modal.Header closeButton >
            About
          </Modal.Header>
          <Modal.Body >
            <pre>
              Orthanc Tools JS{'\n\n'}
                    Maintainer : Salim Kanoun (salim.kanoun@gmail.com){'\n\n'}
                    Contributors : Sylvain Berthier, Leo Couderc, Matthieu Legrand, Julien Davidou{'\n\n'}
                    Licence : AGPL v.3{'\n\n'}
              <a href='https://github.com/salimkanoun/Orthanc-Tools-JS/'>https://github.com/salimkanoun/Orthanc-Tools-JS/</a>
            </pre>

          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }

}