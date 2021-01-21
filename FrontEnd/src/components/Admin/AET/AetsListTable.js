import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';
import apis from '../../../services/apis';

/**
 * Table with known AETs details with Echo and Remove button
 */
export default class Aets extends Component {

    columns = [{
        dataField: 'name',
        text: 'Name'
    }, {
        dataField: 'AET',
        text: 'AET'
    }, {
        dataField: 'Host',
        text: 'Host'
    }, {
        dataField: 'Port',
        text: 'Port'
    }, {
        dataField: 'Manufacturer',
        text: 'Manufacturer'
    }, {
        dataField: 'echo',
        text: 'Echo AET',
        formatter: (cell, row, rowIndex) => {
            return (<div className="text-center">
                <input type="button" className='btn btn-info' onClick={async () => {
                    try{
                        await apis.aets.echoAet(row.name)
                        toast.success(row.name + ' Success')
                    }catch(error){
                        toast.error(row.name + ' Echo Failure')
                    }
                    
                    }} value="Echo" />
            </div>)
        }
    }, {
        dataField: 'remove',
        text: 'Remove AET',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={async () => { 
                            try{
                                await apis.aets.deleteAet(row.name); 
                                parentComponent.props.refreshAetData() 
                            }catch(error){
                                toast.error(error.statusText)
                            }
                        }} value="Remove" />
                </div>)
        },
        formatExtraData: this
    }];

    /**
     * Translate Orthanc API in array of Rows to be consumed by BootstrapTable
     */
    orthancApisToRows = () => {

        let aetsAnswer = this.props.aetsData
        let rows = []

        for (const aetName in aetsAnswer) {
            rows.push({
                name: aetName,
                ...aetsAnswer[aetName]
            })

        }

        return rows
    }

    render = () => {
        return (
            <Fragment>
                <BootstrapTable keyField="name" striped={true} data={this.orthancApisToRows()} columns={this.columns} wrapperClasses='table-responsive' />
            </Fragment>
        )
    }
}