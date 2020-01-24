import React, { Component } from 'react'
import AetButton from './aet_button'
import ChosenSelect from './chosen_select'

import { connect } from 'react-redux'
import * as actions from '../../../actions/FormInput'

class FormInput extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.addQueryToList = this.addQueryToList.bind(this)
  }

  handleChange (event) {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.props.setFormData(name, value)
  }

  render () {
    let aetButtons = null
    if (this.props.form.aets.length) {
      aetButtons = this.buildAetButtons()
    }
    return (
      <div className='jumbotron' style={this.props.style}>
        <h2 className='card-title'>Manual Input</h2>
        <div className='row'>
          <div className='col-sm'>
            <label htmlFor='lastName'>Last Name</label>
            <input type='text' name='lastName' id='lastName' className='form-control' placeholder='last name' value={this.props.value} onChange={this.handleChange} />
          </div>
          <div className='col-sm'>
            <label htmlFor='firstName'>First Name</label>
            <input type='text' name='firstName' id='firstName' className='form-control' placeholder='first name' value={this.props.value} onChange={this.handleChange} />
          </div>
          <div className='col-sm'>
            <label htmlFor='patientID'>Patient ID</label>
            <input type='text' name='patientId' id='patientId' className='form-control' placeholder='Patient ID' value={this.props.value} onChange={this.handleChange} />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm'>
            <label htmlFor='accessionNumber'>Accession Number</label>
            <input type='text' name='accessionNumber' id='accessionNumber' className='form-control' placeholder='Accession Number' value={this.props.value} onChange={this.handleChange} />
          </div>
          <div className='col-sm'>
            <label htmlFor='studyDescription'>Study Description</label>
            <input type='text' name='studyDescription' id='studyDescription' className='form-control' placeholder='Study Description' value={this.props.value} onChange={this.handleChange} />
          </div>
          <div className='col-sm'>
            <label htmlFor='modality'>Modality</label>
            <ChosenSelect />
          </div>

        </div>
        <div className='row'>
          <div className='col-sm'>
            <label htmlFor='dateFrom'>Date From</label>
            <input type='date' name='dateFrom' id='dateFrom' className='form-control' placeholder='Date From' value={this.props.value} onChange={this.handleChange} />
          </div>
          <div className='col-sm'>
            <label htmlFor='dateTo'>Date To</label>
            <input type='date' name='dateTo' id='dateTo' className='form-control' placeholder='Date To' value={this.props.value} onChange={this.handleChange} />
          </div>
        </div>

        <div className='row text-center mt-5'>
          {aetButtons}
        </div>
      </div>
    )
  };

  addQueryToList (aet) {
    const currentProps = this.props.form

    const modalityString = currentProps.modalities.join('/')

    let nameString = ''

    if (currentProps.lastName === '' && currentProps.firstName !== '') {
      nameString = '*^' + currentProps.firstName
    } else if (currentProps.lastName !== '' && currentProps.firstName === '') {
      nameString = currentProps.lastName + '^*'
    } else if (currentProps.lastName !== '' && currentProps.firstName !== '') {
      nameString = currentProps.lastName + '^' + currentProps.firstName
    }

    const query = {
      patientName: nameString,
      patientId: currentProps.patientId,
      accessionNumber: currentProps.accessionNumber,
      dateFrom: currentProps.dateFrom,
      dateTo: currentProps.dateTo,
      studyDescription: currentProps.studyDescription,
      modalities: modalityString,
      aet: aet
    }

    this.props.addQueryToList(query)
  }

  buildAetButtons () {
    return (this.props.form.aets.map((item, key) =>
      <AetButton key={key} aetName={item} clickListner={() => this.addQueryToList(item)} />
    ))
  }
}

const mapStateToProps = (state) => {
  return {
    form: state.FormInput
  }
}

export default connect(mapStateToProps, actions)(FormInput)
