import React, {Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'

class TablePatients extends Component{

    state = {
        patients :  []
    }

    columns = [{
        dataField: 'patientOrthancID', 
        hidden: true
    }, {
        dataField: 'patientName', 
        text: 'Patient Name', 
        sort: true,
    }, {
        dataField: 'patientID', 
        text: 'Patient ID', 
        sort: true, 
    }, {
        dataField: 'action', 
        text: 'Action',
        formatter: ( (value, row, index) => {
            return <ActionBouton level='patient' orthancID={row.patientOrthancID} onDelete={this.props.onDelete} />
        })
    
    }]

    render(){
        return (
            <BootstrapTable keyField="patientOrthancID" striped={true} data={this.props.patients} columns={this.columns}  {...this.props}/>
        )
    }


}

TablePatients.props = {
    onDelete : function(id){console.log('Deleted Patient ID '+id)}
}

export default TablePatients 