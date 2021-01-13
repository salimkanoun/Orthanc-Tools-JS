import BootstrapTable from "react-bootstrap-table-next";

import React, { Component, Fragment } from "react";
import apis from '../../../../services/apis';

export default class SshKeys extends Component {

    columns = [{
        dataField: 'label',
        text: 'Label'
    },
    {
        dataField: 'pass',
        text: 'Has a passphrase',
        formatter: (cell, row, rowIndex, parentComponent) => <p>{(row.pass ? '✓' : '✖')}</p>
    },
    {
        dataField: 'delete',
        text: 'Delete Key',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={async () => { await apis.sshKeys.deleteKey(row.id); parentComponent.props.refreshSshKeysData() }} value="Remove" />
                </div>
            )
        },
        formatExtraData: this
    }];

    render = () => {
        return (
            <Fragment>
                <BootstrapTable keyField="name" striped={true} data={this.props.sshKeysData} columns={this.columns} wrapperClasses='table-responsive' />
            </Fragment>
        )
    }
}

