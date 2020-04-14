import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Dropdown from 'react-bootstrap/Dropdown'

class TablePatients extends Component{

    columns = [{
        dataField: 'Key', 
        hidden: true
    }, {
        dataField: 'studies',
        text: 'Study',
        //formatter: this.tableStudy
    }, {
        dataField: 'patientName', 
        text: 'Patient Name', 
        sort: true,
    }, {
        dataField: 'patientId', 
        text: 'Patient ID', 
        sort: true, 
    }, {
        dataField: 'action', 
        text: 'action', 
        formatter: this.actionButton
    }]

    actionButton(){
        return (
            <div className="dropdown">
                <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    Dropdown button
                </button>
                <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <a className="dropdown-item" href="#">Something else here</a>
                </div>
            </div>)
    }
    /*
    //patients's studies 
    expandRow = {
        showExpandColumn: true,
        renderer : (row) => {
            return(
                <tableStudy rowData={row}></tableStudy>
            )
        }
    }
    */
    render(){
        return (
            <BootstrapTable keyField="key" striped={true} data={this.props.data} columns={this.columns} /* expandRow={this.expandRow}*/ />
        )
    }


}

export default TablePatients 