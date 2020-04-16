import React, {Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import TableStudy from './TableStudy'
import ActionBouton from './ActionBouton'
import apis from '../../services/apis'

class TablePatients extends Component{
    

    state = {
        patients :  []
    }

    constructor(props){
        super(props)
        console.log("props patients", this.props.patients)
        this.setState({
            patients : this.props.patients
        })
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    async componentDidMount(){
        if(this.state.patients.length === 0 && this.props.patientsID !== ""){
            let patientsDetails = await apis.content.getPatientsDetails(this.props.patientsID)
            this.setState({patients: patientsDetails})
        }
        console.log("tablePatient state = ", this.state)
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
        formatter: ((value, row, index) => <ActionBouton level='patient' orthancID={this.props.patients[index].patientOrthancID} />)
    
    }]

    expandRow = {
        showExpandColumn: true,
        renderer: (row) => {
            // SK : J'ai modifié ici j'ai pas compris ce que t'avais fait,
            //Ici quand tu clique sur expand tu a les data de la row courrante qui t'est passée en parametre
            //Il suffit de recupérer la clé studies qui contient ton array de studies,
            // tu boucle sur la propriété ID pour eclater cette propriété dans un array de JSON ou la propriété devient un clé additionelle au reste
            let studies = row.studies 
            let answer = []
            for(let study in studies) {
                answer.push( {
                    studyOrthancID  : study,
                    ...studies[study]
                })
            }
            return (
                <TableStudy studies={answer} selectRow={ this.props.selectRow } rowEvents={this.props.rowEvents} />
            )
        }
             
    }
    
    render(){
        return (
            <BootstrapTable keyField="patientOrthancID" striped={true} data={this.state.patients} columns={this.columns} expandRow={this.expandRow}/>
        )
    }


}

TablePatients.defaultProps = {
    patients: [], 
    patientsID: ""
}

export default TablePatients 