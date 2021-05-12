import React, { Component } from 'react';

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

import MonitorTask from '../../tools/MonitorTask';


class AnonymizePanelProgress extends Component {

    state = {
        success: 0,
        failures: 0,
        numberOfItem: 0,
        robotItems: []
    }

    toogleModal = () => {
        this.setState({
            showRobotDetails: !this.state.showRobotDetails
        })
    }

    componentDidMount = () => {
        if (this.props.anonTaskID) {
            this.startMonitoring();
        }
    }

    componentWillUnmount = () => {
        this.stopMonitoring()
    }

    startMonitoring = () => {
        this.task = new MonitorTask(this.props.anonTaskID, 2000)
        this.task.onUpdate((info) => {
            let success = 0
            let failures = 0
            info.details.items.forEach(async item => {
                switch (item.state) {
                    case 'completed':
                        success++
                        break
                    case 'failed':
                        failures++
                        break
                    default:
                        break
                }
            })
            this.setState({
                success,
                failures,
                numberOfItem: info.details.items.length
            })
            if (success + failures === info.details.items.length) {
                this.stopMonitoring()
            }
        })


        this.task.startMonitoringJob()
    }

    stopMonitoring = () => {
        if (this.task) this.task.stopMonitoringJob()
    }

    render = () => {
        //Calculate progression to display
        let successPercent
        let failuresPercent
        let itemProgression
        if (this.state.numberOfItem !== 0) {
            successPercent = 100 * this.state.success / this.state.numberOfItem
            failuresPercent = 100 * this.state.failures / this.state.numberOfItem
            itemProgression = this.state.success + this.state.failures

        } else {
            successPercent = 0
            failuresPercent = 0
            itemProgression = 0
        }


        return (
            <CircularProgressbarWithChildren
                value={successPercent}
                text={'Studies Done : ' + itemProgression + '/' + this.state.numberOfItem}
                styles={buildStyles({
                    textSize: '8px'
                })}>

                <CircularProgressbar
                    value={failuresPercent}
                    styles={buildStyles({
                        pathColor: "#f00",
                        trailColor: "transparent"
                    })}
                />
            </CircularProgressbarWithChildren>

        )
    }
}



export default AnonymizePanelProgress