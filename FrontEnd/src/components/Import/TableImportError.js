import React, {Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator';

class TableImportError extends Component{
    
    columns = [{
        dataField: 'fileID', 
        hidden: true
    }, {
        dataField: 'filename', 
        text: 'FileName', 
        sort: true,
    }, {
        dataField: 'error', 
        text: 'Error Message', 
        sort: true, 
    }]

    
    render(){
        return (
            <Fragment>
                <BootstrapTable keyField={'fileID'} striped={true} columns={this.columns} pagination={paginationFactory()} {...this.props} />
            </Fragment>
        )
    }


}

export default TableImportError 