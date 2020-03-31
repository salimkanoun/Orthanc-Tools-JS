import React, { Component } from 'react'
import apis from '../../../services/apis'

/**
 * Retrieve Button
 * Click start the retrieve process of a ressource (study or series identified by UID)
 * Color of button change with retrieve status (embedded monitoring of job retrieve)
 * Props : 
 * level (see static variable)
 * uid (series ou study instance uid)
 * queryAet (source of retrieve)
 */
export default class RetrieveButton extends Component {

  constructor(props) {
    super(props)
    this.doRetrieve = this.doRetrieve.bind(this)
    this.state = {
      status: 'Idle'
    }
  }

  getClassFromStatus() {
    if (this.state.status === 'Idle') return 'btn btn-info btn-large'
    else if (this.state.status === 'Running' || this.state.status === 'Pending') return 'btn btn-warning btn-large'
    else if (this.state.status === 'Success') return 'btn btn-success btn-large'
    else if (this.state.status === 'Failure') return 'btn btn-error btn-large'
  }

  render() {
    const classNameValue = this.getClassFromStatus()
    return (<div className='col-sm'>
      <input type='button' className={classNameValue} onClick={this.doRetrieve} value='Retrieve' />
    </div>)
  }

  async doRetrieve() {

    let level = this.props.level
    let uid = this.props.uid
    let queryAet = this.props.queryAet

    this.setState({
      status: 'Pending'
    })

    const postData = {}

    if( level ===  RetrieveButton.Study ){
      postData.seriesInstanceUID = uid
      postData.aet = queryAet

    } else if ( level === RetrieveButton.Series ){
      postData.studyInstanceUID = uid
      postData.aet = queryAet
    }

    let jobUID = await apis.retrieve.retrieveByUID(postData)

    this.startMonitoringJob(jobUID)
  }

  startMonitoringJob(jobUID) {
    this.intervalChcker = setInterval(() => this.jobMonitoring(jobUID), 2000)
  }

  stopMonitoringJob() {
    clearInterval(this.intervalChcker)
  }

  jobMonitoring(jobUID) {
    const jobData = apis.jobs.getJobData(jobUID)
    const currentStatus = jobData.State
    this.setState({
      status: currentStatus
    })

    if (currentStatus === 'Success' || currentStatus === 'Failure') {
      this.stopMonitoringJob()
    }

  }

}

RetrieveButton.Study = 0
RetrieveButton.Series = 1
