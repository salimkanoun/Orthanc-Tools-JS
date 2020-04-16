import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Dropdown from 'react-bootstrap/Dropdown'


class TableSeries extends Component{

    data = [
        {
            "ExpectedNumberOfInstances" : null,
            "ID" : "8db139eb-f24f5f22-5affe387-c3921e73-a156fb9f",
            "Instances" : [ "d74a5d57-f1cc58b9-696179d7-4614466c-20afcfc5" ],
            "IsStable" : true,
            "LastUpdate" : "20200409T114105",
            "MainDicomTags" : {
               "BodyPartExamined" : "",
               "Manufacturer" : "SIEMENS NM",
               "Modality" : "NM",
               "SeriesDate" : "20160920",
               "SeriesDescription" : "STAT CRANE",
               "SeriesInstanceUID" : "1.2.276.0.7230010.3.1.3.1017770707.2892.1499419901.273",
               "SeriesNumber" : "1000",
               "SeriesTime" : "103324.00"
            },
            "ParentStudy" : "5bfd4d78-11b6db93-fc0bde23-c24a2c57-77d75cc4",
            "Status" : "Unknown",
            "Type" : "Series"
         }
    ]
    columns = [{
        dataField: 'serieOrthancID', 
        hidden: true,
    }, {
        dataField: 'SeriesDescription', 
        text: 'Description'
    }, {
        dataField: 'Modality', 
        text: 'Modality'
    },{
        dataField: 'Instances', 
        text: 'Instances'
    }, {
        dataField: 'SeriesNumber',
        text: 'Series Number', 
        sort: true
    }, {
        dataField: 'Action', 
        text: 'Action',
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

    componentDidMount(){
        //Appeler API /studies/{id}? GET

    }

    render(){
        return (
            <BootstrapTable keyField="serieOrthancID" striped={true} data={this.props.data} columns={this.columns} />
        )
    }
}

export default TableSeries