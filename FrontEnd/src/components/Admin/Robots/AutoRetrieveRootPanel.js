import React, { Fragment, Component } from 'react'
import AutoRetrieveSchedule from './AutoRetrieveSchedule'
import RobotStatus from './RobotStatus'

export default ({ }) => {

  return (
    <Fragment>
      <AutoRetrieveSchedule />
      <RobotStatus />
    </Fragment>
  )
}
