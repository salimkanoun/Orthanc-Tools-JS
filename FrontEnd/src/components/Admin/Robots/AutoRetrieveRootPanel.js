import React, { Fragment, Component } from 'react'
import AutoRetrieveSchedule from './AutoRetrieveSchedule'
import RobotStatus from './RobotStatus'

export default class AutoRetrieveRootPanel extends Component {

  render() {
    return (
      <Fragment>
        <AutoRetrieveSchedule />
        <RobotStatus />
      </Fragment>
    )
  }
  
}
