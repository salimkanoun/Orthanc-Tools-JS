import React, { Component, createRef } from 'react'
import TableStudy from './TableStudy'
import TablePatients from './TablePatients'
class TablePatientsWithNestedStudies extends Component {

    state = {
        selectedPatientID : '',
        selectedStudy: []
    }

    constructor(props){
        super(props)
        this.refPatient = createRef()
        this.handleRowSelect = this.handleRowSelect.bind(this)
        this.getSelectedStudies = this.getSelectedStudies.bind(this)
    }

    getSelectedItems(){
        return this.refPatient.current.getSelectedItems()
    }

    getSelectedStudies(){
        return this.state.selectedStudy
    }
    
    handleRowSelect(row, isSelected){
        if (isSelected){
            this.setState({selectedStudy: [...this.state.selectedStudy, {studyID: row.StudyOrthancID, row: row}]})
        }else{
            let newList = this.state.selectedStudy.filter(study => study.studyID !== row.StudyOrthancID)
            this.setState({selectedStudy: newList})
        }
    }

    expandRow = {
        handleRowSelect: (row, isSelected) =>{
            console.log(row)
        },
        showExpandColumn: true,
        renderer: (row) => {
            const selectRow={
                mode: 'checkbox', 
                clickToExpand: true,
                nonSelectable: this.props.selectedID,
                onSelect: this.handleRowSelect,
              }
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
                <TableStudy {...this.props} data={answer} selectRow={selectRow}  parentPatientId={ row.PatientOrthancID } onDelete={ this.props.onDeleteStudy } rowEvents={this.props.rowEventsStudies} rowStyle={this.props.rowStyleStudies}  />
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
            <TablePatients ref={this.refPatient} studies={this.props.studies} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} rowStyle={this.rowStyle} rowEvents={this.rowEvents} {...this.props} />
        )
    }
}

export default TablePatientsWithNestedStudies