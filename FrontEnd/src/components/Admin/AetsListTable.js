import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';

/**
 * Table with known AETs details with Echo and Remove button
 */
export default class Aets extends Component {

    /**
     * Column defition for Bootstrap Table
     */
    columns = [{
        dataField: 'name',
        text : 'Name'
    }, {
        dataField: 'AET',
        text : 'AET'
    }, {
        dataField: 'Host',
        text : 'Host'
    }, {
        dataField: 'Port',
        text : 'Port'
    },{
        dataField : 'Manufacturer',
        text : 'Manufacturer'
    }, {
        dataField : 'echo',
        text : 'Echo AET',
        formatter : this.echoAetButton,
        formatExtraData : this.echoAetHandler
    }, {
        dataField : 'remove',
        text : 'Remove AET',
        formatter : this.deleteAetButton,
        formatExtraData : this
    }];

    /**
     * Echo AET button nested in Bootstrap Table
     * @param {*} cell 
     * @param {*} row 
     * @param {*} rowIndex 
     * @param {*} echoAetHandler 
     */
    echoAetButton(cell, row, rowIndex, echoAetHandler) {
        return (<div className="text-center">
            <input type="button" className='btn btn-info' onClick = {() => echoAetHandler(row.name)} value = "Echo" />
        </div>)
    }

    /**
     * Delete Button nested in BoostrapTable
     * @param {*} cell 
     * @param {*} row 
     * @param {*} rowIndex 
     * @param {*} parentComponent 
     */
    deleteAetButton(cell, row, rowIndex, parentComponent) {
        return (
        <div className="text-center">
            <input type="button" className='btn btn-danger' onClick = {async () => {await parentComponent.deleteAetHandler(row.name); parentComponent.props.refreshAetData()}} value = "Remove" />
        </div>)
    }

    /**
     * Echo AET and return result in an alertify dialog
     * @param {String} aetName 
     */
    echoAetHandler(aetName){

        fetch('/api/aets/' + aetName + '/echo', {
            method : 'GET'
        }).then( res => res.json() ).then((answer) => {
            if(answer){
                toast.success('Echo ' + aetName +' Sucess', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }else{
                toast.error('Echo ' + aetName +' Error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }

        })

    }

    /**
     * Trigger AET Delete API in Backend to delete an AET
     * @param {*} aetName 
     */
    async deleteAetHandler(aetName){
        await fetch('/api/aets/'+aetName, {
            method : 'DELETE'
        })
    }

    /**
     * Translate Orthanc API in array of Rows to be consumed by BootstrapTable
     */
    orthancApisToRows() {
        let aetsAnswer = this.props.aetsData
        let rows = []

        for (const aetName in aetsAnswer) {
            rows.push({
                name : aetName,
                ...aetsAnswer[aetName]
            })

        }

        return rows
    }

    render() {
        return (
            <Fragment>
                <BootstrapTable keyField="name" striped={true} data={this.orthancApisToRows()} columns={this.columns} />
            </Fragment>
        )
    }
}