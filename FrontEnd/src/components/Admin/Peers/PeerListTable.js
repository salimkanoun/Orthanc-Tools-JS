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
        accessoryKey: 'Username',
        header: 'Username',
        cell : (row) => {row.getValue()},
    }, {
        id : 'name',
        accessoryKey: 'name',
        header: 'PeerName',
        cell : (row) => {row.getValue()},
    }, {
        id : 'Url',
        accessoryKey: 'Url',
        header: 'Url',
        cell : (row) => {row.getValue()},
    }, {
        id: 'Echo',
        accessoryKey : 'Echo',
        header: 'Echo Peer',
        Cell: ({ row }) => {
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
        accessoryKey : 'Remove',
        header: 'Remove Peer',
        Cell: ({ row }) => {
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