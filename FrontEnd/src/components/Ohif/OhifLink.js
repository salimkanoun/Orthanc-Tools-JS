import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * OHIF Link to open OHIF viewer in another Tab
 * The Backend redirect this destination to OHIF static HTML page integration
 */
export default class OhifLink extends Component {
  render () {
    if(this.props.StudyInstanceUID === undefined) {
      return (null)
    }
    return (
      <Link className={this.props.className} to={'viewer/' + this.props.StudyInstanceUID} target='_blank'>View on OHIF</Link>
    )
  }
}
