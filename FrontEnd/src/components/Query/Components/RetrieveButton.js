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
    else if (this.state.status === RetrieveButton.Pending ) return 'btn btn-warning btn-large'
    else if (this.state.status === RetrieveButton.Success ) return 'btn btn-success btn-large'
    else if (this.state.status === RetrieveButton.Failure ) return 'btn btn-error btn-large'
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
      status: RetrieveButton.Pending
    })

    const postData = {}

    if( level ===  RetrieveButton.Study ){
      postData.studyInstanceUID = uid
      postData.aet = queryAet

    } else if ( level === RetrieveButton.Series ){
      postData.seriesInstanceUID = uid
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

  async jobMonitoring(jobUID) {
    const jobData = await apis.jobs.getJobInfos(jobUID)
    const currentStatus = jobData.State
    this.setState({
      status: currentStatus
    })

    if (currentStatus === RetrieveButton.Success || currentStatus === RetrieveButton.Failure ) {
      this.stopMonitoringJob()
    }

  }

}

RetrieveButton.Study = 0
RetrieveButton.Series = 1

RetrieveButton.Success = 'Success'
RetrieveButton.Failure = 'Failure'
RetrieveButton.Pending = 'Pending'
