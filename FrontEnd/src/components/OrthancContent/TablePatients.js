import React, {Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Dropdown from 'react-bootstrap/Dropdown'
import TableStudy from './TableStudy'

class TablePatients extends Component{
    
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
        formatter: this.actionButton
    }]

    /**
     * Ici le dropdow devrait etre identique pour Patient / Studies / Series
     * Il devrait contenir  2 entrées Modify et Delete
     * On devrait pouvoir l'abstrait dans un composant qui aurait comme props le level (patient/study/series) et l'orthancID de la ressource qui l'instancie
     */
    actionButton(){
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            )
    }

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
                <TableStudy data={answer} selectRow={ this.props.selectRow } />
            )
        }
             
    }
    
    render(){
        return (
            <BootstrapTable keyField="patientOrthancID" striped={true} data={this.props.data} columns={this.columns} expandRow={this.expandRow}/>
        )
    }


}

export default TablePatients 