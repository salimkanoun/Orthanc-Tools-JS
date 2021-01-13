import BootstrapTable from "react-bootstrap-table-next";

import React, { Component, Fragment } from "react";
import apis from '../../../../services/apis';

export default class Certificates extends Component {

    columns = [{
        dataField: 'label',
        text: 'Label'
    },
    {
        dataField: 'delete',
        text: 'Delete certificate',
        formatter: (cell, row, rowIndex, parentComponent) => {
            return (
                <div className="text-center">
                    <input type="button" className='btn btn-danger' onClick={async () => { await apis.certificates.deleteCertificate(row.id); parentComponent.props.refreshCertificatesData() }} value="Remove" />
                </div>)
        },
        formatExtraData: this
    }];

    render() {
        return (
            <Fragment>
                <BootstrapTable keyField="name" striped={true} data={this.props.certificatesData} columns={this.columns} wrapperClasses='table-responsive' />
            </Fragment>
        )
    }
}

