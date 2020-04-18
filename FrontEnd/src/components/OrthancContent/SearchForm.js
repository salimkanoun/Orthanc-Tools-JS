import React, { Component } from 'react'
import SelectModalities from '../CommonComponents/SearchForm/SelectModalities'


class SearchForm extends Component{

    state = {
        firstName: '',
        lastName: '', 
        patientID: '',
        accessionNumber: '', 
        studyDescription: '', 
        dateFrom: '', 
        dateTo: '',
        modalities: ''
    }

    constructor(props){
        super(props)
        this.handleChange=this.handleChange.bind(this)
        this.updateModalities = this.updateModalities.bind(this)
        this.dataSearch = this.dataSearch.bind(this)
    }

    /**
     * Store modality string comming from SelectModalities component in the current state
     * @param {String} modalityString 
     */
    updateModalities(modalityString){
        this.setState({
            modalities : modalityString
        })
    }

    /**
     * Fill input text of users in current state
     * @param {*} event 
     */
    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value
        
        this.setState({
            [name]: value
        })

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
            <div>
                <h2 className="card-title">Search</h2>
                <div className='row'>
                    <div className='col-sm'>
                        <label htmlFor='lastName'>Last Name</label>
                        <input type='text' name='lastName' id='lastName' className='form-control' placeholder='Last name' onChange={this.handleChange} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='firstName'>First Name</label>
                        <input type='text' name='firstName' id='firstName' className='form-control' placeholder='First name' onChange={this.handleChange} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='patientID'>Patient ID</label>
                        <input type='text' name='patientID' id='patientID' className='form-control' placeholder='Patient ID' onChange={this.handleChange} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm'>
                        <label htmlFor='accessionNumber'>Accession Number</label>
                        <input type='text' name='accessionNumber' id='accessionNumber' className='form-control' placeholder='Accession Number' onChange={this.handleChange} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='studyDescription'>Study Description</label>
                        <input type='text' name='studyDescription' id='studyDescription' className='form-control' placeholder='Study Description' onChange={this.handleChange} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='modalities'>Modalities</label>
                        <SelectModalities previousModalities={this.state.modalities} onUpdate={this.updateModalities} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm'>
                        <label htmlFor='dateFrom'>Date From</label>
                        <input type='date' name='dateFrom' id='dateFrom' className='form-control' placeholder='Date From' onChange={this.handleChange} />
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='dateTo'>Date To</label>
                        <input type='date' name='dateTo' id='dateTo' className='form-control' placeholder='Date To' onChange={this.handleChange} />
                    </div>
                </div>
                <div className='row mt-3 mb-3'>
                    <div className ='col-sm'>
                    <input type='button' className='btn btn-primary' onClick={this.dataSearch} value='Search' />
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchForm
