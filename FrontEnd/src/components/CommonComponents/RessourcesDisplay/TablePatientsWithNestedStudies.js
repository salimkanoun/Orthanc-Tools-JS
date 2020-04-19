import React, { Component } from 'react'
import TableStudy from './TableStudy'

export default function tablePatientWithNestedStudies(TablePatients) {
    class TablePatientsWithNestedStudies extends Component {

        expandRow = {
            showExpandColumn: true,
            renderer: (row) => {
                //Flatenning the study array for the nested study table
                let studies = row.studies 
                let answer = []
                for(let study in studies) {
                    answer.push( {
                        StudyOrthancID  : study,
                        ...studies[study]
                    })
                }
      
                return (
                    <TableStudy data={answer} parentPatientId={row.PatientOrthancID} onDelete={ this.props.onDeleteStudy } rowEvents={this.props.rowEventsStudies} />
                )
            }
                 
        }
        
        render(){
            return(
                <TablePatients studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} {...this.props} />
            )
        }
    }

    return TablePatientsWithNestedStudies
}