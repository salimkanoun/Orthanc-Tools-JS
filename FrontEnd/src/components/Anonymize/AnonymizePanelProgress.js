import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

import AnonymizeRobotDetails from './AnonymizeRobotDetails'

import { addToAnonymizedList, emptyAnonymizeList } from '../../actions/AnonList'

import apis from '../../services/apis';


class AnonymizePanelProgress extends Component {

    state = { 
            showRobotDetails: false, 
            success: 0, 
            failures: 0,
            numberOfItem : 0,
            robotItems : []
    }

    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this)
        this.toogleModal = this.toogleModal.bind(this)
    }

    toogleModal(){
        this.setState({
            showRobotDetails: !this.state.showRobotDetails
        })
    }
    
    componentDidMount() {
        this.startMonitoring()
    }

    startMonitoring(){
        this.intervalChcker = setInterval(() => this.getInfo(), 2000)
    }

    stopMonitoring(){
        if(this.intervalChcker !== undefined) clearInterval(this.intervalChcker)
        this.props.emptyAnonymizeList()
        this.props.setProgress(false)
    }

    async getInfo(){
        let success = 0
        let failures = 0
        let robot = await apis.anon.getAnonJob(this.props.username)
        console.log(robot.items)
        this.setState({
            robotItems : robot.items
        })

        robot.items.forEach(async item => {

            
            switch (item.Status) {
                case 'Success':
                    success = success + 1
                    let studyDetail = await apis.content.getStudiesDetails(item.anonymizedOrthancStudyID)
                    if (studyDetail !== undefined)
                        this.props.addToAnonymizedList([studyDetail])
                    break
                case 'Failures':
                    failures = failures + 1
                    break
                default:
                    break
            }
        })

        this.setState({
            success: success, 
            failures: failures,
            numberOfItem : robot.items.length
        })
        if (robot.status === 'Finished') {this.stopMonitoring()}
    }

    render() {
        //Calculate progression to display
        let successPercent
        let failuresPercent
        let itemProgression
        if(this.state.numberOfItem !== 0){
            successPercent = 100*this.state.success/this.state.numberOfItem
            failuresPercent = 100*this.state.failures/this.state.numberOfItem
            itemProgression = this.state.success + this.state.failures

        }else {
            successPercent = 0
            failuresPercent = 0
            itemProgression = 0
        }


        return (
            <Fragment>
                <AnonymizeRobotDetails show = {this.state.showRobotDetails} onHide = {this.toogleModal} robotItems={this.state.robotItems}/>
                <div className="col-md-2 text-left">
                    <CircularProgressbarWithChildren
                        value={successPercent}
                        text={'Studies Done : ' + itemProgression + '/'+ this.state.numberOfItem}
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

                <button type='button' className='btn btn-info float-right mr-2' onClick={()=>this.toogleModal()} >Show Details</button>
                <button type='button' className='btn btn-danger float-right mr-2' onClick={()=>alert('not implemented yet')} disabled>Delete</button>
                <button type='button' className='btn btn-primary float-right mr-2' onClick={()=>alert('not implemented yet')} disabled>Resume</button>
                <button type='button' className='btn btn-warning float-right mr-2' onClick={()=>alert('not implemented yet')} disabled>Pause</button>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        anonymizedList: state.AnonList.anonymizedList,
        username: state.OrthancTools.username
    }
}

const mapsDispatchToProps = {
    addToAnonymizedList,
    emptyAnonymizeList
}

export default connect(mapStateToProps, mapsDispatchToProps)(AnonymizePanelProgress)