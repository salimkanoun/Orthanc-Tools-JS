import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ActionBouton from './ActionBouton'
import apis from '../../services/apis'

class TableStudy extends Component{

    state = {
        studies :  []
    }

    constructor(props){
        super(props)
        this.setState({
            studies : props.studies
        })
        this.componentDidMount = this.componentDidMount.bind(this)
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
        formatter: ((value, row, index) => <ActionBouton level='studies' orthancID={this.props.data[index].studyOrthancID} />)
    }]

    /**
     * Ici a évaluer, si les details ne sont pas envoyés dans les props il faut les fetch depuis orthanc (
     * pour rendre ce composant réutilisables)
     * ou sinon faire cette injection de data par un HOC (Higher Order component => Faut que tu vois le cours c'est un composant qui renvoie un composant)
     * https://fr.reactjs.org/docs/higher-order-components.html
     */
    async componentDidMount(){
        if(this.state.studies.length === 0){
            let studiesDetails = await apis.content.getStudiesDetails(this.props.studiesID)
            this.setState({studies: studiesDetails})
            //Faire Appel API pour load les data des studies du patient (dont l'ID doit venir en prop du coup)
            // GET /patients/{id}
            //le patient ID sera dans les props (ex : this.props.parentPatientID)
        }
    }

    render(){
        return (
            <BootstrapTable keyField="studyOrthancID" striped={true} columns={this.columns} data={this.state.studies} selectRow={ this.props.selectRow } rowEvents={ this.props.rowEvents } />
        )
    }

}

export default TableStudy