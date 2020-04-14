import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Dropdown from 'react-bootstrap/Dropdown'

class TableStudy extends Component{

    columns = [{
        datafield: 'studyID', 
        hidden: true
    }, {
        datafield: 'studyDate', 
        text: 'Study Date'
    }, {
        datafield: 'studyDesctiption', 
        text: 'description'
    }, {
        datafield: 'accessionNumber', 
        text: 'Accession Number'
    }, {
        datafield: 'action', 
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

    render(){
        return (
            <BootstrapTable keyField="StudyID" striped={true} data={this.props.data} columns={this.columns} />
        )
    }

}

export default TableStudy