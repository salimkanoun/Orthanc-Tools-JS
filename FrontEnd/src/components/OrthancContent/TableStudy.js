import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'

class TableStudy extends Component {

    columns = [{
        dataField: 'studyOrthancID', 
        hidden: true
    }, {
        dataField: 'studyDate', 
        text: 'Study Date'
    }, {
        dataField: 'studyDescription', 
        text: 'description'
    }, {
        dataField: 'accessionNumber', 
        text: 'Accession Number'
    }, {
        dataField: 'action', 
        text: 'Action', 
        formatter:  ( (value, row, index) => 
            <ActionBouton level='studies' orthancID={row.studyOrthancID} />
        )
    }]

    render() {
        return (
            <BootstrapTable keyField="studyOrthancID" striped={true} columns={this.columns} data={this.props.studies} selectRow={ this.props.selectRow } rowEvents={ this.props.rowEvents } />
        )
    }

}

export default TableStudy