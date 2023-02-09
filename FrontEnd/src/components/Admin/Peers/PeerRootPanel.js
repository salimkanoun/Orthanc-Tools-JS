import React from 'react'
import PeerForm from './PeerForm'
import apis from '../../../services/apis'
import PeerTable from './PeerTable'
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'

/**
 * Root Panel of Peers options
 */
export default () => {

  const { data: peers, isLoading: isLoadingPeers } = useCustomQuery(
    ['peers'],
    () => apis.peers.getPeersExpand(),
    undefined,
    (answer) => {
      return Object.entries(answer).map(([peerName, data]) => ({
        name: peerName,
        ...data
      })
      )
    }
  )


  if (isLoadingPeers) return "Loading..."

  return (
    <>
      <PeerTable peersData={peers} />
      <PeerForm />
    </>
  )
}

