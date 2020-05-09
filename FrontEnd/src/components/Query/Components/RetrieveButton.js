import React, { Component } from 'react'
import Dropdown from "react-bootstrap/Dropdown"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"

import MonitorJob from '../../../tools/MonitorJob'
import apis from '../../../services/apis'

export default class RetrieveButton extends Component {

  state = {
    status: 'Retrieve'
  }

  constructor(props) {
    super(props)
    this.doRetrieve = this.doRetrieve.bind(this)
    this.handleDropdownClick = this.handleDropdownClick.bind(this)
  }

  getClassFromStatus() {
    if (this.state.status === 'Retrieve') return 'btn btn-info btn-large'
    else if (this.state.status === MonitorJob.Pending ) return 'btn btn-warning btn-large'
    else if (this.state.status === MonitorJob.Success ) return 'btn btn-success btn-large'
    else if (this.state.status === MonitorJob.Failure ) return 'btn btn-error btn-large'
  }

  render() {
    const classNameValue = this.getClassFromStatus()
    return (
      <Dropdown as={ButtonGroup} onClick={this.handleDropdownClick} >
        <Button variant="success" onClick={this.doRetrieve} >{this.state.status}</Button>

        <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

        <Dropdown.Menu>
          <Dropdown.Item >To Export</Dropdown.Item>
          <Dropdown.Item >To Anon</Dropdown.Item>
          <Dropdown.Item >To Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  componentWillUnmount(){
    if(this.monitorJob !== undefined) this.monitorJob.stopMonitoringJob()
  }

  async doRetrieve(e) {
    e.stopPropagation()

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
      if(status === MonitorJob.Success){
        self.getOrthancIDbyStudyUID()
      }
    })

    monitorJob.startMonitoringJob()
    this.monitorJob = monitorJob

  }

  handleDropdownClick(e){
    e.stopPropagation()

  }

  async getOrthancIDbyStudyUID(){
    let contentSearch = {
      CaseSensitive: false,
      Expand: true, 
      Query: {
      }
    }

    if( this.props.level ===  RetrieveButton.Study ){
      contentSearch.Query.StudyInstanceUID = this.props.uid
      contentSearch.Level = 'Study'
    } else if ( this.props.level === RetrieveButton.Series ){
      contentSearch.Level = 'Series'
      contentSearch.Query.SeriesInstanceUID = this.props.uid
    }

    let searchContent = await apis.content.getContent(contentSearch)
    console.log(searchContent)
    return searchContent[0]['ID']
    
  }

}

RetrieveButton.Study = 0
RetrieveButton.Series = 1
