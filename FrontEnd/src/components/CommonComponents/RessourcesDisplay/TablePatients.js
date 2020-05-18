import React, {Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'
import paginationFactory from 'react-bootstrap-table2-paginator';

class TablePatients extends Component{

    static defaultProps = {
        onDelete : function(id){console.log('Deleted Patient ID '+id)},
        hiddenActionBouton: false, 
        hiddenRemoveRow: true, 
        textNameColumn: 'Patient Name', 
        textIDColumn: 'Patient ID', 
        hiddenNewName: true, 
        hiddenNewID: true,
        modify: false
    }

    getSelectedItems(){
        console.log(this.node)
        return this.node.selectionContext.selected
    }
    
    columns = [{
        dataField: 'PatientOrthancID', 
        hidden: true
    }, {
        dataField: 'PatientName', 
        text: this.props.textNameColumn, 
        sort: true, 
        editable: this.props.modify
    }, {
        dataField: 'PatientID', 
        text: this.props.textIDColumn, 
        sort: true, 
        editable: this.props.modify
    }, {
        dataField: 'newPatientName', 
        text: 'New Name', 
        editable: true,
        hidden: this.props.hiddenNewName
    }, {
        dataField: 'newPatientID', 
        text: 'New ID', 
        editable: true, 
        hidden: this.props.hiddenNewID
    }, {
        dataField: 'Action', 
        text: 'Action',
        hidden: this.props.hiddenActionBouton,
        formatter: ( (value, row, index) => {
            return <ActionBouton level='patient' orthancID={row.PatientOrthancID} onDelete={this.props.onDelete} onModify={this.props.onModify} row={row} />
        })
    
    }, {
        dataField: 'Remove', 
        text: 'Remove',
        hidden: this.props.hiddenRemoveRow,
        formatter: (cell, row, index) => {
            return <button type="button" className="btn btn-danger" onClick={(e) => {e.stopPropagation(); this.props.onDelete(row.PatientOrthancID)}}>Remove</button>
        }, 
        editable: false
    
    }]

    
    render(){
        return (
            <Fragment>
                <BootstrapTable ref={n => this.node = n} keyField="PatientOrthancID" striped={true} data={this.props.patients} columns={this.columns} pagination={paginationFactory()} {...this.props}/>
                {this.props.button}
            </Fragment>
        )
    }


}

export default TablePatients 