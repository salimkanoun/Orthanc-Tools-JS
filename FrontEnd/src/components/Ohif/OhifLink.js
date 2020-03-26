import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class OhifLink extends Component {
  render () {
    return (<Link to={'/viewer/' + this.props.studyInstanceUID} target='_blank'>View</Link>)
  }
}
