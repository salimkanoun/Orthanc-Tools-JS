import React, { Component } from 'react'

import MonitorJob from '../../../tools/MonitorJob'
import apis from '../../../services/apis'

/**
 * Retrieve Button
 * Click starts the retrieve process of a ressource (study or series identified by UID)
 * Color of button change with retrieve status (embedded monitoring of job retrieve)
 * Props : 
 *  level (see static variable)
 *  uid (series ou study instance uid)
 *  queryAet (source of retrieve)
 */
export default class RetrieveButton extends Component {

  state = {
    status: 'Retrieve'
  }

  constructor(props) {
    super(props)
    this.doRetrieve = this.doRetrieve.bind(this)
  }

  getClassFromStatus() {
    if (this.state.status === 'Retrieve') return 'btn btn-info btn-large'
    else if (this.state.status === MonitorJob.Pending ) return 'btn btn-warning btn-large'
    else if (this.state.status === MonitorJob.Success ) return 'btn btn-success btn-large'
    else if (this.state.status === MonitorJob.Failure ) return 'btn btn-error btn-large'
  }

  render() {
    const classNameValue = this.getClassFromStatus()
    return (<div className='col-sm'>
      <input type='button' className={classNameValue} onClick={this.doRetrieve} value={this.state.status} />
    </div>)
  }

  componentWillUnmount(){
    if(this.monitorJob !== undefined) this.monitorJob.stopMonitoringJob()
  }

  async doRetrieve() {

    let level = this.props.level
    let uid = this.props.uid
    let queryAet = this.props.queryAet

    const postData = {}

    if( level ===  RetrieveButton.Study ){
      postData.studyInstanceUID = uid
      postData.aet = queryAet

    } else if ( level === RetrieveButton.Series ){
      postData.seriesInstanceUID = uid
      postData.aet = queryAet
    }

    let jobID = await apis.retrieve.retrieveByUID(postData)

    let monitorJob = new MonitorJob(jobID)

    let self = this
    monitorJob.onUpdate(function(progress){
      self.setState({
        status: MonitorJob.Pending
      })
    })

    monitorJob.onFinish(function(status){
      self.setState({
        status: status
      })

    })

    monitorJob.startMonitoringJob()
    this.monitorJob = monitorJob

  }

}

RetrieveButton.Study = 0
RetrieveButton.Series = 1
