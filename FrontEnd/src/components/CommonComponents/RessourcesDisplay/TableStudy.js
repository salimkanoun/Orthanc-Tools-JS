import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'

class TableStudy extends Component {

    columns = [{
        dataField: 'StudyOrthancID', 
        hidden: true
    }, {
        dataField: 'StudyDate', 
        text: 'Study Date'
    }, {
        dataField: 'StudyDescription', 
        text: 'Description'
    }, {
        dataField: 'AccessionNumber', 
        text: 'Accession Number'
    }, {
        dataField: 'Action', 
        text: 'Action', 
        formatter:  ( (value, row, index) => 
            <ActionBouton level='studies' orthancID={row.StudyOrthancID} StudyInstanceUID={row.StudyInstanceUID} onDelete={this.props.onDelete} />
        )
    }]

    render() {
        return (
            <BootstrapTable
                keyField="StudyOrthancID" 
                striped={true} 
                columns={this.columns} 
                data={this.props.data} 
                {...this.props} 
            />
        )
    }

}

export default TableStudy