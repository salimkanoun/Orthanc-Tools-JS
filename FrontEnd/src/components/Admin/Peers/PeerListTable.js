import React, {Fragment, useMemo} from 'react'
import {toast} from 'react-toastify';
import apis from '../../../services/apis';
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

/**
 * Table with known Peers details with Echo and Remove butto
 */

export default function Peer({peersData, refreshPeerData}) {

    const columns = [{
        accessor: 'Username',
        Header: 'Username'
    }, {
        accessor: 'name',
        Header: 'PeerName'
    }, {
        accessor: 'Url',
        Header: 'Url'
    }, {
        id: 'Echo',
        Header: 'Echo Peer',
        Cell: ({row}) => {
            return (<div className="text-center">
                <input type="button" className='otjs-button otjs-button-blue' onClick={() => {
                    apis.peers.echoPeer(row.values.name).then((response) => {
                        toast.success('Version ' + row.values.name + ' = ' + response.Version)
                    }).catch((error) => toast.error(error.statusText))
                }
                } value="Echo"/>
            </div>)
        }
    }, {
        id: 'Remove',
        Header: 'Remove Peer',
        Cell: ({row}) => {
            return (
                <div className="text-center">
                    <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                        try {
                            await apis.peers.deletePeer(row.values.name);
                            refreshPeerData()
                        } catch (error) {
                            toast.error(error.statusText)
                        }
                    }} value="Remove"/>
                </div>)
        }
    }]

    const data = useMemo(() => Object.entries(peersData).map(([name, peer]) => ({name, ...peer})), [peersData]);

    return (
        <Fragment>
            <CommonTable tableData={data} columns={columns}/>
        </Fragment>
    )


}