import React, { Component } from 'react'
import TableStudy from './TableStudy'
import TablePatients from './TablePatients'
class TablePatientsWithNestedStudies extends Component {

    state = {
        selectedPatientID : ''
    }

    constructor(props){
        super(props)
        this.rowStyle = this.rowStyle.bind(this)
    }

    expandRow = {
        showExpandColumn: true,
        parentClassName: 'rgba(255, 0, 0)',
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
                <TableStudy data={answer} parentPatientId={ row.PatientOrthancID } onDelete={ this.props.onDeleteStudy } rowEvents={this.props.rowEventsStudies} rowStyle={this.props.rowStyleStudies}/>
            )
        }
                
    }

    rowStyle = (row, rowIndex) => {
        const style = {};
        if(row.PatientOrthancID === this.state.selectedPatientID){
            style.backgroundColor = 'rgba(255,153,51)'
            style.borderTop = 'none';
        }

        return style;
    }
    rowEvents = {
        onClick : (e, row, rowIndex) => {
            this.setState({
                selectedPatientID : row.PatientOrthancID
            })
        } 
    }

    
    render(){
        return(
            <TablePatients studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} rowStyle={this.rowStyle} rowEvents={this.rowEvents} {...this.props} />
        )
    }
}

export default TablePatientsWithNestedStudies