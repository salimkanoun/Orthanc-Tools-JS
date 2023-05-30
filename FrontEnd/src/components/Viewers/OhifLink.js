import React from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../services/axios'

/**
 * OHIF Link to open OHIF viewer in another Tab
 * The Backend redirect this destination to OHIF static HTML page integration
 */
export default ({ StudyInstanceUID, className }) => {
  const token = getToken()
  return (
    StudyInstanceUID === undefined ?
      null
      :
      <Link className={className} to={'/viewer-ohif/viewer?StudyInstanceUIDs=' + StudyInstanceUID + '&token=' + token} target='_blank'>View in OHIF</Link>
  )
}
