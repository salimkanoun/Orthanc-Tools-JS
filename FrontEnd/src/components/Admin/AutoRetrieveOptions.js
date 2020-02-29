import React, { Component, Fragment } from 'react'
import Options from './Options'
import RobotStatus from './RobotStatus'

export default class AutoRetrieveOptions extends Component {

    render(){
        return (
            <Fragment>
                <Options />
                <RobotStatus />
            </Fragment>
        )
    }

}