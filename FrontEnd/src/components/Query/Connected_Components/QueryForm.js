import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadAvailableAETS } from '../../../actions/OrthancTools'
import { addManualQueryStudyResult } from '../../../actions/ManualQuery'

import AetButton from '../Components/AetButton'
import apis from '../../../services/apis'

import Form from '../../CommonComponents/SearchForm/Form'

class QueryForm extends Component {

  constructor(props){
    super(props)
    this.doQueryTo=this.doQueryTo.bind(this)
  }

  async componentDidMount(){
    this.props.loadAvailableAETS(await apis.aets.getAets())
  }

  async doQueryTo (formData, event) {
    console.log(event.target)
    let aet = event.target.value

    let dateFrom = formData.dateFrom
    let dateTo = formData.dateTo

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

    let inputLastName = formData.lastName
    let inputFirstName = formData.firstName

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
        PatientID: formData.patientID,
        StudyDate: dateString,
        ModalitiesInStudy: formData.modalities,
        StudyDescription: formData.studyDescription,
        AccessionNumber: formData.accessionNumber,
        NumberOfStudyRelatedInstances: '',
        NumberOfStudyRelatedSeries: ''
      },
      Normalize : false
    }
    
    let queryAnswer = await apis.query.dicomQuery(aet,queryPost)
    let answers = await apis.query.retrieveAnswer(queryAnswer['ID'])
    this.props.addManualQueryStudyResult(answers)

    
  }

  buildAetButtons () {
    return (this.props.aets.map((aet, key) =>
      <AetButton key={key} aetName={aet} />
    ))
  }

  render () {
      let aetButtons = null
      if (this.props.aets !== undefined ) {
        aetButtons = this.buildAetButtons()
      }
      return (
        <div className="jumbotron">
          <Form onFormValidate={this.doQueryTo} title='Query'>
            <div>
              {aetButtons}
            </div>
          </Form>
        </div>
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
