import React from 'react'
import { Link } from 'react-router-dom'

/**
 * OHIF Link to open OHIF viewer in another Tab
 * The Backend redirect this destination to OHIF static HTML page integration
 */
export default ({ StudyInstanceUID, className }) => {
  return (
    StudyInstanceUID === undefined ?
      null
      :
      <Link className={className} to={'/viewer-stone/index.html?study=' + StudyInstanceUID} target='_blank'>View in Stone</Link>
  )
} 