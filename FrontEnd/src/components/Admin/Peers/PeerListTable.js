import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import apis from '../../../services/apis';

/**
 * Table with known Peers details with Echo and Remove butto
 */

 export default class Peer extends Component{

     columns = [{
         dataField: 'Username', 
         text: 'Username'
     }, {
         dataField: 'name', 
         text: 'PeerName'
     }, {
        dataField: 'Url',
        text : 'Url'
    }, {
        dataField : 'Echo',
        text : 'Echo Peer',
        formatter : (cell, row, rowIndex) => {
            return (<div className="text-center">
                <input type="button" className='btn btn-info' onClick = {() => apis.peers.echoPeer(row.name)} value = "Echo" />
            </div>)
        }
    }, {
        dataField : 'Remove',
        text : 'Remove Peer',
        formatter : (cell, row, rowIndex, parentComponent) => {
            return (
            <div className="text-center">
                <input type="button" className='btn btn-danger' onClick = {async () => {await apis.peers.deletePeer(row.name); parentComponent.props.refreshPeerData()}} value = "Remove" />
            </div>)
        },
        formatExtraData : this
    }]

    /**
     * Translate Orthanc API in array of Rows to be consumed by BootstrapTable
     */
    orthancApisToRows = () => {

        let peersAnswer = this.props.peersData
        let rows =  []

        for (const peerName in peersAnswer) {
            rows.push({
                name : peerName,
                ...peersAnswer[peerName]
            })

        }
        
        return rows
    }

    render = () => {
        return (
            <Fragment>
                <BootstrapTable keyField="name" striped={true} data={this.orthancApisToRows()} columns={this.columns} wrapperClasses='table-responsive'/>
            </Fragment>
        )
    }

 }