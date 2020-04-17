import React, {Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import TableStudy from './TableStudy'
import ActionBouton from './ActionBouton'
import TableStudyFillFromParent from './TableStudyFillFromParent'

class TablePatients extends Component{

    constructor(props){
        super(props)
        this.setIdDeleted = this.setIdDeleted.bind(this)
    }

    

    state = {
        patients :  [], 
        idDeleted: ''
    }
    
    setIdDeleted(ID){
        this.setState({idDeleted: ID})
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
        text: 'action',
        formatter: ( (value, row, index) => {
            return <ActionBouton level='patient' orthancID={row.patientOrthancID} />
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
            
            if (this.state.idDeleted !== ''){
                answer = answer.filter(study => study.studyOrthancID !== this.state.idDeleted)
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