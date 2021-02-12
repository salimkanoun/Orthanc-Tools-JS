import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Dropdown from "react-bootstrap/Dropdown"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"

import { addToExportList } from '../../../actions/ExportList'
import { addStudiesToAnonList } from '../../../actions/AnonList'

import MonitorJob from '../../../tools/MonitorJob'
import apis from '../../../services/apis'
import { toast } from 'react-toastify'

class RetrieveButton extends Component {

  state = {
    status: 'Retrieve',
    resultAnswer: {}
  }

  getVariant = () => {
    if (this.state.status === 'Retrieve') return 'info'
    else if (this.state.status === MonitorJob.Pending) return 'warning'
    else if (this.state.status === MonitorJob.Success) return 'success'
    else if (this.state.status === MonitorJob.Failure) return 'danger'
  }

  toAnon = async () => {
    let studyDetails = []
    if (this.props.level === RetrieveButton.Study) {
      studyDetails.push(this.state.resultAnswer)
    } else if (this.props.level === RetrieveButton.Series) {
      let retrievedStudy = await apis.content.getStudiesDetails(this.state.resultAnswer.ParentStudy)
      studyDetails.push(retrievedStudy)
    }
    this.props.addStudiesToAnonList(studyDetails)

  }

  toExport = async () => {
    let seriesDetails = []
    let studyDetails = []
    if (this.props.level === RetrieveButton.Study) {
      let retrievedSeries = await apis.content.getSeriesDetails(this.state.resultAnswer['ID'])
      seriesDetails = retrievedSeries
      studyDetails.push(this.state.resultAnswer)
    } else if (this.props.level === RetrieveButton.Series) {
      seriesDetails = [this.state.resultAnswer]
      let retrievedStudy = await apis.content.getStudiesDetails(this.state.resultAnswer.ParentStudy)
      studyDetails.push(retrievedStudy)
    }

    this.props.addToExportList(seriesDetails, studyDetails)

  }

  render = () => {
    return (
      <Dropdown as={ButtonGroup} onClick={this.handleDropdownClick} >
        <Button variant={this.getVariant()} onClick={this.doRetrieve} >{this.state.status}</Button>

        <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

        <Dropdown.Menu>
          <Dropdown.Item onClick={this.toExport} disabled={this.state.status !== MonitorJob.Success}>To Export</Dropdown.Item>
          <Dropdown.Item onClick={this.toAnon} disabled={this.state.status !== MonitorJob.Success} >To Anon</Dropdown.Item>
          <Link className={this.state.status === MonitorJob.Success ? "dropdown-item" : "dropdown-item disabled"} to={'viewer/' + this.props.studyInstanceUID} target='_blank'>View on OHIF</Link>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  componentWillUnmount = () => {
    if (this.monitorJob !== undefined) this.monitorJob.stopMonitoringJob()
  }

  doRetrieve = async (e) => {
    e.stopPropagation()

    let level = this.props.level
    let queryAet = this.props.queryAet

    let jobID

    try{

      if (level === RetrieveButton.Study) {
        jobID = await apis.retrieve.retrieveByUID(queryAet, this.props.studyInstanceUID, null)
      } else if (level === RetrieveButton.Series) {
        jobID = await apis.retrieve.retrieveByUID(queryAet, this.props.studyInstanceUID, this.props.seriesInstanceUID)
      }

    } catch (error){
      toast.error(error.statusText)
      return
    }


    let monitorJob = new MonitorJob(jobID)

    let self = this

    monitorJob.onUpdate(function (progress) {
      self.setState({
        status: MonitorJob.Pending
      })
    })

    monitorJob.onFinish(function (status) {
      self.setState({
        status: status
      })
      if (status === MonitorJob.Success) {
        self.getOrthancIDbyStudyUID()
      }
    })

    monitorJob.startMonitoringJob()
    this.monitorJob = monitorJob

  }

  handleDropdownClick = (e) => {
    e.stopPropagation()
  }

  getOrthancIDbyStudyUID = async () => {

    let contentSearch = {
      CaseSensitive: false,
      Expand: true,
      Query: {}
    }

    if (this.props.level === RetrieveButton.Study) {
      contentSearch.Query.StudyInstanceUID = this.props.studyInstanceUID
      contentSearch.Level = 'Study'
    } else if (this.props.level === RetrieveButton.Series) {
      contentSearch.Level = 'Series'
      contentSearch.Query.SeriesInstanceUID = this.props.seriesInstanceUID
    }
    try {
      let searchContent = await apis.content.getOrthancFind(contentSearch)
      this.setState({
        resultAnswer: searchContent[0]
      })
    } catch (error) {
      toast.error(error.statusText)
    }

  }

}

const mapDispatchToProps = {
  addStudiesToAnonList,
  addToExportList
}

RetrieveButton.Study = 0
RetrieveButton.Series = 1

export default connect(null, mapDispatchToProps)(RetrieveButton)


