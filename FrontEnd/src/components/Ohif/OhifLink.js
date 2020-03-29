import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * OHIF Link to open OHIF viewer in another Tab
 * The Backend redirect this destination to OHIF static HTML page integration
 */
export default class OhifLink extends Component {
  render () {
    return (
      <Link to={'/viewer/' + this.props.studyInstanceUID} target='_blank'>View</Link>
    )
  }
}
