import React, {Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Dropdown from 'react-bootstrap/Dropdown'
import TableStudy from './TableStudy'

class TablePatients extends Component{
    
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

    traitementStudies(study){
        console.log("study = ", study)
        let responseMap = []
        let key = Object.keys(study)
        responseMap[Object.keys(key)] = {
            accessionNumber: study[key].accessionNumber, 
            isStable: study[key].isStable,
            lastUpdate: study[key].lastUpdate, 
            patientId: study[key].patientId, 
            series: study[key].series, 
            studyDate: study[key].studyDate, 
            studyDescription: study[key].studyDescription, 
            studyInstanceIUD: study[key].studyInstanceUID, 
            studyTime: study[key].studyTime 
        }
            
        return responseMap
    }


    expandRow = {
        showExpandColumn: true,
        renderer: (row) => {
            let responseMap = []
            let key = Object.keys(row.studies)
            responseMap[Object.keys(key)] = {
                accessionNumber: row.studies[key].accessionNumber, 
                isStable: row.studies[key].isStable,
                lastUpdate: row.studies[key].lastUpdate, 
                patientId: row.studies[key].patientId, 
                series: row.studies[key].series, 
                studyDate: row.studies[key].studyDate, 
                studyDescription: row.studies[key].studyDescription, 
                studyInstanceUID: row.studies[key].studyInstanceUID, 
                studyTime: row.studies[key].studyTime 
            }
            
            let answer = []
            for(let study in responseMap) {
                answer.push( {
                    studyOrthancID  : study,
                    ...responseMap[study]
                })
            }
            return (
                <TableStudy data={answer} selectRow={ this.props.selectRow } />
            )
        }
             
    }
    
    render(){
        return (
            <BootstrapTable keyField="patientOrthancID" striped={true} data={this.props.data} columns={this.columns} expandRow={this.expandRow}/>
        )
    }


}

export default TablePatients 