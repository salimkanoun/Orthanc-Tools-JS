import BootstrapTable from "react-bootstrap-table-next";

import React, { Component, Fragment } from "react";
import apis from '../../../services/apis';

export default class FtpEndpoints extends Component {

    columns = [{
        dataField: 'label',
        text: 'Label'
    },
    {
        dataField: 'host',
        text: 'Host'
    },
    {
        dataField: 'username',
        text: 'Username'
    },
    {
        dataField: 'targetFolder',
        text: 'Target Folder'
    },
    {
        dataField: 'ssl',
        text: 'Use ssl?',
        formatter: (cell, row, rowIndex, parentComponent) => <p>{(row.ssl ? '✓' : '✖')}</p>
    },
    {
        dataField: 'delete',
        text: 'Delete endpoint',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={async () => { await apis.endpoints.deleteEndpoints(row.id); parentComponent.props.refreshEndpointsData() }} value="Remove" />
                </div>)
        },
        formatExtraData: this
    }];

    render = () => {
        return (
            <Fragment>
                <h2>FTP/FTPS Export Endpoints</h2>
                <BootstrapTable keyField="name" striped={true} data={this.props.endpointsData} columns={this.columns} wrapperClasses='table-responsive' />
            </Fragment>
        )
    }

}

