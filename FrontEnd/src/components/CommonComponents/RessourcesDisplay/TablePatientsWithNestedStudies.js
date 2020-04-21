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
        this.handleOnExpand = this.handleOnExpand.bind(this)
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
                    ...studies[study]
                })
            }
    
            return (
                <TableStudy data={answer} parentPatientId={ row.PatientOrthancID } onDelete={ this.props.onDeleteStudy } rowEvents={this.props.rowEventsStudies} rowStyle={this.props.rowStyleStudies}/>
            )
        }, 
        onExpand: this.handleOnExpand
                
    }

    handleOnExpand(row, isExpand, rowIndex, e){
        console.log(row)
        if (isExpand)
            this.setState({selectedPatientID: row.PatientOrthancID}) //ne reconnait pas le this
        else
            this.setState({selectedPatientID: ''})
    }

    rowStyle = (row, rowIndex) => {
        const style = {};
        if(row.PatientOrthancID === this.state.selectedPatientID){
            style.backgroundColor = 'rgba(255,153,51)'
            style.borderTop = 'none';
        }

        return style;
    }

    
    render(){
        return(
            <TablePatients studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} rowStyle={this.rowStyle} rowEvents={this.rowEvents} {...this.props} />
        )
    }
}

export default TablePatientsWithNestedStudies