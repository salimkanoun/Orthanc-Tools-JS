import React, { useState, useEffect } from 'react'
import Aets from './AetsListTable'
import AetForm from './AetForm'
import apis from '../../../services/apis'

/**
 * Root Panel of AETs options
 */
const AetRootPanel = () => {
  const [aets, setAets] = useState([])

  /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
  useEffect(() => {
    refreshAetsData()
  }, []
  )

  /**
     * Get Aets Data from backend
     */
  async function refreshAetsData () {
    const aetsAnswer = await apis.aets.getAetsExpand()
    setAets(aetsAnswer)
  }

  return (
    <>
      <Aets aetsData={aets} refreshAetData={refreshAetsData} />
      <AetForm refreshAetData={refreshAetsData} />
    </>
  )
}

export default AetRootPanel
