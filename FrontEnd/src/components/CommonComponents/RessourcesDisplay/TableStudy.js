import React, {Component, Fragment} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'

class TableStudy extends Component {

    columns = [{
        dataField: 'StudyOrthancID', 
        hidden: true
    }, {
        dataField: 'StudyDate', 
        text: 'Study Date', 
        sort: true
    }, {
        dataField: 'StudyDescription', 
        text: 'Description',
        sort: true
    }, {
        dataField: 'AccessionNumber', 
        text: 'Accession Number',
        sort: true
    }, {
        dataField: 'Action', 
        text: 'Action', 
        formatter:  ( (value, row, index) => 
            <ActionBouton level='studies' orthancID={row.StudyOrthancID} StudyInstanceUID={row.StudyInstanceUID} onDelete={this.props.onDelete} />
        ),
        clickToSelect: false
    }]

    render() {
        return (
            <Fragment>
                <BootstrapTable
                    keyField="StudyOrthancID" 
                    striped={true} 
                    columns={this.columns} 
                    data={this.props.data} 
                    {...this.props} 
                />
                {this.props.button}
            </Fragment>
        )
    }

}

export default TableStudy