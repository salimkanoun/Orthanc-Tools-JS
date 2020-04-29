import React, { Component } from 'react'
import TableStudy from './TableStudy'
import TablePatients from './TablePatients'
class TablePatientsWithNestedStudies extends Component {

    state = {
        selectedPatientID : ''
    }

    expandRow = {
        showExpandColumn: true,
        renderer: (row) => {
            //Flatenning the study array for the nested study table
            let studies = row.studies 
            let answer = []
            for(let study in studies) {
                answer.push( {
                    StudyOrthancID  : study,
                    PatientOrthancID: row.PatientOrthancID,
                    PatientID: row.PatientID, 
                    PatientName: row.PatientName,
                    ...studies[study]
                })
            }
            return (
                <TableStudy data={answer} parentPatientId={ row.PatientOrthancID } onDelete={ this.props.onDeleteStudy } rowEvents={this.props.rowEventsStudies} rowStyle={this.props.rowStyleStudies} button={this.props.button} {...this.props} />
            )
        }, 
        parentClassName: (isExpanded, row, rowIndex) => {
            if(isExpanded){
                return 'bg-info'
            }else{
                return ''
            }
        }
                
    }
    
    render(){
        return(
            <TablePatients  studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} rowStyle={this.rowStyle} rowEvents={this.rowEvents} {...this.props} />
        )
    }
}

export default TablePatientsWithNestedStudies