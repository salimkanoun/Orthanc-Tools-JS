import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadAvailableAETS } from '../../../actions/OrthancTools'
import { addManualQueryStudyResult } from '../../../actions/ManualQuery'

import AetButton from '../Components/AetButton'
import apis from '../../../services/apis'

import QueryForms from '../../CommonComponents/SearchForm/Form'
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


  buildAetButtons = () => {
    return (this.props.aets.map((aet, key) =>
      <AetButton key={key} aetName={aet} />
    ))
  }

  render = () => {
    return (
      <div>
        <QueryForms icon="fas fa-question" onFormValidate={(formData, event) => this.props.onQuery(formData, event.target.value)} title='Query'>
          <div>
            {this.props.aets !== undefined ? this.buildAetButtons() : null}
          </div>
        </QueryForms> 
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
