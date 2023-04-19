import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, ButtonGroup, Button } from "react-bootstrap"

import { toast } from 'react-toastify'
import MonitorJob from '../../tools/MonitorJob'
import apis from '../../services/apis'

export default ({ level, studyInstanceUID, queryAet, seriesInstanceUID }) => {

  const [status, setStatus] = useState('Retrieve')
  const [resultAnswer, setResultAnswer] = useState({})

  const RetrieveButton = {
    Study: 0,
    Series: 1
  }

  const dispatch = useDispatch()

  const getVariant = () => {
    if (status === 'Retrieve') return 'info'
    else if (status === MonitorJob.Pending) return 'warning'
    else if (status === MonitorJob.Success) return 'success'
    else if (status === MonitorJob.Failure) return 'danger'
  }

  const toAnon = async () => {
    let studyDetails = []
    if (level === RetrieveButton.Study) {
      studyDetails.push(resultAnswer)
    } else if (level === RetrieveButton.Series) {
      let retrievedStudy = await apis.content.getStudiesDetails(resultAnswer.ParentStudy)
      studyDetails.push(retrievedStudy)
    }
    dispatch.addStudiesToAnonList(studyDetails)

  }

  const toExport = async () => {
    let seriesDetails = []
    let studyDetails = []
    if (level === RetrieveButton.Study) {
      let retrievedSeries = await apis.content.getSeriesDetails(resultAnswer['ID'])
      seriesDetails = retrievedSeries
      studyDetails.push(resultAnswer)
    } else if (level === RetrieveButton.Series) {
      seriesDetails = [resultAnswer]
      let retrievedStudy = await apis.content.getStudiesDetails(resultAnswer.ParentStudy)
      studyDetails.push(retrievedStudy)
    }

    dispatch.addToExportList(seriesDetails, studyDetails)

  }

  useEffect(() => {
    //return () => { if (this.monitorJob != null) this.monitorJob.stopMonitoringJob() }
  }, [])


  const doRetrieve = async (e) => {
    e.stopPropagation()


    let jobID

    try {

      if (level === RetrieveButton.Study) {
        jobID = await apis.retrieve.retrieveByUID(queryAet, studyInstanceUID, null)
      } else if (level === RetrieveButton.Series) {
        jobID = await apis.retrieve.retrieveByUID(queryAet, studyInstanceUID, seriesInstanceUID)
      }

    } catch (error) {
      toast.error(error.statusText, { data: { type: 'notification' } })
      return
    }


    let monitorJobLocal = new MonitorJob(jobID)

    let self = this

    monitorJobLocal.onUpdate(function (progress) {
      setStatus(MonitorJob.Pending)
    })

    monitorJobLocal.onFinish(function (status) {
      setStatus(status)
      if (status === MonitorJob.Success) {
        self.getOrthancIDbyStudyUID()
      }
    })

    monitorJobLocal.startMonitoringJob()
    this.monitorJob = monitorJobLocal

  }

  const handleDropdownClick = (e) => {
    e.stopPropagation()
  }

  const getOrthancIDbyStudyUID = async () => {

    let contentSearch = {
      CaseSensitive: false,
      Expand: true,
      Query: {}
    }

    if (level === RetrieveButton.Study) {
      contentSearch.Query.StudyInstanceUID = studyInstanceUID
      contentSearch.Level = 'Study'
    } else if (level === RetrieveButton.Series) {
      contentSearch.Level = 'Series'
      contentSearch.Query.SeriesInstanceUID = seriesInstanceUID
    }
    try {
      let searchContent = await apis.content.getOrthancFind(contentSearch)
      setResultAnswer(searchContent[0])
    } catch (error) {
      toast.error(error.statusText, { data: { type: 'notification' } })
    }

  }

  return (
    <Dropdown as={ButtonGroup} onClick={handleDropdownClick} >
      <Button variant={getVariant()} onClick={doRetrieve} >{status}</Button>

      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

      <Dropdown.Menu>
        <Dropdown.Item onClick={toExport} disabled={status !== MonitorJob.Success}>To Export</Dropdown.Item>
        <Dropdown.Item onClick={toAnon} disabled={status !== MonitorJob.Success} >To Anon</Dropdown.Item>
        <Link className={status === MonitorJob.Success ? "dropdown-item" : "dropdown-item disabled"} to={'viewer/' + studyInstanceUID} target='_blank'>View on OHIF</Link>
      </Dropdown.Menu>
    </Dropdown>
  )

}



