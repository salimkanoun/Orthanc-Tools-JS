import React, { Component } from 'react'
import Select from 'react-select'

import { connect } from 'react-redux'
import * as actions from '../actions/FormInput'

class ChosenSelect extends Component {

    modalities= [
      { value: 'CT', label: 'CT' },
      { value: 'PT', label: 'PT' },
      { value: 'NM', label: 'NM' },
      { value: 'MR', label: 'MR' },
      { value: 'US', label: 'US' },
      { value: 'MG', label: 'MG' }
    ]

    constructor(props){
      super(props)
      this.modalitiesListener = this.modalitiesListener.bind(this);
    }
    
    modalitiesListener(data){
        this.props.addModalities(data)
    }

    render = () => (
        <Select isMulti options={this.modalities}  onChange={this.modalitiesListener}/>
    )
}

const mapStateToProps = ( state )=>{
    return {
      modalities: state.FormInput.modalities
    }
  }


export default connect(mapStateToProps, actions)(ChosenSelect);