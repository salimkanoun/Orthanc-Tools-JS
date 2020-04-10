import React, { Component, Fragment } from 'react'
import SelectModalities from '../AutoQuery/Component/SelectModalities'
import Select from 'react-select'

class SearchForm extends Component{

    constructor(props){
        super(props)
        this.handleChange=this.handleChange.bind(this)
        this.handleClick=this.handleClick.bind(this)
        this.changeListener=this.changeListener.bind(this)
        this.updateModalities = this.updateModalities.bind(this)
        //this.dataSearch=this.dataSearch.binf(this)
    }
    
    state = {
        type: '',
        valeurType: '',
        firstName: '',
        studyDescription: '', 
        dateFrom: '', 
        dateTo: '',
        modalities: '',
        query: {}
    }

    content = {
        level: '',
        date: ''
    }

    options=[
        {value: 'patientName', label: "Patient name" },
        {value: 'patientID', label: "Patient ID" },
        {value: 'accessionNumber', label: "Acession number" }
    ]

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

    changeListener(event){
        this.setState({
            'type': event.value
        })
    }

    handleClick(event){
        this.dataSearch()
        console.log(this.state.query)
    }

    dataSearch(){
        //prepare query for API /tools/find

        //dateForm
        let date = ''
        date = this.state.dateFrom.replace('-', '').replace('-', '') + '-' + this.state.dateTo.replace('-', '').replace('-', '')
        //patient name
        let patientName = ''
        if (this.state.type === 'patientName'){
            patientName= this.state.valeurType + '^' + this.state.firstName
        }

        let contentSearch = {
            Level: 'Patient',
            CaseSensitive: true, 
            Query: {
                PatientName: '', 
                PatientID: '',
                AccessionNumber: '',
                StudyDate: date, 
                ModalityInStudy: this.state.modalities,
                StudyDescription: this.state.studyDescription
            }
        }

        switch(this.state.type){
            case 'patientName':
                contentSearch['Query']['PatientName'] = patientName
                break;
            case 'patientID':
               contentSearch['Query']['PatientID'] = this.state.valeurType
                break;
            case 'accessionNumber': 
                contentSearch['Query']['AccessionNumer'] = this.state.valeurType
                break; 
            default: 
                break; 
        }
        this.state.query = contentSearch
    }
    //form
    render(){
        return (
            <Fragment>
                <h2 className="card-title">Search</h2>
                <div className='row'>
                <div className='col-sm'>
                    <label htmlFor='type'>Type</label>
                    <Select name='type' single options={this.options} onChange={this.changeListener}/>
                </div>
                <div className='col-sm'>
                    <label />
                    <input type='text' name='valeurType' id='valeurType' className='form-control' onChange={this.handleChange} />
                </div>
                <div className='col-sm'>
                    <label htmlFor='firstName'>First Name</label>
                    <input type='text' name='firstName' id='firstName' className='form-control' placeholder='First name' onChange={this.handleChange} disabled={this.state.type !== 'patientName'} />
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
                <div className='row'>
                    <input type='button' className='btn btn-primary' onClick={this.handleClick} value='Search' />
                </div>
            </Fragment>
        )
    }
}

export default SearchForm
