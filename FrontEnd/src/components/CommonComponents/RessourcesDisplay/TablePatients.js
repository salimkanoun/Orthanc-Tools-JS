import React, {Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'
import paginationFactory from 'react-bootstrap-table2-paginator';

class TablePatients extends Component{
    
    columns = [{
        dataField: 'PatientOrthancID', 
        hidden: true
    }, {
        dataField: 'PatientName', 
        text: 'Patient Name', 
        sort: true,
    }, {
        dataField: 'PatientID', 
        text: 'Patient ID', 
        sort: true, 
    }, {
        dataField: 'Action', 
        text: 'Action',
        formatter: ( (value, row, index) => {
            return <ActionBouton level='patient' orthancID={row.PatientOrthancID} onDelete={this.props.onDelete} />
        })
    
    }]

    render(){
        return (
            <Fragment>
                <BootstrapTable keyField="PatientOrthancID" striped={true} data={this.props.patients} columns={this.columns} pagination={paginationFactory()} {...this.props}/>
                {this.props.button}
            </Fragment>
        )
    }


}

TablePatients.props = {
    onDelete : function(id){console.log('Deleted Patient ID '+id)}
}

export default TablePatients 