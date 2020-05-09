import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropdown from "react-bootstrap/Dropdown"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"

import { addToDeleteList } from '../../../actions/DeleteList'
import { addToExportList } from '../../../actions/ExportList'
import { addToAnonList } from '../../../actions/AnonList'

import MonitorJob from '../../../tools/MonitorJob'
import apis from '../../../services/apis'

class RetrieveButton extends Component {

  state = {
    status: 'Retrieve'
  }

  constructor(props) {
    super(props)
    this.doRetrieve = this.doRetrieve.bind(this)
    this.handleDropdownClick = this.handleDropdownClick.bind(this)
    this.toExport = this.toExport.bind(this)
  }

  getVariant() {
    if (this.state.status === 'Retrieve') return 'info'
    else if (this.state.status === MonitorJob.Pending ) return 'warning'
    else if (this.state.status === MonitorJob.Success ) return 'success'
    else if (this.state.status === MonitorJob.Failure ) return 'error'
  }

  async toExport(){
    if(this.resultAnswer === undefined) return
    let seriesDetails
    if( this.props.level ===  RetrieveButton.Study ){
        seriesDetails = await apis.content.getSeriesDetails(this.resultAnswer['ID'])
        console.log(seriesDetails)
    } else if ( this.props.level === RetrieveButton.Series ){
      seriesDetails = this.resultAnswer
    }
    
    this.props.addToExportList(seriesDetails)
  }

  render() {
    return (
      <Dropdown as={ButtonGroup} onClick={this.handleDropdownClick} >
        <Button variant={this.getVariant()} onClick={this.doRetrieve} >{this.state.status}</Button>

        <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

        <Dropdown.Menu>
          <Dropdown.Item onClick={this.toExport}>To Export</Dropdown.Item>
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
    this.resultAnswer = searchContent[0]
    
  }

}


const mapDispatchToProps = {
  addToDeleteList,
  addToAnonList,
  addToExportList
}

RetrieveButton.Study = 0
RetrieveButton.Series = 1

export default connect(null, mapDispatchToProps)(RetrieveButton)


