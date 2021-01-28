import React, { useState, useEffect, Fragment } from 'react'
import PeerListTable from './PeerListTable'
import PeerForm from './PeerForm'
import apis from '../../../services/apis'
import { toast } from 'react-toastify'

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
  const refreshPeersData = async () => {

    try{
      const peersAnswer = await apis.peers.getPeersExpand()
      setPeers(peersAnswer)
    } catch (error){
      toast.error(error.statusText)
    }

  }

  return (
    <Fragment>
      <PeerListTable peersData={peer} refreshPeerData={refreshPeersData} />
      <PeerForm refreshPeerData={refreshPeersData} />
    </Fragment>
  )
}

export default PeerRootPanel