import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadAvailableAETS } from '../../../actions/OrthancTools'
import { addManualQueryStudyResult } from '../../../actions/ManualQuery'

import AetButton from '../Components/AetButton'
import apis from '../../../services/apis'

import Form from '../../CommonComponents/SearchForm/Form'

class QueryForm extends Component {

  state = {
    lastName : '',
    firstName : '',
    dateFrom : '',
    dateTo : '',
    patientId : '',
    studyDescription : '',
    accessionNumber : ''
  }

  constructor (props) {
    super(props)
    this.changeState = this.changeState.bind(this)
  }

  changeState(name, value){
    this.setState({[name]: value})
  }

  async componentDidMount(){
    this.props.loadAvailableAETS(await apis.aets.getAets())
  }

  

  async doQueryTo (aet) {

      let dateFrom = this.state.dateFrom
      let dateTo = this.state.dateTo

      //Prepare Date string for post data
      let dateString = '';
      dateFrom = dateFrom.split('-').join('')
      dateTo = dateTo.split('-').join('')
      if (dateFrom !== '' && dateTo !== '') {
        dateString = dateFrom + '-' + dateTo
      } else if (dateFrom === '' && dateTo !== '') {
        dateString = '-' + dateTo
      } else if (dateFrom !== '' && dateTo === ''){
        dateString = dateFrom + '-'
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

  render () {
      let aetButtons = null
      if (this.props.aets.length) {
        aetButtons = this.buildAetButtons()
      }
      return (
      <Form title='Query' buttons={aetButtons} changeState={this.changeState}/>
      )
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
