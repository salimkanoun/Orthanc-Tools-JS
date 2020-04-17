import React, {Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import TableStudy from './TableStudy'
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

    expandRow = {
        showExpandColumn: true,
        renderer: (row) => {
            //Flatenning the study array for the nested study table
            let studies = row.studies 
            let answer = []
            for(let study in studies) {
                answer.push( {
                    studyOrthancID  : study,
                    ...studies[study]
                })
            }
  
            return (
                <TableStudy data={answer} parentPatientId={row.patientOrthancID} selectRow={ this.props.selectRow } rowEvents={ this.props.rowEvents } setIdDeleted={this.setIdDeleted} cleanSeries={this.props.cleanSeries} />
            )
        }
             
    }
    
    render(){
        return (
            <BootstrapTable keyField="patientOrthancID" striped={true} data={this.props.patients} columns={this.columns} expandRow={this.expandRow} />
        )
    }


}

export default TablePatients 