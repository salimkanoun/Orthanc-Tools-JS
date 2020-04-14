import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Dropdown from 'react-bootstrap/Dropdown'

class TablePatients extends Component{

    columns = [{
        dataField: 'patientOrthancID', 
        hidden: true
    }, {
        dataField: 'studies',
        text: 'Study',
        formatter: this.tableStudy
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
        text: 'action',
        formatter: this.actionButton
    }]

    actionButton(){
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            )
    }
    
    //patients's studies 
    tableStudy (cell, row, rowIndex) {
        console.log(cell)
        return(
            "{}"
            //<TableStudy rowData={cell}></TableStudy>
        )
    }
    
    render(){
        console.log(this.props.data)
        return (
            <BootstrapTable keyField="patientOrthancID" striped={true} data={this.props.data} columns={this.columns} /* expandRow={this.expandRow}*/ />
        )
    }


}

export default TablePatients 