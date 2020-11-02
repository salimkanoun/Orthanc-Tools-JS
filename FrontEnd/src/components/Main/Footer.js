import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal'

export default class Footer extends Component {

  state={show: false}

  render () {
        return (
          <Fragment>
              <div className="footer-copyright text-center">Orthanc Tools JS: 0.4.7

              <button type="button" className='link-button ml-3' onClick={() => this.setState(prevState => ({show: !prevState.show}))}>About</button>
              </div>

              <Modal show={this.state.show} onHide={() => this.setState({show: false})}>
                <Modal.Header closeButton >
                  About
                </Modal.Header>
                <Modal.Body>
                  <pre>
                    Orthanc Tools JS{'\n\n'}
                    Maintainer : Salim Kanoun (salim.kanoun@gmail.com){'\n\n'}
                    Contributors : Sylvain Berthier, Leo Couderc{'\n\n'}
                    Licence : AGPL v.3{'\n\n'}
                    <a href='https://github.com/salimkanoun/Orthanc-Tools-JS/'>https://github.com/salimkanoun/Orthanc-Tools-JS/</a>
                  </pre>
                
                </Modal.Body>
              </Modal>
          </Fragment>
            
            
    )
  }
  
}