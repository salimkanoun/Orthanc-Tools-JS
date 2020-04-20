import React, { Component } from 'react'
import TableStudiesWithNestedSeries from './TableStudiesWithNestedSeries'
import TablePatients from './TablePatients'

class TablePatientsWithNestedStudiesAndSeries extends Component {

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
                <TableStudiesWithNestedSeries data={answer} parentPatientId={row.PatientOrthancID} onDeleteStudy={ this.props.onDeleteStudy } onDeleteSeries={ this.props.onDeleteSeries } />
            )
        }
                
    }
    
    render(){
        return(
            <TablePatients patients={this.props.patients} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} {...this.props} />
        )
    }
}

TableStudiesWithNestedSeries.props = {
    onDeletePatient : function (){},
    onDeleteStudy : function(){},
    onDeleteSeries : function(){}
}

export default TablePatientsWithNestedStudiesAndSeries
