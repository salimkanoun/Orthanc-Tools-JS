import React, { Component } from 'react'
import Options from './Options'
import RobotStatus from './robot_status'

export default class AdminPanel extends Component {

    render() {
        return (
            <div className="jumbotron">
                <Options />
                <RobotStatus />
            </div>
        )
    }
}
