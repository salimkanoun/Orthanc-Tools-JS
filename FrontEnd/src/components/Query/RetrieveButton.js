import React, { useState } from 'react'

import { Button } from 'react-bootstrap'

import apis from '../../services/apis'
import { errorMessage, jobMessageToNotificationCenter } from '../../tools/toastify'

export default ({ level, studyInstanceUID, queryAet, seriesInstanceUID }) => {

  const LEVEL_STUDY = "Study"
  const LEVE_SERIES = "Series"

  const [disabled, setDisabled] = useState(false)

  const doRetrieve = async (e) => {
    e.stopPropagation()

    let jobID

    try {

      if (level === LEVEL_STUDY) {
        jobID = await apis.retrieve.retrieveByUID(queryAet, studyInstanceUID, null)
      } else if (level === LEVE_SERIES) {
        jobID = await apis.retrieve.retrieveByUID(queryAet, studyInstanceUID, seriesInstanceUID)
      }
      setDisabled(true)
      jobMessageToNotificationCenter('Retrieve', { ID: jobID, level: level, studyInstanceUID: studyInstanceUID, seriesInstanceUID: seriesInstanceUID })
    } catch (error) {
      errorMessage(error?.data?.errorMessage ?? "Can't initiate retrieve")
      return
    }
  }

  return (
    <Button disabled={disabled} variant="info" onClick={doRetrieve} >{'Retrieve'}</Button>
  )

}