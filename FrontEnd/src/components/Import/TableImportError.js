import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator';

export default class TableImportError extends Component {

    columns = [{
        dataField: 'fileID',
        hidden: true
    }, {
        dataField: 'filename',
        text: 'FileName',
        sort: true,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }, {
        dataField: 'error',
        text: 'Error Message',
        sort: true,
        style: { whiteSpace: 'normal', wordWrap: 'break-word' }
    }]

    render = () => {
        return (
            <Fragment>
                <BootstrapTable keyField={'fileID'} striped={true} columns={this.columns} pagination={paginationFactory()}  wrapperClasses="table-responsive" {...this.props} />
            </Fragment>
        )
    }

}