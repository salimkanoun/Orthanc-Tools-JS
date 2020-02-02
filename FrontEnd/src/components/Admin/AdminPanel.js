import React, { Component } from 'react'
import Options from './Options'
import RobotStatus from './RobotStatus'
import Aets from './Aets'
import AetForm from './AetForm'

export default class AdminPanel extends Component {

    render() {
        return (
            <div className="jumbotron">
                <Options />
                <RobotStatus />
                <Aets />
                <AetForm />
            </div>
        )
    }
}
