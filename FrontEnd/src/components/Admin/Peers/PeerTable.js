import React from 'react'
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import { useCustomMutation } from '../../CommonComponents/ReactQuery/hooks';
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';
import { keys } from '../../../model/Constant';

/**
 * Table with known Peers details with Echo and Remove butto
 */

export default ({ peersData }) => {

    const deletePeer = useCustomMutation(
        ({ name }) => apis.peers.deletePeer(name),
        [[keys.PEERS_KEY]]
    )

    const columns = [
        {
            id: 'id',
            accessorKey: 'Username',
            header: 'Username',
        }, {
            id: 'name',
            accessorKey: 'name',
            header: 'PeerName',
        }, {
            id: 'Url',
            accessorKey: 'Url',
            header: 'Url',
        }, {
            id: 'Echo',
            accessorKey: 'Echo',
            header: 'Echo Peer',
            cell: (({ row }) => {
                return (
                    <Button className='otjs-button otjs-button-blue'
                        onClick={() => {
                            const name = row.original.name
                            apis.peers.echoPeer(name)
                                .then((response) => { toast.success('Version ' + name + ' = ' + response.Version, { data: { type: 'notification' } }) })
                                .catch((error) => { toast.error(error.statusText, { data: { type: 'notification' } }) })
                        }} > Echo </Button>
                )
            })
        }, {
            id: 'Remove',
            accessorKey: 'Remove',
            header: 'Remove Peer',
            cell: ({ row }) => {
                return (
                    <Button className='otjs-button otjs-button-red'
                        onClick={() => {
                            const name = row.original.name
                            deletePeer.mutate({ name })

                        }}> Remove </Button>
                )

            }
        }
    ]


    return (
        <CommonTableV8 data={peersData} columns={columns} />
    )


}