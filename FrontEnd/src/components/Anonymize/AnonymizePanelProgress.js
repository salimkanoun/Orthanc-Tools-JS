import React, { Component, Fragment } from 'react';

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

import AnonymizeRobotDetails from './AnonymizeRobotDetails';
import MonitorTask from '../../tools/MonitorTask';


class AnonymizePanelProgress extends Component {

    state = {
        showRobotDetails: false,
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
            <Fragment>
                <div className = "jumbotron">
                    <h2 className='card-title mb-3'>Anonymize in progress</h2>
                    <AnonymizeRobotDetails show={this.state.showRobotDetails} onHide={this.toogleModal} robotItems={this.state.robotItems} />
                    <div className="col-md-2 text-left">
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
                    </div>

                    <button type='button' className='btn btn-info float-right mr-2' onClick={() => this.toogleModal()} disabled>Show Details</button>
                    <button type='button' className='btn btn-danger float-right mr-2' onClick={() => alert('not implemented yet')} disabled>Delete</button>
                    <button type='button' className='btn btn-primary float-right mr-2' onClick={() => alert('not implemented yet')} disabled>Resume</button>
                    <button type='button' className='btn btn-warning float-right mr-2' onClick={() => alert('not implemented yet')} disabled>Pause</button>
                </div>
            </Fragment>
        )
    }
}



export default AnonymizePanelProgress