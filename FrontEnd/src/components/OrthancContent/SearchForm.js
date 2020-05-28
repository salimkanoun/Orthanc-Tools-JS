import React, { Component, createRef } from 'react'
import Form from '../CommonComponents/SearchForm/Form'


class SearchForm extends Component{

    constructor(props){
        super(props)
        this.dataSearch = this.dataSearch.bind(this)
        this.child = createRef()
    }

    dataSearch(){
        ///get Form state 
        let formData = this.child.current.getState()

        //prepare query for API /tools/find

        //dateForm
        let date = ""
        if (formData.dateFrom !== "" || formData.dateTo !== "") //if dateFrom or dateTo isn't empty 
            date = formData.dateFrom.replace('-', '').replace('-', '') + '-' + formData.dateTo.replace('-', '').replace('-', '')
        //patient name
        let patientName = ""
        if (formData.lastName !== '' && formData.firstName ==='')
            patientName = formData.lastName
        else if (formData.lastName === '' && formData.firstName !== '')
            patientName = '^' + formData.firstName
        else if (formData.lastName !== '' && formData.firstName !== '')
            patientName = formData.lastName + '^' + formData.firstName

        let contentSearch = {
            Level: 'Study',
            CaseSensitive: false,
            Expand: true, 
            Query: {
                PatientName: patientName, 
                PatientID: formData.patientID,
                AccessionNumber: formData.accessionNumber,
                StudyDate: date, 
                ModalitiesInStudy: formData.modalities,
                StudyDescription: formData.studyDescription
            }
        }

        //Call submit function to be handled by parent
        this.props.onSubmit(contentSearch)

    }

    //form
    render(){
        return (
            <Form ref={this.child} title="Search" buttons={<input type='button' className='btn btn-primary' onClick={this.dataSearch} value='Search' />} />
        )
    }
}

export default SearchForm
