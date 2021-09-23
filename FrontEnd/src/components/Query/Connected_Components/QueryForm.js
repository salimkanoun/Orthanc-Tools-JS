import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadAvailableAETS } from '../../../actions/OrthancTools'
import { addManualQueryStudyResult } from '../../../actions/ManualQuery'

import AetButton from '../Components/AetButton'
import apis from '../../../services/apis'

import Form from '../../CommonComponents/SearchForm/Form'
import { toast } from 'react-toastify'

class QueryForm extends Component {

  componentDidMount = async () => {
    
    try {
      let aets = await apis.aets.getAets()
      this.props.loadAvailableAETS(aets)
    } catch (error) {
      toast.error(error.statusText)
    }

  }

  doQueryTo = async (formData, event) => {

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
    } else if (dateFrom !== '' && dateTo === '') {
      dateString = dateFrom + '-'
    }

    let patientName = ''

    let inputLastName = formData.lastName
    let inputFirstName = formData.firstName

    if (inputLastName === '' && inputFirstName !== '') {
      patientName = '^' + inputFirstName
    } else if (inputLastName !== '' && inputFirstName === '') {
      patientName = inputLastName
    } else if (inputLastName !== '' && inputFirstName !== '') {
      patientName = inputLastName + '^' + inputFirstName
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
      }
    }


    try {
      let queryAnswer = await apis.query.dicomQuery(aet, queryPost)
      let answers = await apis.query.retrieveAnswer(queryAnswer['ID'])
      this.props.addManualQueryStudyResult(answers)
    } catch (error) {
        toast.error('Dicom Failure')
    }

  }

  buildAetButtons = () => {
    return (this.props.aets.map((aet, key) =>
      <AetButton key={key} aetName={aet} />
    ))
  }

  render = () => {
    return (
      <div>
        <Form icone="fas fa-question" onFormValidate={this.doQueryTo} title='Query'>
          <div>
            {this.props.aets !== undefined ? this.buildAetButtons() : null}
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
