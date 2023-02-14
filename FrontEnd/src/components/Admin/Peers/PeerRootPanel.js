import React from 'react'
import PeerForm from './PeerForm'
import apis from '../../../services/apis'
import PeerTable from './PeerTable'
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'
import { keys } from '../../../model/Constant'

/**
 * Root Panel of Peers options
 */
export default () => {

  const { data: peers, isLoading: isLoadingPeers } = useCustomQuery(
    [keys.PEERS_KEY],
    () => apis.peers.getPeersExpand(),
    undefined,
    (answer) => {
      console.log(answer)
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

