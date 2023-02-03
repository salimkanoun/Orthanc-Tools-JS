import React, { Fragment, useMemo } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';

/**
 * Table with known Peers details with Echo and Remove butto
 */

export default ({ peersData, refreshPeerData }) => {

    
    const data = useMemo(() => Object.entries(peersData).map(([name, peer]) => ({ name, ...peer })), [peersData]);

    const columns = [
    {
        id : 'id',
        accessorKey: 'Username',
        header: 'Username',
    }, {
        id : 'name',
        accessorKey: 'name',
        header: 'PeerName',
    }, {
        id : 'Url',
        accessorKey: 'Url',
        header: 'Url',
    }, {
        id: 'Echo',
        accessorKey : 'Echo',
        header: 'Echo Peer',
        cell: ({ row }) => {
            return (<div className="text-center">
                <input type="button" className='otjs-button otjs-button-blue' onClick={() => {
                    apis.peers.echoPeer(row.values.name).then((response) => {
                        toast.success('Version ' + row.values.name + ' = ' + response.Version, {data:{type:'notification'}})
                    }).catch((error) => toast.error(error.statusText, {data:{type:'notification'}}))
                }
                } value="Echo" />
            </div>)
        }
    }, {
        id: 'Remove',
        accessorKey : 'Remove',
        header: 'Remove Peer',
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                        try {
                            await apis.peers.deletePeer(row.values.name);
                            refreshPeerData()
                        } catch (error) {
                            toast.error(error.statusText, {data:{type:'notification'}})
                        }
                    }} value="Remove" />
                </div>)
        }
    }
]


    return (
        <Fragment>
            <CommonTableV8 data={data} columns={columns} />
        </Fragment>
    )


}