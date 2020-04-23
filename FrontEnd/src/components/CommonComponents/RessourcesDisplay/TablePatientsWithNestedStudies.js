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
                    ...studies[study]
                })
            }
            console.log('answer = ', answer)
            console.log(row)
            return (
                <TableStudy data={answer} parentPatientId={ row.PatientOrthancID } onDelete={ this.props.onDeleteStudy } rowEvents={this.props.rowEventsStudies} rowStyle={this.props.rowStyleStudies} selectRow={this.props.selectRow} />
            )
        }, 
        parentClassName: (isExpanded, row, rowIndex) => {
            console.log(row)
            if(isExpanded){
                return 'bg-info'
            }else{
                return ''
            }
        }
                
    }
    
    render(){
        return(
            <TablePatients studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} rowStyle={this.rowStyle} rowEvents={this.rowEvents} {...this.props} />
        )
    }
}

export default TablePatientsWithNestedStudies