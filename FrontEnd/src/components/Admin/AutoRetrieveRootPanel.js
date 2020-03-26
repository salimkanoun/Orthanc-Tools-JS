import React, { Component } from 'react'
import AutoRetrieveSchedule from './AutoRetrieveSchedule'
import RobotStatus from './RobotStatus'

export default class AutoRetrieveRootPanel extends Component {
  render () {
    return (
      <>
        <AutoRetrieveSchedule />
        <RobotStatus />
      </>
    )
  }
}
