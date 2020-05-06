import React, {Component, Fragment} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'
import paginationFactory from 'react-bootstrap-table2-paginator'

class TableStudy extends Component {
    

    static defaultProps = {
        hiddenActionBouton: false, 
        hiddenRemoveRow: true, 
        pagination: false, 
        hiddenName: true, 
        hiddenID: true, 
        hiddenAccessionNumber: false
    }

    getSelectedItems(){
        return this.node.selectionContext.selected
    }

    columns = [{
        dataField: 'StudyOrthancID', 
        hidden: true
    }, {
        dataField: 'PatientName', 
        text: 'Patient Name', 
        sort: true, 
        hidden: this.props.hiddenName
    }, {
        dataField: 'PatientID', 
        text: 'Patient ID', 
        sort: true, 
        hidden: this.props.hiddenID
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
        sort: true, 
        hidden: this.props.hiddenAccessionNumber
    }, {
        dataField: 'Action', 
        text: 'Action', 
        hidden: this.props.hiddenActionBouton,
        formatter:  ( (value, row, index) => 
            <ActionBouton level='studies' orthancID={row.StudyOrthancID} StudyInstanceUID={row.StudyInstanceUID} onDelete={this.props.onDelete} />
        ),
        clickToSelect: false
    }, {
        dataField: 'Remove', 
        text: 'Remove',
        hidden: this.props.hiddenRemoveRow,
        formatter: (cell, row, index) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {e.stopPropagation(); this.props.onDelete(row.StudyOrthancID)}}>Remove</button>
        }
    
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
                    pagination={this.props.pagination ? paginationFactory() : undefined}
                />
                {this.props.button}
            </Fragment>
        )
    }

}

export default TableStudy