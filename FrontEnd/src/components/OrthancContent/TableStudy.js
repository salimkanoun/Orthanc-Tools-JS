import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Dropdown from 'react-bootstrap/Dropdown'

class TableStudy extends Component{

    state = {
        studies :  []
    }

    constructor(props){
        super(props)
        this.setState({
            studies : props.studies
        })
    }



    columns = [{
        dataField: 'studyOrthancID', 
        hidden: true
    }, {
        dataField: 'studyDate', 
        text: 'Study Date'
    }, {
        dataField: 'studyDescription', 
        text: 'description'
    }, {
        dataField: 'accessionNumber', 
        text: 'Accession Number'
    }, {
        dataField: 'action', 
        text: 'action', 
        formatter: this.actionButton
    }]

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

    /**
     * Ici a évaluer, si les details ne sont pas envoyés dans les props il faut les fetch depuis orthanc (
     * pour rendre ce composant réutilisables)
     * ou sinon faire cette injection de data par un HOC (Higher Order component => Faut que tu vois le cours c'est un composant qui renvoie un composant)
     * https://fr.reactjs.org/docs/higher-order-components.html
     */
    componentDidMount(){
        if(this.state.studies.length === 0){
            //Faire Appel API pour load les data des studies du patient (dont l'ID doit venir en prop du coup)
            // GET /patients/{id}
            //le patient ID sera dans les props (ex : this.props.parentPatientID)
        }
    }

    render(){
        return (
            <BootstrapTable keyField="studyOrthancID" striped={true} columns={this.columns} data={this.props.data} selectRow={ this.props.selectRow } />
        )
    }

}

export default TableStudy