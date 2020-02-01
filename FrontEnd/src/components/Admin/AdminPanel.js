import React, { Component } from 'react'
import Options from './Options'
import RobotStatus from './RobotStatus'
import Aets from './Aets'
import Aet_Form from './Aet_Form'

export default class AdminPanel extends Component {

    render() {
        return (
            <div className="jumbotron">
                <Options />
                <RobotStatus />
                <Aets />
                <Aet_Form />
            </div>
        )
    }
}
