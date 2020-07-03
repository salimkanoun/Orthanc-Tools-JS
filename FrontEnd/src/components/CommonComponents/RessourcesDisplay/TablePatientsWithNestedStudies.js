import React, { Component } from 'react'
import TableStudy from './TableStudy'
import TablePatients from './TablePatients'
class TablePatientsWithNestedStudies extends Component {

    selection = {
        selectedPatients : [],
        selectedStudies : []
    }

    static defaultProps = {
        setSelection: false
    }
    
    handleRowSelect(row, isSelected){
        if (isSelected){
            this.setState(prevState => ({selectedStudy: [...prevState.selectedStudy, {studyID: row.StudyOrthancID, row: row}]}))
        }else{
            let newList = this.state.selectedStudy.filter(study => study.studyID !== row.StudyOrthancID)
            this.setState({selectedStudy: newList})
        }
    }

    addIdToList (selectionArray, id) {
        selectionArray.push(id)
    }

    removeIdFromList(selectionArray, id){
        var index = selectionArray.indexOf(id);
        if (index !== -1) selectionArray.splice(index, 1);
    }

    getSelectedRessources(){
        return this.selection
    }

    getCurrentSelectedStudyId(){
        return 
    }

    changeSelectedAction(level, id, selected){
        if(level === 'Patient'){
            if (selected) this.addIdToList(this.selection.selectedPatients, id)
            else this.removeIdFromList(this.selection.selectedPatients, id)
        } else if (level === 'Study') {
            if (selected) this.addIdToList(this.selection.selectedStudies, id)
            else this.removeIdFromList(this.selection.selectedStudies, id)
        }

    }

    selectRowPatients = {
        mode: 'checkbox', 
        clickToExpand: true,
        onSelect: (row, isSelected) =>{
            this.changeSelectedAction('Patient', row.PatientOrthancID, isSelected)
        },
        onSelectAll: (isSelected, rows, e) => {
            rows.forEach(row =>{
                this.changeSelectedAction('Patient', row.PatientOrthancID, isSelected)
            })
        }
    }

    selectRowStudies = {
        mode: 'checkbox', 
        clickToExpand: true,
        onSelect: (row, isSelected) =>{
            this.changeSelectedAction('Study', row.StudyOrthancID, isSelected)
        },
        onSelectAll: (isSelected, rows, e) => {
            rows.forEach(row =>{
                this.changeSelectedAction('Study', row.StudyOrthancID, isSelected)
            })
        }
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
                <TableStudy {...this.props} data={answer} selectRow={this.props.setSelection ? this.selectRowStudies : undefined} parentPatientId={ row.PatientOrthancID } onDelete={ this.props.onDeleteStudy } rowEvents={this.props.rowEventsStudies} rowStyle={this.props.rowStyle}  />
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
            <TablePatients studies={this.props.studies} selectRow={this.props.setSelection ? this.selectRowPatients: undefined} expandRow={this.expandRow} onDelete={this.props.onDeletePatient} rowEvents={this.rowEvents} {...this.props} />
        )
    }
}

export default TablePatientsWithNestedStudies