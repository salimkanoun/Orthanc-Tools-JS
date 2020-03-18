import React, { Component } from 'react'
import AetButton from './AetButton'
import api from '../../../services/aets'
import * as actions from '../../../actions/OrthancTools'

import { connect } from 'react-redux'
import SelectModalities from '../../AutoQuery/Component/SelectModalities'

class QueryForm extends Component {

  state = {
    modalities : ''
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.updateModalities = this.updateModalities.bind(this)
  }

  async componentDidMount(){
    this.props.loadAvailableAETS(await api.getAets())
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
   * Fill current form values in state
   * @param {*} event 
   */
  handleChange (event) {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({
      [name] : value
    })
  }

  render () {
    let aetButtons = null
    if (this.props.aets.length) {
      aetButtons = this.buildAetButtons()
    }
    return (
      <div className='jumbotron'>
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
            <SelectModalities previousModalities={this.state.modalities} onUpdate={this.updateModalities} />
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

  //SK TODO : LISTENER TO MAKE MANUAL QUERY
  doQueryTo (aet) {
    console.log(aet)
    console.log(this.state)
    
  }

  buildAetButtons () {
    return (this.props.aets.map((aet, key) =>
      <AetButton key={key} aetName={aet} clickListner={() => this.doQueryTo(aet)} />
    ))
  }
}

const mapStateToProps = (state) => {
  return {
    aets: state.OrthancTools.OrthancAets
  }
}

export default connect(mapStateToProps, actions)(QueryForm)
