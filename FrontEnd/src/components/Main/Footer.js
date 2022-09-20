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
                  <span className="me-3">MTA-AdminMed: {packageInfo.version}</span>About
              </button>
        </div>

        <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
          <Modal.Header closeButton >
            About
          </Modal.Header>
          <Modal.Body >
            <pre>
            MTA-AdminMed{'\n\n'}
                    Maintainer : MTA team (@gmail.com){'\n\n'}
                    Contributors : {'\n\n'}
                    Licence : AGPL v.3{'\n\n'}
              {/* <a href='https://github.com/salimkanoun/Orthanc-Tools-JS/'>https://github.com/salimkanoun/Orthanc-Tools-JS/</a> */}
            </pre>

          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }

}