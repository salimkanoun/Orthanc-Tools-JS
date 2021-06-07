import BootstrapTable from "react-bootstrap-table-next";

import React, { Component, Fragment } from "react";

export default class SftpEndpoints extends Component {

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
        dataField: 'sshKey',
        text: 'Ssh Private Key',
        formatter: (cell, row, rowIndex, parentComponent) => <p>{(row.sshKey ? row.sshKey.label : '✖')}</p>
    },
    {
        dataField: 'delete',
        text: 'Delete endpoint',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={async () => { await parentComponent.props.onDeleteEndpoint(row.id) }} value="Remove" />
                </div>)
        },
        formatExtraData: this
    }];

    render = () => {
        return (
            <Fragment>
                <h2>SFTP Export Endpoints</h2>
                <BootstrapTable keyField="name" striped={true} data={this.props.endpointsData} columns={this.columns} wrapperClasses='table-responsive' />
            </Fragment>
        )
    }
}

