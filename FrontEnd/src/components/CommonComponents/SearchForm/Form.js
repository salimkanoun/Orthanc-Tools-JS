import React, { Component } from 'react'
import SelectModalities from '../SearchForm/SelectModalities'

/**
 * Abstract search form
 * need props :
 * title : title of the form
 * buttons : buttons to validate and treat the form 
 * changeState : function to change the parent State
 */
class Search extends Component{

    state = {modalities: ''}

    constructor(props){
        super(props)
        this.handleChange=this.handleChange.bind(this)
        this.updateModalities = this.updateModalities.bind(this)
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
        
        this.props.changeState(name, value)

    }

    //form
    render(){
        return (
            <div>
                <h2 className="card-title">{this.props.title}</h2>
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
                <div className='row text-center mt-5'>
                    {this.props.buttons}
                </div>
            </div>
        )
    }

}
export default Search