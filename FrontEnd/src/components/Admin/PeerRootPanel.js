import React, { useState, useEffect } from 'react'
import Peer from './PeerListTable'
import PeerForm from './PeerForm'
import apis from '../../services/apis'

/**
 * Root Panel of Peers options
 */
const PeerRootPanel = () => {
  const [peer, setPeers] = useState([])

  /**
     * Replacement of ComponentDidMount
     * See https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
     */
  useEffect(() => {
    refreshPeersData()
  }, []
  )

  /**
     * Get Peer Data from backend
     */
  async function refreshPeersData () {
    const peersAnswer = await apis.peers.getPeersExpand()
    setPeers(peersAnswer)
  }

  return (
    <>
      <Peer PeersData={peer} refreshPeerData={refreshPeersData} />
      <PeerForm refreshPeerData={refreshPeersData} />
    </>
  )
}

export default PeerRootPanel
