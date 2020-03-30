import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadAvailableAETS } from '../../../actions/OrthancTools'
import { addManualQueryStudyResult } from '../../../actions/ManualQuery'

import AetButton from '../Components/AetButton'
import apis from '../../../services/apis'

import SelectModalities from '../../AutoQuery/Component/SelectModalities'

class QueryForm extends Component {

  state = {
    lastName : '',
    firstName : '',
    modalities : '',
    dateFrom : '',
    dateTo : '',
    patientId : '',
    studyDescription : '',
    accessionNumber : ''
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.updateModalities = this.updateModalities.bind(this)
  }

  async componentDidMount(){
    this.props.loadAvailableAETS(await apis.aets.getAets())
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

  async doQueryTo (aet) {

      let dateFrom = this.state.dateFrom
      let dateTo = this.state.dateTo

      //Prepare Date string for post data
      let dateString = '*';
      dateFrom = dateFrom.split('-').join('')
      dateTo = dateTo.split('-').join('')
      if (dateFrom !== '' && dateTo !== '') {
        dateString = dateFrom + '-' + dateTo
      } else if (dateFrom === '' && dateTo !== '') {
        dateString = '-' + dateTo
      }

      let patientName = ''

      let inputLastName = this.state.lastName
      let inputFirstName = this.state.firstName

      if(inputLastName === '' && inputFirstName !== ''){
        patientName = '^'+inputFirstName
      } else if (inputLastName !== '' && inputFirstName === ''){
        patientName = inputLastName
      }else if (inputLastName !== '' && inputFirstName !== '') {
        patientName = inputLastName+'^'+inputFirstName
      }
    
      //Prepare POST payload for query (follow Orthanc APIs)
      let queryPost = {
        Level: 'Study',
        Query: {
          PatientName: patientName,
          PatientID: this.state.patientId,
          StudyDate: dateString,
          ModalitiesInStudy: this.state.modalities,
          StudyDescription: this.state.studyDescription,
          AccessionNumber: this.state.accessionNumber,
          NumberOfStudyRelatedInstances: '',
          NumberOfStudyRelatedSeries: ''
        },
        Normalize : false
      }
    
    let queryAnswer = await apis.query.dicomQuery(aet,queryPost)
    let answers = await apis.query.retrieveAnswer(queryAnswer['ID'])
    answers.forEach((answer)=> {
      this.props.addManualQueryStudyResult(answer)
    })
    
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

const mapDispatchToProps = {
  loadAvailableAETS,
  addManualQueryStudyResult
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryForm)
