import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import apis from '../../../services/apis';

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
        formatter : this.echoAetButton
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
     */
    echoAetButton(cell, row, rowIndex) {
        return (<div className="text-center">
            <input type="button" className='btn btn-info' onClick = {() => apis.aets.echoAet(row.name)} value = "Echo" />
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
            <input type="button" className='btn btn-danger' onClick = {async () => {await apis.aets.deleteAet(row.name); parentComponent.props.refreshAetData()}} value = "Remove" />
        </div>)
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
                <BootstrapTable keyField="name" striped={true} data={this.orthancApisToRows()} columns={this.columns} wrapperClasses='table-responsive' />
            </Fragment>
        )
    }
}