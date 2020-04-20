import React, { Component } from 'react'
import Form from '../CommonComponents/SearchForm/Form'


class SearchForm extends Component{

    
    state = {
        firstName: '',
        lastName: '', 
        patientID: '',
        accessionNumber: '', 
        studyDescription: '', 
        dateFrom: '', 
        dateTo: ''
    }
    


    constructor(props){
        super(props)
        this.dataSearch = this.dataSearch.bind(this)
        this.changeState = this.changeState.bind(this)
    }

    changeState(name, value){
        this.setState({[name]: value})
    }


    dataSearch(){
        //prepare query for API /tools/find

        //dateForm
        let date = ""
        if (this.state.dateFrom !== "" || this.state.dateTo !== "") //if dateFrom or dateTo isn't empty 
            date = this.state.dateFrom.replace('-', '').replace('-', '') + '-' + this.state.dateTo.replace('-', '').replace('-', '')
        //patient name
        let patientName = ""
        if (this.state.lastName !== '' && this.state.firstName ==='')
            patientName = this.state.lastName
        else if (this.state.lastName === '' && this.state.firstName !== '')
            patientName = '^' + this.state.firstName
        else if (this.state.lastName !== '' && this.state.firstName !== '')
            patientName = this.state.lastName + '^' + this.state.firstName

        let contentSearch = {
            Level: 'Study',
            CaseSensitive: false,
            Expand: true, 
            Query: {
                PatientName: patientName, 
                PatientID: this.state.patientID,
                AccessionNumber: this.state.accessionNumber,
                StudyDate: date, 
                ModalityInStudy: this.state.modalities,
                StudyDescription: this.state.studyDescription
            }
        }

        //Call submit function to be handled by parent
        this.props.onSubmit(contentSearch)

    }

    //form
    render(){
        return (
            <Form title="Search" buttons={<input type='button' className='btn btn-primary' onClick={this.dataSearch} value='Search' />} changeState={this.changeState} />
        )
    }
}

export default SearchForm
